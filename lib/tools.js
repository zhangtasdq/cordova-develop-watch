let os = require("os");

const STR_REPLACE_REG = /#{\s*(\w+)\s*}/g;

function getLocalIp() {
    let interfaces = os.networkInterfaces();

    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            let address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
}

function isUndefined(target) {
    return typeof target === "undefined";
}

function mixin(target, source) {
    for(var key in source) {
        if (source.hasOwnProperty(key) && !isUndefined(source[key])) {
            target[key] = source[key];
        }
    }
    return target;
}

function mixinMutiple(target) {
    for(let i = 1, j = arguments.length; i < j; ++i) {
        mixin(target, arguments[i]);
    }
    return target;
}

function compile(template, data) {
    return template.replace(STR_REPLACE_REG, function(match, key) {
        return data[key];
    });
}

function debounce(delay, fn, context) {
    var jobId = null;

    return function() {
        var self = context ? context : this,
            args = arguments;
        clearTimeout(jobId);

        jobId = setTimeout(() => fn.apply(self, args), delay);
    };
}

module.exports = {getLocalIp, mixinMutiple, mixin, compile, debounce};
