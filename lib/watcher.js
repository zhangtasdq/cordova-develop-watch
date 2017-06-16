let fs = require("fs"),
    path = require("path"),
    cmd = require("node-cmd"),
    WatcherEvent = require("./watcher-event"),
    FileWatcher = require("./file-watcher"),
    Server = require("./server"),
    Tools = require("./tools");

class Watcher {
    constructor(config) {
        this.config = config;
        this._pendTask = [];
        this._isIdle = true;
        this.eventEmitter = new WatcherEvent();
        this.fileWatcher = new FileWatcher(config.dir, this.eventEmitter);
        this.server = new Server(config.port);
        this._bindEventListener();
    }

    _bindEventListener() {
        let listener = Tools.debounce(this.config.taskDelayTime, this._handleFileChangeEvent, this);
        this.eventEmitter.listenFileChange(listener);
    }

    _handleFileChangeEvent(data) {
        if (this.config.task) {
            this._pendTask.push({data: data, task: this.config.task, type: "file_change"});
            this._checkTask();
        } else {
            this.server.noticeClient({type: "file_change", data: data});
        }
    }

    _checkTask() {
        if (this._pendTask.length > 0 && this._isIdle) {
            this._isIdle = false;
            let task = this._pendTask.shift();
            this._runJob(task);
        }
    }

    _runJob(job) {
        cmd.get(job.task, (error) => {
            if (error) {
                console.log(error);
            } else {
                this._showFinishJobMsg(job);
                this.server.noticeClient({type: job.type, data: job.data});
            }
            this._isIdle = true;
            this._checkTask();
        });
    }

    _showFinishJobMsg(job) {
        console.log(`job finished: ${JSON.stringify(job)}`);
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
