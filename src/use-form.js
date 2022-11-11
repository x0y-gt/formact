import { useCallback, useReducer } from 'react'
import field from './field'

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
