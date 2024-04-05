import path from 'path'
import log from 'electron-log/main'
import { app } from 'electron'

const LOGS_PATH: string =
  process.platform === 'darwin'
    ? path.resolve(app.getPath('logs'), `../${app.name}`)
    : path.resolve(app.getPath('userData'), 'logs')

function fixedStringLength(n: number | string, p?: number, r = '0'): string {
  let str = String(n)
  if (p && str.length !== p) {
    if (str.length >= p) {
      str = str.replace(new RegExp(`^(.{${p}})(.*)$`), '$1')
    } else {
      const lost = p - str.length
      if (lost > 0) {
        for (let i = 0; i < lost; i++) {
          str = r + str
        }
      }
    }
  } else {
    str = String(n)
  }

  return str
}

function formatDate(format = 'YYYY-MM-DD H:I:S.MS') {
  const date = new Date()

  const obj = {
    YYYY: fixedStringLength(date.getFullYear(), 4),
    MM: fixedStringLength(date.getMonth() + 1, 2),
    DD: fixedStringLength(date.getDate(), 2),
    H: fixedStringLength(date.getHours(), 2),
    I: fixedStringLength(date.getMinutes(), 2),
    S: fixedStringLength(date.getSeconds(), 2),
    MS: fixedStringLength(date.getMilliseconds(), 3)
  }

  return format.replace(/(YYYY|MM|DD|H|I|S|MS)/g, (_, $1) => {
    return obj[$1]
  })
}

export const ConfiguracionLogger = () => {
  const logFileName = `${formatDate('YYYY-MM-DD')}.log`

  log.transports.file.resolvePathFn = () => path.join(LOGS_PATH, logFileName)

  const env = process.env.NODE_ENV ?? ''
  log.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [${env}] [{processType}] [{level}] {text}`
  log.transports.console.format = '[{processType}] [{level}] {text}'

  Object.assign(console, log.functions)
}
