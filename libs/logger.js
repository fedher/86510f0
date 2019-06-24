const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            colorize: true,
        })
    ]
});

module.exports = logger;
