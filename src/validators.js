/*
 * Each validator return false when validation fails
 */
const defaultValidators = {
  required: (val) => String(val).trim().length,
  minLength: (val, min) => String(val).trim().length >= min,
  maxLength: (val, max) => String(val).trim().length <= max,
  min: (val, min) => isNaN(val) || Number(val) >= min,
  max: (val, max) => isNaN(val) || Number(val) <= max,
  regex: (val, regex) => {
    if (regex instanceof RegExp === false)
      throw new Error('Invalid regular expression in validator')

    return regex.test(val)
  }
}

export default defaultValidators
