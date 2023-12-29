import express, { Router } from "express";

export default class App {
  constructor({ dependencies, settings }) {
    this.express = express();
    this.router = new Router();
    this.config = settings;
    this.depPromises = [];
    // this.search = new SearchCtrl();
    // this.mail = NewMailer(this.config);
    // this.fileUp = fileUp;
    // this.db = operations;
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
      .then((res) => res && res.length > 0 && console.log(`[+]=> ${res}`))
      .then(() => console.log('dependencies'))
      .catch((err) => console.log(err));
  }



  start() {
    console.log(this.router);
  }
}