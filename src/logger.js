export default (function () {

    const defaultOptions = {
        logLevel: 'debug',
        separator: '|',
        stringifyArguments: false,
        showLogLevel: false,
        showMethodName: false,
        showConsoleColors: false,
    }

    const logLevels = ['debug', 'info', 'warn', 'error', 'fatal']

    function initLoggerInstance (options, logLevels) {
        const logger = {}
        logLevels.forEach(logLevel => {
              if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel)) {
                  logger[logLevel] = (...args) => {
                      let methodName = getMethodName()
                      const methodNamePrefix = options.showMethodName ? methodName + ` ${options.separator}` : ''
                      const logLevelPrefix = options.showLogLevel ? logLevel + ` ${options.separator}` : ''
                      const formattedArguments = options.stringifyArguments ? args.map(a => JSON.stringify(a)) : args
                      print(logLevel, logLevelPrefix, methodNamePrefix, formattedArguments, options.showConsoleColors)
                  }
              }
              else {
                  logger[logLevel] = () => {}
              }
          }
        )
        return logger
    }

    function print (logLevel = false, logLevelPrefix = false, methodNamePrefix = false, formattedArguments = false, showConsoleColors = false) {
        switch(logLevel) {
            case 'debug':
                console.debug('%c🔧 ' + logLevelPrefix, 'color: #9E9E9E;', methodNamePrefix, ...formattedArguments)
                break;
            case 'info':
                console.info('%c🔷 ' + logLevelPrefix, 'color: #03A9F4;', methodNamePrefix, ...formattedArguments)
                break;
            case 'warn':
                console.warn('⚠️', logLevelPrefix, methodNamePrefix, ...formattedArguments)
                break;
            case 'error':
                console.error('⛔', logLevelPrefix, methodNamePrefix, ...formattedArguments)
                break;
            case 'fatal':
                console.error('💣', logLevelPrefix, methodNamePrefix, ...formattedArguments)
                break;
            default:
                console.log(logLevelPrefix, methodNamePrefix, ...formattedArguments)
        }

    }

    function isValidOptions (options, logLevels) {
        if (!(options.logLevel && typeof options.logLevel === 'string' && logLevels.indexOf(options.logLevel) > -1)) {
            return false
        }
        if (options.stringifyArguments && typeof options.stringifyArguments !== 'boolean') {
            return false
        }
        if (options.showLogLevel && typeof options.showLogLevel !== 'boolean') {
            return false
        }
        if (options.showConsoleColors && typeof options.showConsoleColors !== 'boolean') {
            return false
        }
        if (options.separator && (typeof options.separator !== 'string' || (typeof options.separator === 'string' && options.separator.length > 3))) {
            return false
        }
        return !(options.showMethodName && typeof options.showMethodName !== 'boolean')
    }

    function install (Vue, options) {
        options = Object.assign(defaultOptions, options)

        if (isValidOptions(options, logLevels)) {
            Vue.$log = initLoggerInstance(options, logLevels)
            Vue.prototype.$log = Vue.$log
        } else {
            throw new Error('Provided options for vuejs-logger are not valid.')
        }
    }

    function getMethodName () {
        let error = {}
        try { throw new Error('') } catch (e) { error = e }
        let stackTrace = error.stack.split('\n')[3]
        if (/ /.test(stackTrace)) {
            stackTrace = stackTrace.trim().split(' ')[1]
        }
        if (stackTrace && stackTrace.includes('.')) {
            stackTrace = stackTrace.split('.')[1]
        }
        return stackTrace
    }

    return {
        install,
        isValidOptions,
        print,
        initLoggerInstance,
        logLevels
    }
})()