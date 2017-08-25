**Minion-joi**  —  _Joi validation for pager/minion workers_

## Usage Example

```javascript
const validation = require('minion-joi')

const validator = validation(Joi.object({
    foo: Joi.string().required()
}))

const handler = (message) => {
   return `Hello ${message.foo}`
}

module.exports = validator(handler)
```

By default minion will nack and not requeue messages on failure, if you want the message to be requeued after failing validation you can do it like this:

```javascript
const validation = require('minion-joi')

const validator = validation(Joi.object({
    foo: Joi.string().required()
}), { requeue: false })

const handler = (message) => {
   return `Hello ${message.foo}`
}

module.exports = validator(handler)
```