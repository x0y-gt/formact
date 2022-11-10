import { useCallback, useReducer } from 'react'
// import field from './field'

/*
 * Each validator return false when validation fails
 */
const definedValidations = {
  required: (val) => String(val).trim().length,
  minLength: (val, min) => String(val).trim().length >= min,
  maxLength: (val, max) => String(val).trim().length <= max,
  min: (val, min) => isNaN(val) || Number(val) >= min,
  max: (val, max) => isNaN(val) || Number(val) <= max,
  regex: (val, regex) => {
    if (regex instanceof RegExp === false)
      throw new Error('Invalid regular expression in validator')

    return regex.test(val)
  }
}

function validate(value, validations) {
  const keys = Object.keys(validations)
  const errors = keys.filter((key) => {
    if (key in definedValidations)
      return !definedValidations[key](value, validations[key])
    else if (typeof validations[key] === 'function')
      return !validations[key](value)

    return true
  })

  return errors
}

// field ctx
function field(name, dispatchAction, opts = {}) {
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

const reducer = (state, ctx) => {
  if (ctx.action === 'register') {
    return { ...state, [ctx.payload.name]: ctx.payload }
  }

  const fieldCtx = state[ctx.payload.name]
  if (ctx.action === 'update') {
    fieldCtx.props.value = ctx.payload.value
    return { ...state }
  } else if (ctx.action === 'touched') {
    fieldCtx.isTouched = true
    return { ...state }
  } else if (ctx.action === 'error') {
    fieldCtx.errors = ctx.payload.errors.reduce(
      (accum, error) => ({ ...accum, [error]: true }),
      {}
    )
    return { ...state }
  }

  return state
}

export default function useForm() {
  const [fields, dispatch] = useReducer(reducer, {})

  const register = useCallback(
    (name, opts = {}) => {
      if (name in fields === false) {
        const fieldCtx = field(name, dispatch, opts)
        dispatch({ action: 'register', payload: fieldCtx })
        return fieldCtx
      } else {
        return fields[name]
      }
    },
    [fields]
  )

  return { fields, register }
}
