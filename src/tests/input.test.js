import React, { useState } from 'react'
import {
  render,
  screen,
  renderHook,
  act,
  fireEvent
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import useForm from '../index.js'

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

const FormExample2 = () => {
  const { register } = useForm()
  const { props, isTouched } = register('test', {
    defaultValue: 'testing'
  })

  return (
    <form>
      <input type='text' {...props} />
      {isTouched && <span>input touched</span>}
    </form>
  )
}

const FormExample3 = ({ onChangeFnc, preOnChangeFnc }) => {
  const { register } = useForm()
  const { props } = register('test', {
    onChange: onChangeFnc || null,
    preOnChange: preOnChangeFnc || null
  })

  return (
    <form>
      <input type='text' {...props} />
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
      [
        'props',
        'name',
        'errors',
        'isTouched',
        'validations',
        'preOnChange',
        'onChange'
      ].sort()
    )
  })

  it('must set the specified default value', () => {
    render(<FormExample2 />)

    const input = screen.getByRole('textbox')

    expect(input.value).toBe('testing')
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

  it('must call custom onchange when defined', async () => {
    const onChangeMock = jest.fn()
    onChangeMock.mockImplementation((e) => e.target.value)
    render(<FormExample3 onChangeFnc={onChangeMock} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'holi')

    expect(onChangeMock).toHaveBeenCalledTimes(4) // one per character
    expect(onChangeMock.mock.results[3].value).toBe('holi')
  })

  it('should call custom preonchange when defined and alter input value', async () => {
    const onChangeMock = jest.fn()
    onChangeMock.mockImplementation((e) => {
      e.target.value = e.target.value.toLowerCase()
      return e
    })
    render(<FormExample3 preOnChangeFnc={onChangeMock} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'HoLi')

    expect(onChangeMock).toHaveBeenCalledTimes(4) // one per character
    expect(onChangeMock.mock.results[3].value.target.value).toBe('holi')
    expect(input.value).toBe('holi')
  })
})
