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
  const input = register('test')

  return (
    <form>
      <input type='text' {...input} />
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
      ['value', 'name', 'errors', 'validators'].sort()
    )
  })

  it('must change internal state of input', () => {
    render(<FormExample />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello world' } })
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('hello world')

    fireEvent.change(input, { target: { value: 'orale' } })
    expect(input.value).toBe('orale')
  })
})
