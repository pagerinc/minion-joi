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
    t.false(error.requeue)
})

test('handler with invalid message and requeing', async t => {
    const handler = ({name}) => {
      return `Hello ${name}`
    }

    const validate = validation(joi.object({
        name: joi.string()
    }), { requeue: true })

    const error = t.throws(() => {
		validate(handler)(0)
	}, Error);

    t.true(error.isJoi)
    t.true(error.requeue)
})