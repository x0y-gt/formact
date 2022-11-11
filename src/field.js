import validate from './validate'

/*
 * Defines a field context
 */
export default function field(name, dispatchAction, opts = {}) {
  const { defaultValue = '', validations = {} } = opts
  const ctx = {
    name,
    errors: false,
    isTouched: false,
    validations
  }

  ctx.props = {
    value: defaultValue,
    onChange: (e) => {
      dispatchAction({
        action: 'update',
        payload: { name, value: e.target.value }
      })

      return e.target
    },
    onFocus: () => {
      if (!ctx.isTouched)
        dispatchAction({
          action: 'touched',
          payload: { name }
        })
    },
    onBlur: (e) => {
      if (validations) {
        const errors = validate(e.target.value, validations)
        if (ctx.errors || errors.length)
          dispatchAction({
            action: 'error',
            payload: { name, errors }
          })
      }
    }
  }

  return ctx
}
