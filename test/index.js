const test = require('ava')
const joi = require('joi')
const validation = require('../index')

test('joi schema required', async t => {
    const error = t.throws(() => {
		validation(null)(() => {})('message')
	}, Error);

	t.is(error.message, 'joi schema required.');
})

test('handler is function', async t => {
    const error = t.throws(() => {
		validation(joi.string())('handler')('message')
	}, Error);

	t.is(error.message, 'a function is required.');
})

test('handler with valid message', async t => {
    const handler = ({name}) => {
      return `Hello ${name}`
    }

    const validate = validation(joi.object({
        name: joi.string()
    }))

    const res = validate(handler)({ name: 'World'})

    t.is(res, 'Hello World')
})

test('async handler with valid message', async t => {
    const handler = async ({name}) => {
      return Promise.resolve(`Hello ${name}`)
    }

    const validate = validation(joi.object({
        name: joi.string()
    }))

    const res = await validate(handler)({ name: 'World'})

    t.is(res, 'Hello World')
})

test('handler with invalid message', async t => {
    const handler = ({name}) => {
      return `Hello ${name}`
    }

    const validate = validation(joi.object({
        name: joi.string()
    }))

    const error = t.throws(() => {
		validate(handler)(0)
	}, Error);

    t.true(error.isJoi)
})

test('handler with invalid message and joi options', async t => {
    const handler = async ({name}) => {
        return Promise.resolve(`Hello ${name}`)
      }

      const validate = validation(joi.object({
          name: joi.string()
      }), { stripUnknown: true })

      const res = await validate(handler)({ name: 'World', salute: 'hello' })

      t.is(res, 'Hello World')
})

test('handler keeps settings after wrapped', async t => {
    const handler = ({name}) => {
        return `Hello ${name}`
    }

    handler.settings = {
        key: 'handler.key'
    }

    const validate = validation(joi.object({
        name: joi.string()
    }))

    const newHandler = validate(handler)

    t.deepEqual(newHandler.settings, handler.settings)
})