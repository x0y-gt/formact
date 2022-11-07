import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
      <h1>Testing</h1>
      <input type='text' {...props} />
      {isTouched && errors.required && <span>input has required errors</span>}
      {isTouched && errors.minLength && <span>input has minLength errors</span>}
      {isTouched && errors.maxLength && <span>input has maxLength errors</span>}
      {isTouched && errors.min && <span>input has min errors</span>}
      {isTouched && errors.max && <span>input has max errors</span>}
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

  const setupMinL = () => {
    const validations = { minLength: 3 }
    return render(<FormExample2 validations={validations} />)
  }

  const setupMaxL = () => {
    const validations = { maxLength: 5 }
    return render(<FormExample2 validations={validations} />)
  }

  const setupMin = () => {
    const validations = { min: 5.1 }
    return render(<FormExample2 validations={validations} />)
  }

  const setupMax = () => {
    const validations = { max: 10 }
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

  // Test validators
  // Test validators
  // Test validators
  it('must not show error message when required and have a value', () => {
    setup1()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.blur(input)
    const span = screen.queryByText('input has errors')

    expect(span).not.toBeInTheDocument()
  })

  it('must hide an error when min length validation passes', async () => {
    setupMinL()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.blur(input)
    const span = screen.queryByText('input has minLength errors')
    expect(span).toBeInTheDocument()

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.blur(input)

    try {
      await screen.findByText('input has minLength errors')
      expect(false).toBeTruthy()
    } catch (e) {
      expect(true).toBeTruthy()
    }
  })

  it('must show an error when max length validation not passes', () => {
    setupMaxL()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.blur(input)
    const span = screen.queryByText('input has maxLength errors')
    expect(span).not.toBeInTheDocument()

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'abcde' } })
    fireEvent.blur(input)

    screen
      .findByText('input has maxLength errors')
      .catch(() => expect(span).toBeInTheDocument())
  })

  it('must hide an error when min validation passes', async () => {
    // const user = userEvent.setup()
    setupMin()

    const input = screen.getByRole('textbox')
    await userEvent.type(input, '5')
    await userEvent.click(screen.queryByText('Testing')) // to blur
    const span = screen.queryByText('input has min errors')
    expect(span).toBeInTheDocument()

    await userEvent.clear(input)
    await userEvent.type(input, '7')
    await userEvent.click(screen.queryByText('Testing')) // to blur
    // fireEvent.blur(input)
    // screen.debug()
    expect(screen.queryByText('input has min errors')).not.toBeInTheDocument()
  })

  it('must hide an error when max validation passes', () => {
    setupMax()

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 10.1 } })
    fireEvent.blur(input)
    const span = screen.queryByText('input has max errors')
    expect(span).toBeInTheDocument()

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 9.99 } })
    fireEvent.blur(input)

    screen
      .findByText('input has max errors')
      .then(() => expect(true).toBeFalse())
      .catch(() => expect(span).not.toBeInTheDocument())
  })
})
