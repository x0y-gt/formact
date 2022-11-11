import defaultValidators from './validators'

export default function validate(value, validations) {
  const keys = Object.keys(validations)
  const errors = keys.filter((key) => {
    if (key in defaultValidators)
      return !defaultValidators[key](value, validations[key])
    else if (typeof validations[key] === 'function')
      return !validations[key](value)

    return true
  })

  return errors
}
