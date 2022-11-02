import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import useForm from '../use-form.js'

const FormExample = ({ validations }) => {
  const { register } = useForm()
  const { props, isTouched, errors } = register('test', {
    validations
  })

  return (
    <form>
      <input type='text' {...props} />
      {isTouched && errors && <span>input has errors</span>}
    </form>
  )
}

const FormExample2 = ({ validations }) => {
  const { register } = useForm()
  const { props, isTouched, errors } = register('test', {
    validations
  })

  return (
    <form>
      <input type='text' {...props} />
      {isTouched && errors.required && <span>input has required errors</span>}
      {isTouched && errors.minLength && <span>input has minLength errors</span>}
    </form>
  )
}

describe('Input validations', () => {
  const setup1 = () => {
    const validations = {
      required: true
    }
    return render(<FormExample validations={validations} />)
  }

  const setup2 = () => {
    const validations = {
      required: true,
      minLength: 3
    }
    return render(<FormExample2 validations={validations} />)
  }

  it('must show error when validation fails', () => {
    setup1()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.blur(input)
    const span = screen.getByText('input has errors')

    expect(span).toBeInTheDocument()
  })

  it('must not show error when validation is ok', () => {
    setup1()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'holi' } })
    fireEvent.blur(input)
    const span = screen.queryByText('input has errors')

    expect(span).not.toBeInTheDocument()
  })

  it('must show the correct error when one validation fails', () => {
    setup2()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'ab' } })
    fireEvent.blur(input)
    const span1 = screen.queryByText('input has required errors')
    const span2 = screen.queryByText('input has minLength errors')

    expect(span1).not.toBeInTheDocument()
    expect(span2).toBeInTheDocument()
  })
})
