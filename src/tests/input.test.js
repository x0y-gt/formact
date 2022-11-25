import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import useForm from '../index.js'

const InputExample = () => {
  const { register } = useForm()
  const { props, isTouched } = register('test')

  return (
    <form>
      <input type='text' {...props} />
      {isTouched && <span>input touched</span>}
    </form>
  )
}

const InputExample2 = () => {
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

const InputExample3 = ({ onChangeFnc, preOnChangeFnc }) => {
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

describe('Create inputs with register helper', () => {
  it('must set the specified default value', () => {
    render(<InputExample2 />)

    const input = screen.getByRole('textbox')

    expect(input.value).toBe('testing')
  })

  it('must change internal state of input when entered text', () => {
    render(<InputExample />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello world' } })
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('hello world')

    fireEvent.change(input, { target: { value: 'orale' } })
    expect(input.value).toBe('orale')
  })

  it('must change isTouched when focused for the first time', () => {
    render(<InputExample />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    const span = screen.getByText('input touched')
    expect(span).toBeInTheDocument()
  })

  it('must call custom onchange when defined', async () => {
    const onChangeMock = jest.fn()
    onChangeMock.mockImplementation((e) => e.target.value)
    render(<InputExample3 onChangeFnc={onChangeMock} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'holi')

    expect(onChangeMock).toHaveBeenCalledTimes(4) // one per character
    expect(onChangeMock.mock.results[3].value).toBe('holi')
    onChangeMock.mockRestore()
  })

  it('should call custom preonchange when defined and alter input value', async () => {
    const onChangeMock = jest.fn()
    onChangeMock.mockImplementation((e) => {
      e.target.value = e.target.value.toLowerCase()
      return e
    })
    render(<InputExample3 preOnChangeFnc={onChangeMock} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'HoLi')

    expect(onChangeMock).toHaveBeenCalledTimes(4) // one per character
    expect(onChangeMock.mock.results[3].value.target.value).toBe('holi')
    expect(input.value).toBe('holi')
    onChangeMock.mockRestore()
  })
})
