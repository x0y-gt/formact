import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

import { useInput } from 'formact'
import 'formact/dist/index.css'

const App = () => {
  const [val] = useInput();

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group>
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control type=''></Form.Control>
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
            <Button>Enviar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default App
