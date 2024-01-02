import peerServer from "./peerServer";

export default function configHooks(app){
    app.hook(peerServer);
}