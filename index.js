'use strict'

const joi = require('joi')

module.exports = (schema, options = {}) => (handler) => (payload) => {
    if (!schema) {
        throw Error('joi schema required.')
    }

    if (!handler || typeof handler !== 'function') {
        throw Error('a function is required.')
    }

    const {error, value: message} = joi.validate(payload, schema)

    if (error) {
        error.requeue = !!options.requeue
        throw error
    }

    return handler(message)
}
