var flatiron = require('flatiron'),
    path = require('path'),
    fs = require('fs'),
    nodecss = require('../nodecss');


var help = [
    'usage: nodecss [action] [options] SOURCE [script-options]',
    '',
    'Run css code at server side',
    '',
    'actions:',
    '  start               Start SCRIPT as a daemon',
    '  stop                Stop the daemon SCRIPT by Id|Uid|Pid|Index|Script',
    '',
    'options:',
    '  -l  LOGFILE      Logs the nodecss output to LOGFILE',
    '  -o  OUTFILE      Logs stdout from child script to OUTFILE',
    '  -e  ERRFILE      Logs stderr from child script to ERRFILE',
    '  -h, --help       You\'re staring at it',
    '',
    ''
];

var app = flatiron.app;

var cli = exports;


var actions = [
    'start',
    'stop'
];

var argvOptions = cli.argvOptions = {
    'logFile':   {alias: 'l'},
    'outFile':   {alias: 'o'},
    'help':      {alias: 'h'}
};

app.use(flatiron.plugins.cli, {
    argv: argvOptions,
    usage: help
});

app.cmd(/start (.+)/, cli.startDaemon = function () {
    var file = app.argv._[1],
        options = getOptions(file);

    nodecss.log.info('Node.css processing file: ' + file);

    var fullPath  = process.cwd() + '/' + file;
    var ast = nodecss.parse(fullPath);
    ast.stylesheet.rules.forEach(function(rule){
        var ruleLine = '';
        rule.selectors[0].split('.').forEach(function(subRule) {
           if (subRule.charAt(0) === '#') {
               subRule = subRule.substr(1);
           } else {
               subRule = '.' + subRule + '()';
           }

            ruleLine += subRule
        })
        console.log(ruleLine);
    })
});

var getOptions = cli.getOptions = function (file) {
    var options = {};

    options.args = process.argv.splice(process.argv.indexOf(file) + 1);


    app.config.stores.argv.store = {};
    app.config.use('argv', argvOptions);

    [
        'logFile','outFile'
    ].forEach(function (key) {
            options[key] = app.config.get(key);
        });

    return options;
};



cli.start = function () {
    if (app.argv.version) {
        return console.log('v' + nodecss.version);
    }
    if ((typeof app.argv.colors !== 'undefined' && !app.argv.colors) || app.argv.plain) {
        colors.mode = 'none';
    }

    if (app.config.get('help')) {
        return util.puts(help.join('\n'));
    }

    app.init(function () {
        if (app.argv._.length && actions.indexOf(app.argv._[0]) === -1) {
            return cli.run();
        }

        app.start();
    });
};