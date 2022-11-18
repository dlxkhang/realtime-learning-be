class duplicatedEmailError extends Error {
    statusCode

    data

    constructor(message: string) {
        super(`Email ${message} is already existing`)
        // super.name="DuplicatedError"
        this.name = 'duplicatedEmailError'
        this.statusCode = 409
        this.data = `Email ${message} is already existing`
        Error.captureStackTrace(this, duplicatedEmailError)
    }
}

class NotMatchRepeatPasswordError extends Error {
    statusCode

    data

    constructor(message: string) {
        super('RepeatPassword does not match!')
        // super.name="DuplicatedError"
        this.name = 'NotMatchRepeatPasswordError'
        this.statusCode = 409
        this.data = 'RepeatPassword does not match!'
        Error.captureStackTrace(this, NotMatchRepeatPasswordError)
    }
}
class SystemError extends Error {
    statusCode

    data: string

    constructor(message?: string) {
        super(message)
        // super.name="DuplicatedError"
        this.name = 'SystemError'
        this.statusCode = 500
        Error.captureStackTrace(this, SystemError)
    }
}

export { duplicatedEmailError, SystemError, NotMatchRepeatPasswordError }
