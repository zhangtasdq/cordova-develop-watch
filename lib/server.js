var path = require("path"),
    express = require("express"),
    webSocket = require("express-ws");


class Server {
    constructor(port) {
        this.app = express();
        webSocket(this.app);
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.port = port;
        this._clientIpMap = {};
    }

    _initRouter() {
        this.app.ws("/websocket", (ws, req) => {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            this._clientIpMap[ip] = ws;
        });
    }

    noticeClient(data) {
        for(let key in this._clientIpMap) {
            this._clientIpMap[key].send(JSON.stringify(data));
        }
    }

    start() {
        this._initRouter();
        this.app.listen(this.port);
    }
}

module.exports = Server;
