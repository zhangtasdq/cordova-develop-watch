let fs = require("fs");

class FileWatcher {
    constructor(dir, emitter) {
        this.dir = dir;
        this.emitter = emitter;
    }

    _handleWatchFileChange(eventType, fileName) {
        this.emitter.emitFileChange({eventType, fileName});
    }

    start() {
        fs.watch(this.dir, (eventType, fileName) => {
            this._handleWatchFileChange(eventType, fileName);
        });
    }
}

module.exports = FileWatcher;
