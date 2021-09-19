import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/js/dist/dropdown'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { blogAxios } from './common/constants'
import Image from 'react-bootstrap/Image'
import headerImg from './common/headerImg.jpg'
import PropTypes from 'prop-types'

const Header = (props) => {
    const [categories, setCategories] = useState([]);
    const searchInputRef = useRef();

    useEffect(() => {
        blogAxios.get('/getCategories')
            .then(response => setCategories(response.data))  
        }, []
    );

    const history = useHistory()

    return (
        <Container fluid>
            <Row>
                <Image style={{margin: '1%'}} src={headerImg} width="100%" />
            </Row>
            <Navbar bg="light" variant="light">
                <Col md={8}>
                    <Navbar.Brand href="/">Главная</Navbar.Brand>
                    <Nav navbarScroll onSelect={(selectedKey) => {
                        props.setCategoryFilter(selectedKey)
                        history.push('/')  
                    }}>
                    {
                        categories.map(category => {
                            if (category.children.length === 0){
                                return <Nav.Link eventKey={category.id}>{category.name}</Nav.Link>
                            }
                            return <NavDropdown title={category.name} key={category.id} >
                            {
                                category.children.map(childCategory => {
                                    return <NavDropdown.Item eventKey={childCategory.id}>{childCategory.name}
                                    </NavDropdown.Item>
                                })
                            }
                            </NavDropdown>
                            })
                    }
                    </Nav>
                </Col>
                <Col md={4}>
                    <Form>
                        <Row>
                            <Col md={8}>
                            <FormControl type="text" placeholder="Поиск.." ref={searchInputRef} />
                            </Col>
                            <Col md={4}>
                            <Button variant="outline-warning" onClick={() => {
                                props.setSearchFilter(searchInputRef.current.value);
                                props.setCategoryFilter(0)
                                history.push('/')
                            }}>Найти</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Navbar>
        </Container>
    )
}

Header.propTypes = {
    setCategoryFilter: PropTypes.func.isRequired,
    setSearchFilter: PropTypes.func.isRequired
}

export default Header
  