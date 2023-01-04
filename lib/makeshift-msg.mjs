import { defu } from 'defu';
import { inspect } from 'node:util';
import chalk from 'chalk';

function filterName(input) {
    return input.replace(/[^A-Za-z0-9]/g, '').toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
}
const logRank = {
    'all': 0,
    'debug': 1,
    'deviceEvent': 2,
    'info': 3,
    'warn': 4,
    'error': 5,
    'fatal': 98,
    'none': 99,
};
const defaultMsgOptions = {
    host: '',
    logLevel: 'all',
    prompt: ' => ',
    showTime: false,
    symbol: {
        debug: 'dbg',
        info: '',
        deviceEvent: '',
        warn: '(!)',
        error: '[!]',
        fatal: '{x_X}',
    },
    terminal: true,
};
const colorize = {
    debug: chalk.gray,
    info: chalk.white,
    deviceEvent: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    fatal: chalk.redBright,
};
function setColorize(level, colorFn) {
    colorize[level] = colorFn;
}
function setWarn(warnFn) {
    colorize.warn = warnFn;
}
function strfy(o) { return JSON.stringify(o, null, 2); }
function coerceString(maybeString) {
    if (typeof maybeString === 'string') {
        return maybeString;
    }
    return nspct2(maybeString);
}
function nspect(o, d) {
    return inspect(o, {
        colors: true,
        depth: d,
    });
}
function nspct2(o) {
    return inspect(o, {
        colors: true,
        depth: 2
    });
}
class Msg {
    _debug = () => { };
    _info = () => { };
    _deviceEvent = () => { };
    _warn = () => { };
    _error = () => { };
    _fatal = () => { };
    _defaultLogger(msg, lv) {
        console.log(msg);
    }
    prompt = ' => ';
    host = '';
    logLevel = 'all';
    terminal = true;
    showTime = false;
    showMillis = false;
    get time() {
        const d = new Date();
        let hh = '', mm = '', ss = '';
        if (d.getHours() < 10) {
            hh = '0';
        }
        if (d.getMinutes() < 10) {
            mm = '0';
        }
        if (d.getSeconds() < 10) {
            ss = '0';
        }
        hh += d.getHours();
        mm += d.getMinutes();
        ss += d.getSeconds();
        let tt = hh + ':' + mm + ':' + ss;
        if (this.showMillis) {
            tt += ':' + d.getMilliseconds();
        }
        return chalk.grey(tt);
    }
    ps(calledLevel) {
        let _ps = '';
        if (this.showTime === true) {
            _ps += this.time + ' ';
        }
        if (this.symbol[calledLevel] !== '') {
            _ps += colorize[calledLevel](this.symbol[calledLevel]) + ' ';
        }
        _ps += colorize[calledLevel](this.host)
            + this.prompt;
        return _ps;
    }
    symbol;
    assignOptions(setting, givenOptions) {
        for (const prop in givenOptions) {
            if (typeof setting[prop] !== 'object') {
                // console.log('set:: ' + setting[prop])
                // console.log('giv:: ' + givenOptions[prop])
                setting[prop] = givenOptions[prop] || setting[prop];
            }
            else {
                this.assignOptions(setting[prop], givenOptions[prop]);
            }
        }
    }
    getLevelLoggers() {
        return {
            debug: this._debug,
            info: this._info,
            deviceEvent: this._deviceEvent,
            warn: this._warn,
            error: this._error,
            fatal: this._fatal,
        };
    }
    logger = this._defaultLogger;
    resetLogger() { this.logger = this._defaultLogger; }
    constructor(options = defaultMsgOptions) {
        const finalOpts = defu(options, defaultMsgOptions);
        this.assignOptions(this, finalOpts);
        // if (options.symbol) {
        //   for (let prop in this._symbol) {
        //     this._symbol[prop] = options.symbol[prop]
        //   }
        // }
        // if (options.logger) {
        //   this.logger = options.logger
        // }
        // options.prompt ? this.prompt = options.prompt : null
        // this.host = options.host
        // this.terminal = options.terminal
        this.spawnLevelLoggers();
    }
    spawnLevelLoggers() {
        for (let prop in this.symbol) {
            let calledLevel = prop;
            this['_' + prop] = (l) => {
                let logString = `${this.ps(calledLevel)}${coerceString(l)}`;
                if (logRank[this.logLevel] <= logRank[calledLevel]) {
                    this.logger(logString, calledLevel);
                }
                return logString;
            };
        }
    }
}

export { Msg, defaultMsgOptions, filterName, logRank, nspct2, nspect, setColorize, setWarn, strfy };
