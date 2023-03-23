import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

import useForm from '@milkyweb/use-form'

const App = () => {
  const { register, handleSubmit } = useForm()

  const { props, errors } = register('name', {
    validations: {
      required: true
    }
  })

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(handleSubmit((data) => console.log(data)))
  }

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control type='text' {...props}></Form.Control>
              {errors.required && <p>Este campo es requerido</p>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Telefono</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Plan</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Comprobante de Pago</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            <Button className='mt-3' type='submit'>
              Enviar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default App
