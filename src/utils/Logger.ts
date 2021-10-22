import { createLogger, format, transports } from 'winston';
import Config from '../config/AppConfig';

const { colorize, combine, metadata, timestamp, printf } = format;

/**
 * this customFormat will format the text and color only ERROR message to red
 */
const customFormat = printf(info => {
    const message = `${info.timestamp}\t[${info.metadata.filename}]\t${info.level}\t${info.message}`;

    if (info.level === 'ERROR' || info.level === 'WARN') {
        return colorize({ level: true }).colorize(info.level.toLowerCase(), message);
    }

    return message;
});

const changeLevelToUpperCase = format(info => {
    info.level = info.level.toUpperCase();

    return info;
});

const appLogger = createLogger({
    level: Config.LOG_LEVEL,
    exitOnError: false,
    format: combine(
        changeLevelToUpperCase(),
        metadata(),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        customFormat
    ),
    transports: [
        new transports.Console()
    ]
});

class Logger {
    private readonly filename:string;

    constructor(filename: string) {
        this.filename = filename;
    }

    error(message: string):void {
        appLogger.error(message, { filename: this.filename });
    }

    warn(message: string):void {
        appLogger.warn(message, { filename: this.filename });
    }

    info(message: string):void {
        appLogger.info(message, { filename: this.filename });
    }

    debug(message: string):void {
        appLogger.debug(message, { filename: this.filename });
    }
}

export default Logger;
