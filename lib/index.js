var fs = require("fs"),
    path = require("path"),
    Watcher = require("./watcher"),
    Tools = require("./tools");

var DevWatcher = {
    _isReady: false,
    _defaultConfigFile: "config.json",
    _watcher: null,

    _init: function(commandArg) {
        let defaultConfig = this._loadDefaultConfig(),
            config = Tools.mixinMutiple({}, defaultConfig, commandArg);

        this._watcher = new Watcher(config);
    },

    _loadDefaultConfig: function () {
        let str = fs.readFileSync(path.join(__dirname, this._defaultConfigFile), "utf-8");
        return JSON.parse(str);
    },

    start: function(commandArg) {
        if (!commandArg.dir) {
            throw new Error("dir is need");
        }

        if (!this._isReady) {
            this._init(commandArg);
            this._watcher.startWatch();
            this._isReady = true;
        }
    }
};

module.exports = DevWatcher;
