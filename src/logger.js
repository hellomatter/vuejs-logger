export default function () {

    const logLevels = ['debug', 'info', 'warn', 'error', 'fatal']

    function initLoggerInstance (options, logLevels) {
        const logger = {}
        logLevels.forEach(logLevel => {
            if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel)) {
                logger[logLevel] = (...args) => {
                    let prefix = ''
                    prefix += options.prefix ? options.prefix + ' | ' : ''
                    prefix += options.showLogLevel ? logLevel + ' |' : ''
                    const formattedArguments = options.stringifyArguments ? args.map(a => JSON.stringify(a)) : args
                    print(logLevel, prefix, formattedArguments)
                }
            } else {
                logger[logLevel] = () => {}
            }
        })
        return logger
    }

    function print (logLevel, prefix, formattedArguments) {
      switch(logLevel) {
        case 'warn':
          console.warn('🚧', prefix, ...formattedArguments)
          break;
        case 'error':
          console.error('⛔', prefix, ...formattedArguments)
          break;
        case 'fatal':
          console.error('⛔', prefix, ...formattedArguments)
          break;
        case 'debug':
          console.debug('%c🔧 ' + prefix, 'color: #9E9E9E;', ...formattedArguments)
          break;
        case 'info':
          console.info('%c🔵 ' + prefix, 'color: #03A9F4;', ...formattedArguments)
          break;
        default:
          console.log(prefix, ...formattedArguments)
      }
    }

    function validateOptions (options, logLevels) {
        if (!(options.logLevel && typeof options.logLevel === 'string' && logLevels.indexOf(options.logLevel) > -1)) {
            return false
        }
        if (options.stringifyArguments && typeof options.stringifyArguments !== 'boolean') {
            return false
        }
        if (options.showLogLevel && typeof options.showLogLevel !== 'boolean') {
            return false
        }
        if (options.prefix && typeof options.prefix !== 'string') {
            return false
        }
        return true
    }

    function install (Vue, options) {
        if (validateOptions(options, logLevels)) {
            Vue.$log = initLoggerInstance(options, logLevels)
            Vue.prototype.$log = Vue.$log
        } else {
            throw new Error('Provided options for vuejs-logger are not valid.')
        }
    }

    return {
        install,
        validateOptions,
        print,
        initLoggerInstance,
        logLevels
    }
}
