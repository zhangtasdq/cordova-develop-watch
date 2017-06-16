let fs = require("fs"),
    path = require("path"),
    WatcherEvent = require("./watcher-event"),
    FileWatcher = require("./file-watcher"),
    Server = require("./server"),
    Tools = require("./tools");

class Watcher {
    constructor(config) {
        this.config = config;
        this.eventEmitter = new WatcherEvent();
        this.fileWatcher = new FileWatcher(config.dir, this.eventEmitter);
        this.server = new Server(config.port);
        this._bindEventListener();
    }

    _bindEventListener() {
        this.eventEmitter.listenFileChange((data) => this._handleFileChangeEvent(data));
    }

    _handleFileChangeEvent(data) {
        this.server.noticeClient({type: "file_change", data: data});
    }

    _getWebsocketUrl() {
        let ip = Tools.getLocalIp();

        return `${ip}:${this.config.port}/websocket`;
    }

    _prepareClientJs() {
        let url = this._getWebsocketUrl(),
            clientTempStr = fs.readFileSync(path.join(__dirname, "client-template.js"), {encoding: "utf-8"}),
            clientStr = Tools.compile(clientTempStr, {url: url});

        fs.writeFileSync(path.join(__dirname, "../public/client.js"), clientStr);
    }

    startWatch() {
        this._prepareClientJs();
        this.fileWatcher.start();
        this.server.start();
    }
}

module.exports = Watcher;
