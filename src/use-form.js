import { useCallback, useReducer } from 'react'
import field from './field'

function reducer(state, ctx) {
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

function formData(fields) {
  return Object.keys(fields).reduce(
    (data, fieldName) => ({
      ...data,
      ...{ [fieldName]: fields[fieldName].props.value }
    }),
    {}
  )
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

  const handleSubmit = useCallback(
    (handler = () => null) => {
      // check errors
      const errors = Object.keys(fields)
        .map((fieldName) =>
          fields[fieldName]._validate(fields[fieldName].props.value)
        )
        .reduce(
          (prev, current) => (current.length ? prev + current.length : prev),
          0
        )

      if (errors) return false

      if (handler) handler(formData(fields))
      return true
    },
    [fields]
  )

  return { fields, register, handleSubmit }
}
