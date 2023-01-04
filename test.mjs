import {
  Msg,
  nspct2,
  strfy,
  logRank,
} from './lib/makeshift-msg.mjs'


const msgCtrl = new Msg({
  host: 'MSG Test',
  logLevel: logRank.all,
  showTime: true
})
const log = msgCtrl.getLevelLoggers()

const someString = 'test string'
const toast = {
  a: 'b',
  c: 'dee',
  e: [ 'some', 'stuff', 2],
  f: {
    more: {
      nested: {
        objects: 'aaaaa'
      }
    }
  }
}

log.debug(someString)
log.deviceEvent(someString)
log.info(someString)
log.warn(someString)
log.error(someString)
log.fatal(someString)

log.debug(toast)
log.deviceEvent(toast)
log.info(toast)
log.warn(toast)
log.error(toast)
log.fatal(toast)

msgCtrl.showTime = false

log.debug(someString)
log.deviceEvent(someString)
log.info(someString)
log.warn(someString)
log.error(someString)
log.fatal(someString)

log.debug(toast)
log.deviceEvent(toast)
log.info(toast)
log.warn(toast)
log.error(toast)
log.fatal(toast)