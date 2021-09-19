import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

function CodeElement(props) {
    return (
        <Form>
            <Form.Group as={Row}>
                <Col md={12}>
                    <Form.Control
                        as='textarea'
                        type="text"
                        rows={20}
                        style={{backgroundColor: '#d1d1d1'}}
                        placeholder=""
                        value={props.code}
                        onChange={e => {
                            props.setContent(props.order, {type: 'code', code: e.target.value})
                        }}
                    />
                </Col>
            </Form.Group>
        </Form>
    );
}

export default CodeElement;
