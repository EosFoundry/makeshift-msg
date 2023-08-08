import { stat } from "fs";
import { defu } from 'defu'
import { inspect } from 'node:util'
import chalk, { ChalkInstance } from 'chalk'
import { InspectOptions } from "util";

export function filterName(input) {
  return input.replace(/[^A-Za-z0-9]/g, '').toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

export type MsgLevel =
  'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'verbose'
  | 'debug'

export type LogLevel = 'none' | 'all' | MsgLevel

export const logLevels: LogLevel[] = [
  'all',
  'debug',
  'verbose',
  'info',
  'warn',
  'error',
  'fatal',
  'none',
]



export const logRank = logLevels.reduce((acc, cur, idx) => {
  acc[cur] = idx
  return acc
}, {} as { [key: string]: number })

export interface Msger {
  logLevel: LogLevel
}

export type LoggerFn = (msg: string, lv: LogLevel) => void;

export type MsgLvFunctorMap = {
  [Property in MsgLevel]: Function
}

export type MsgLvStringMap = {
  [Property in MsgLevel]: string
}

export type MsgOptions = {
  host?: string,
  logLevel?: LogLevel,
  logger?: Function,
  prompt?: string,
  showTime?: boolean,
  symbol?: MsgLvStringMap,
  terminal?: boolean,
}
export const defaultMsgOptions: MsgOptions = {
  host: '',
  logLevel: 'all',
  prompt: ' => ',
  showTime: false,
  symbol: {
    debug: 'dbg',
    verbose: '',
    info: '',
    warn: '(!)',
    error: '[!]',
    fatal: '{x_X}',
  } as MsgLvStringMap,
  terminal: true,
}

const colorize: MsgLvFunctorMap = {
  debug: chalk.gray,
  verbose: chalk.gray,
  info: chalk.white,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.redBright,
}

export function setColorize(level: LogLevel, colorFn: ChalkInstance) {
  colorize[level] = colorFn;
}
export function setWarn(warnFn: ChalkInstance) {
  colorize.warn = warnFn;
}

export function strfy(o) { return JSON.stringify(o, null, 2) }
function coerceString(maybeString) {
  if (typeof maybeString === 'string') {
    return maybeString
  }
  return nspct2(maybeString)
}

export function nspect(o: any, d: number): string {
  return inspect(o, {
    colors: true,
    depth: d,
  } as InspectOptions)

}
export function nspct2(o: any): string {
  return inspect(o, {
    colors: true,
    depth: 2
  } as InspectOptions)
}
export class Msg {
  private _debug = () => { }
  private _verbose = () => { }
  private _info = () => { }
  private _warn = () => { }
  private _error = () => { }
  private _fatal = () => { };

  private _defaultLogger(msg: string, lv: LogLevel) {
    console.log(msg);
  }

  prompt: string = ' => '
  host: string = ''
  logLevel: LogLevel = 'all'
  terminal: boolean = true
  showTime: boolean = false
  showMillis: boolean = false
  get time() {
    const date = new Date()
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    let tt = hh + ':' + mm + ':' + ss
    if (this.showMillis) { tt += ':' + date.getMilliseconds() }
    return chalk.grey(tt)
  }


  ps(calledLevel) {
    let _ps = ''
    if (this.showTime === true) {
      _ps += this.time + ' '
    }
    if (this.symbol[calledLevel] !== '') {
      _ps += colorize[calledLevel](this.symbol[calledLevel]) + ' '

    }
    _ps += colorize[calledLevel](this.host)
      + this.prompt
    return _ps
  }

  //
  symbol: MsgLvStringMap

  private assignOptions(setting, givenOptions) {
    for (const prop in givenOptions) {
      if (typeof setting[prop] !== 'object') {
        // console.log('set:: ' + setting[prop])
        // console.log('giv:: ' + givenOptions[prop])
        setting[prop] = givenOptions[prop] || setting[prop]
      } else {
        this.assignOptions(setting[prop], givenOptions[prop])
      }
    }
  }


  getLevelLoggers(): MsgLvFunctorMap {
    return {
      debug: this._debug,
      verbose: this._verbose,
      info: this._info,
      warn: this._warn,
      error: this._error,
      fatal: this._fatal,
    }
  }

  logger: LoggerFn = this._defaultLogger
  resetLogger() { this.logger = this._defaultLogger }

  constructor(options: MsgOptions = defaultMsgOptions) {
    const finalOpts = defu(options, defaultMsgOptions)
    this.assignOptions(this, finalOpts)
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
    this.spawnLevelLoggers()
  }

  private spawnLevelLoggers() {
    for (let prop in this.symbol) {
      let calledLevel = prop as MsgLevel

      this['_' + prop] = (l) => {
        let logString = `${this.ps(calledLevel)}${coerceString(l)}`
        if (logRank[this.logLevel] <= logRank[calledLevel]) {
          this.logger(logString, calledLevel)
        }
        return logString
      }
    }
  }
};

