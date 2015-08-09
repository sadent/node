var winston = require('winston'),
    nodecss = exports,
    css = require('css'),
    fs = require('fs');

//
// Setup `nodecss.log` to be a custom `winston` logger.
//
nodecss.log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});

nodecss.log.cli();

//
// Setup `nodecss out` for logEvents with `winston` custom logger.
//
nodecss.out = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});

exports.version = require('../package').version;

nodecss.cli = require('./nodecss/cli');


nodecss.parse = function (path) {
    nodecss.log.info('Node.css start parsing: ' + path);

    var content = fs.readFileSync(path, "utf8");
    return css.parse(content);
};

