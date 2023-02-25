import { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';

const levelStyleMap: { [key: string]: string } = {
  error: '\x1b[41m%s\x1b[0m',
  warn: '\x1b[33m%s\x1b[0m',
  info: '\x1b[94m%s\x1b[0m',
  verbose: '\x1b[35m%s\x1b[0m',
  debug: '\x1b[32m%s\x1b[0m'
};

class ConsoleLogTransport extends Transport {

  log(info: any, callback: { (): void }) {
    const severity = info.consoleLoggerOptions?.label! || (info.level as string).toUpperCase()
    const finalMessage = `[${new Date().toISOString()}] [${severity}] ${info.message}`
    console.log(levelStyleMap[info.level], finalMessage)
    callback()
  }
}

export const logger = createLogger({
  format: format.combine(format.timestamp()),
  transports: [new ConsoleLogTransport()],
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

