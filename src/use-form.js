import { useCallback, useReducer } from 'react'
// import field from './field'

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
  }

  return state
}

// field ctx
function field(name, dispatchFnc, defaultValue = '') {
  const ctx = {
    name,
    errors: null,
    isTouched: false,
    validators: []
  }

  ctx.props = {
    value: defaultValue,
    onChange: (e) => {
      dispatchFnc({
        action: 'update',
        payload: { name, value: e.target.value }
      })
      return e.target
    },
    onFocus: () => {
      if (!ctx.isTouched)
        dispatchFnc({
          action: 'touched',
          payload: { name }
        })
    }
  }

  return ctx
}

export default function useForm() {
  const [fields, dispatch] = useReducer(reducer, {})

  const register = useCallback(
    (name) => {
      if (name in fields === false) {
        const fieldCtx = field(name, dispatch)
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
