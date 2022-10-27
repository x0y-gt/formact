import { useCallback, useReducer } from 'react'
// import field from './field'

const reducer = (state, ctx) => {
  if (ctx.action === 'register') {
    return { ...state, [ctx.payload.name]: ctx.payload }
  }
  if (ctx.action === 'update') {
    const fieldCtx = state[ctx.payload.name]
    fieldCtx.value = ctx.payload.value
    return { ...state }
  }
  return state
}

// field ctx
function field(name, defaultValue = '') {
  return {
    name,
    value: defaultValue,
    errors: null,
    validators: []
  }
}

export default function useForm() {
  const [fields, dispatch] = useReducer(reducer, {})

  const register = useCallback(
    (name) => {
      if (name in fields === false) {
        const fieldCtx = field(name)
        dispatch({ action: 'register', payload: fieldCtx })
        return {
          value: fieldCtx.value,
          onChange: (e) => {
            dispatch({
              action: 'update',
              payload: { name, value: e.target.value }
            })
            return e.target
          }
        }
      }
    },
    [fields]
  )

  return { fields, register }
}
