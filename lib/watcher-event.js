let EventEmitter = require("events");

const FILE_CHANGE_EVENT = "event.file_change";

class WatcherEvent extends EventEmitter {
    emitFileChange(data) {
        this.emit(FILE_CHANGE_EVENT, data);
    }

    listenFileChange(callback) {
        this.on(FILE_CHANGE_EVENT, callback);
    }
}

module.exports = WatcherEvent;
