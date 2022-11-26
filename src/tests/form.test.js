import React from 'react'
import { render, screen, renderHook, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import useForm from '../index.js'

const FormExample = () => {
  const { register, handleSubmit } = useForm()
  const { props, isTouched, errors } = register('name')
  const inputPhone = register('phone')

  return (
    <form onSubmit={handleSubmit()}>
      <input type='text' {...props} />
      {isTouched && errors.required && <span>name errors</span>}
      <input type='text' {...inputPhone.props} />
      {inputPhone.isTouched && inputPhone.errors.minLength && (
        <span>name errors</span>
      )}
      <button type='submit'>Send</button>
    </form>
  )
}

describe('Test a complete form', () => {
  it('should return the initial properties of the form context', () => {
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
        'onChange',
        '_validate'
      ].sort()
    )
  })

  it('should stop when submiting if there are errors', async () => {
    const { result } = renderHook(() => useForm())

    await act(() => {
      result.current.register('name', { validations: { require: true } })
    })

    let submitResult
    await act(() => {
      submitResult = result.current.handleSubmit()
    })

    expect(submitResult).toBeFalsy()
  })

  it('should let pass when submiting if there are not errors', async () => {
    const { result } = renderHook(() => useForm())

    await act(() => {
      result.current.register('name', { validations: { required: true } })
    })
    await act(() => {
      result.current.fields['name'].props.onChange({
        target: { value: 'something' }
      })
    })

    let submitResult
    await act(() => {
      submitResult = result.current.handleSubmit()
    })

    expect(submitResult).toBeTruthy()
  })

  it('should call a custom onsubmit fnc with the form data', async () => {
    const customOnSubmit = jest.fn((data) => data)
    const { result } = renderHook(() => useForm())

    await act(() => {
      result.current.register('name', { validations: { required: true } })
    })
    await act(() => {
      result.current.fields['name'].props.onChange({
        target: { value: 'something' }
      })
    })

    await act(() => {
      result.current.handleSubmit(customOnSubmit)
    })

    expect(customOnSubmit).toHaveBeenCalledTimes(1)
    expect(customOnSubmit.mock.results[0].value.name).toBe('something')
  })
})
