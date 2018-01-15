'use strict'

const joi = require('joi')

module.exports = (schema, options = {}) => {

    if (!schema) {
        throw Error('joi schema required.')
    }

    const createHandler = (handler) => (payload) => {

        const {error, value: message} = joi.validate(payload, schema, options)

        if (error) {
            throw error
        }

        return handler(message)
    }

    return (handler) => {

        if (!handler || typeof handler !== 'function') {
            throw Error('a function is required.')
        }

        const validatedHandler = createHandler(handler)
        validatedHandler.settings = handler.settings

        return validatedHandler
    }
}
