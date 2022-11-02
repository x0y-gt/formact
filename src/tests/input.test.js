import React from 'react'
import {
  render,
  screen,
  renderHook,
  act,
  fireEvent
} from '@testing-library/react'
import '@testing-library/jest-dom'

import useForm from '../use-form.js'

const FormExample = () => {
  const { register } = useForm()
  const { props, isTouched } = register('test')

  return (
    <form>
      <input type='text' {...props} />
      {isTouched && <span>input touched</span>}
    </form>
  )
}

describe('Create inputs with add helper', () => {
  it('should return the initial properties of an input', () => {
    const { result } = renderHook(() => useForm())

    act(() => {
      result.current.register('name')
    })

    expect('name' in result.current.fields).toBeTruthy()
    expect(Object.keys(result.current.fields.name).sort()).toEqual(
      ['props', 'name', 'errors', 'isTouched', 'validations'].sort()
    )
  })

  it('must change internal state of input when entered text', () => {
    render(<FormExample />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello world' } })
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('hello world')

    fireEvent.change(input, { target: { value: 'orale' } })
    expect(input.value).toBe('orale')
  })

  it('must change isTouched when focused for the first time', () => {
    render(<FormExample />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    const span = screen.getByText('input touched')
    expect(span).toBeInTheDocument()
  })
})
