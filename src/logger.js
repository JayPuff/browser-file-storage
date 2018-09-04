const logger = {
    DEFAULT_LEVEL: 1,
    LEVEL_NONE: 0,
    LEVEL_ERROR: 1,
    LEVEL_WARN: 2,
    LEVEL_INFO: 3,
    PREFIX: 'Browser File Storage - ',
}

const log = (level, message, attachedObject) => {
    if(logger._logLevel >= level) {
        console.log(logger.PREFIX + message, attachedObject)
    }
}

const logLevel = (level) => {
    if(typeof level === 'number') {
        logger._logLevel = level
    } else if (typeof level == 'string') {
        if(level == 'none') {
            logger._logLevel = logger.LEVEL_NONE
        } else if(level == 'error') {
            logger._logLevel = logger.LEVEL_ERROR
        } else if(level == 'warn') {
            logger._logLevel = logger.LEVEL_WARN
        } else if(level == 'info') {
            logger._logLevel = logger.LEVEL_INFO
        }
    } else {
        logger._logLevel = logger.DEFAULT_LEVEL
    }
}

logger._logLevel = logger.DEFAULT_LEVEL
logger.log = log
logger.logLevel = logLevel


export default logger


