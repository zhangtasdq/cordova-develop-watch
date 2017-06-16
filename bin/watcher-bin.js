#!/usr/bin/env node

var program = require('commander'),
    watcher = require("../lib");

program
  .version('0.0.1')
  .option('-p, --port [port]', 'Server Port')
  .option('-d, --dir <dir>', 'watch dir')
  .option('-t, --task [task]', 'run task')
  .parse(process.argv);


watcher.start({port: program.port, dir: program.dir, task: program.task});
