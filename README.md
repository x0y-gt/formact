# useForm

Trying to make the simplest react form hook

[![NPM](https://img.shields.io/npm/v/formact.svg)](https://www.npmjs.com/package/formact) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Get Started

### Install

```bash
npm install --save @milkyweb/use-form
```

or

```bash
yarn add @milkyweb/use-form
```

### Register a Form

Inside another hook or your component:

```js
const { register, handleSubmit } = useForm()
```

### Register Fields

After the useForm initialization, you can use the `register` function to define new fields. This
function returns 3 objects, e.g:

```js
const { props, isTouched, errors } = register('name')
```

- The `props` object must be passed to the form field.
- `isTouched` turns into true when the user first touches the fields
- And `error` is an object containing possible errors

```jsx
<input name='lastname' type='text' {...props} />
```

## Events

## License

GNUv3 © [x0y-gt](https://github.com/x0y-gt)
