import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { imageRepositoryURL } from '../common/constants'
import defaultImg from '../common/defaultImg.jpg'
import parse from 'html-react-parser'
import Moment from 'react-moment'
import 'moment/locale/ru'

function ArticlePreview(props) {
    return (
        <React.Fragment>
            <Card style={{marginTop: '2%'}}>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col xs={12} md={9}>
                                {props.title}
                            </Col>
                            <Col md={3}>
                                <small className="text-muted d-flex flex-row-reverse">
                                    <Moment locale='ru' parse={'DD-MM-YYYY HH:mm:ss'} format="DD MMM YYYY HH:mm:ss">
                                        {props.createdTime}
                                    </Moment>
                                </small>
                            </Col>
                        </Row>
                    </Card.Title>
                    <Row>
                        <Col xs={12} md={4}>
                            <Image src={props.image ? imageRepositoryURL+props.image : defaultImg} 
                                rounded width="300" style={{border: '1px solid'}} />
                        </Col>
                        <Col xs={12} md={8}>
                            <Card.Text>
                                <Row>
                                    {parse(props.text)}
                                     ...
                                </Row>
                                
                                <div class="d-flex flex-row-reverse">
                                    <Button variant="outline-warning" style={{marginTop: '30px'}} onClick={() => {
                                        props.toArticle()
                                    }}>Подробнее</Button>
                                </div>
                                
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

ArticlePreview.propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    text: PropTypes.string,
    id: PropTypes.number
}

export default ArticlePreview;
  