import validate from './validate'

/*
 * Defines a field context
 */
export default function field(name, dispatchAction, opts = {}) {
  const {
    defaultValue = '',
    validations = {},
    preOnChange = () => null,
    onChange = () => null
  } = opts
  const ctx = {
    name,
    errors: false,
    isTouched: false,
    preOnChange,
    onChange,
    validations
  }

  ctx._validate = (value) => {
    const errors = validate(value, validations)
    if (ctx.errors || errors.length)
      dispatchAction({
        action: 'error',
        payload: { name, errors }
      })

    return errors
  }

  ctx.props = {
    value: defaultValue,
    onChange: (e) => {
      let internalEvent = e
      if (typeof ctx.preOnChange === 'function') {
        const preOnChangeResponse = ctx.preOnChange(internalEvent)
        if (preOnChangeResponse) internalEvent = preOnChangeResponse
      }

      dispatchAction({
        action: 'update',
        payload: { name, value: internalEvent.target.value }
      })

      if (typeof ctx.onChange === 'function') ctx.onChange(internalEvent)

      return internalEvent.target
    },
    onFocus: () => {
      if (!ctx.isTouched)
        dispatchAction({
          action: 'touched',
          payload: { name }
        })
    },
    onBlur: (e) => {
      if (validations) ctx._validate(e.target.value)
    }
  }

  // opts
  ctx.setValue = function setNewValue(value) {
    ctx.props.onChange({
      target: { value }
    })
  }

  return ctx
}
