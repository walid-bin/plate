import express, { Router,  json, urlencoded  } from "express";
import form from 'express-form-data';
import rateLimit from "express-rate-limit";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { services } from "./services";
import morgan from "morgan";
import actuator from "express-actuator";
import path from 'path';
import http2 from 'https';
import http from 'http';
import configHooks from "./hooks";
import { fileUp } from "./controllers/fileSystem/fileUp";
import * as operations from './controllers/database/operations';
import gracefullShutdown from "./controllers/gracefullShutdown";
import SearchCtrl from "./controllers/search/search";
import NewMailer from "./controllers/mail";

export default class App {
  constructor({ dependencies, settings }) {
    this.express = express();
    this.router = new Router();
    this.config = settings;
    this.depPromises = [];
    this.fileUp = fileUp;
    this.db = operations;
    this.search = new SearchCtrl();
    this.mail = NewMailer(this.config);
    // this.events = {};
    // this.wsMiddlewares = [socketAuth];

    if (dependencies) {
      this.depPromises = dependencies.map(({ method, args }) => {
        return new Promise((resolve, reject) =>
          method(...args)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        );
      })
    }
    Promise.all(this.depPromises)
      .then((res) => res && res.length > 0 && (console.log('[+] Dependencies:'), console.table(res)))
      .then(() =>this.init())
      .catch((err) => console.log(err));
  }


  init() {
    const { parse } = form;
    this.express.enable('trust proxy');

    // Rate Limiter
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    this.express.use(
      cors({
        origin: this.config.origin,
        credentials: true
      }));

    this.express.use(morgan('common')); // Logger
    this.express.use(actuator({ infoGitMode: 'full' })); // Health Checker
    this.express.use(json());
    this.express.use(urlencoded({ extended: false })); // Legacy URL encoding
    this.express.use(cookieParser()); // Parse cookies
    this.express.use(parse()); // Parse Form data as JSON
    this.express.use('/api', limiter, this.router); // All the API routes
    this.express.use(express.static(path.resolve(__dirname, '..', 'client'))); // REACT build files (Statics)

    if (this.config.useHTTP2) {
      // SSL configuration
      this.ssl = {
        key: readFileSync(path.resolve('ssl', 'privatekey.pem')),
        cert: readFileSync(path.resolve('ssl', 'certificate.pem')),
      };

      this.options = {
        ...this.ssl,
        allowHTTP1: true
      };

      // Server
      this.server = http2.createServer(this.options, this.express);

      // Load the Hooks
      // hooks(this); 
    } else {
      this.server = http.createServer(this.express);
    }
    configHooks(this);
    services(this);
    this.ready = true;
    gracefullShutdown.call({ ...this });
  }
  start() {
    const readyStatus = setInterval(() => {
      if (this.ready) {
        this.listen();
        clearInterval(readyStatus);
      }
    }, 300);
  }

  listen() {
     // Serve Front-end
     this.express.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
     });
    
     // Serve Front-end
     this.server.listen(this.config.port, () => {
      console.log(`[+] Listening on ${this.config.port}`);
    });
  }

  configure(serviceFunc) {
    serviceFunc.call({
      ...this.express,
      route: this.router,
      fileUp: this.fileUp,
      db: this.db,
      lyra: this.search,
      settings: this.config
      // ws: this.socket,
      // mail: this.mail,
    });
  }
   
  /**
   * Register Hooks
   * @param {function} callback function of hook
   */
  hook(callback) {
    callback.call({ ...this });
  }
}