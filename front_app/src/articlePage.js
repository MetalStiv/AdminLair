import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { blogAxios } from './common/constants'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import { imageRepositoryURL } from './common/constants'
import 'typeface-courier-prime'
import parse from 'html-react-parser'
import Button from 'react-bootstrap/Button'
import Moment from 'react-moment'
import 'moment/locale/ru'

var dateFormat = require("dateformat");
dateFormat.i18n = {
    dayNames: [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье"
    ],
    monthNames: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Мая",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
        "Января",
        "Февраля",
        "Марта",
        "Апреля",
        "Мая",
        "Июня",
        "Июля",
        "Августа",
        "Сентября",
        "Октября",
        "Ноября",
        "Декабря"
    ]
};

function ArticlePage(props) {
    const {id} = useParams()
    const [data, setData] = useState({name: '', content: [], time_created: '', time_updated: ''})
    const history = useHistory()

    useEffect(() => {
        blogAxios.get('/getArticleById', {
            params: {
                id: id
            }
        })
            .then(response => setData(response.data))
    }, [])

    return (
        <Row style={{margin: '0'}}>
            <Col md={9}>
                <Card style={{marginTop: '3%', marginBottom: '3%', padding: '2%'}}>
                    <Card.Body>
                        <Card.Title as="h1" style={{marginBottom: '3%'}}>{data.name}</Card.Title>
                        <Row className="d-flex flex-row-reverse">
                            <small className="text-muted" style={{marginBottom: '1%'}}>Дата создания:{' '}
                                <Moment locale='ru' parse={'DD-MM-YYYY HH:mm:ss'} format="DD MMMM YYYY HH:mm:ss">
                                    {data.time_created}
                                </Moment>
                            </small>
                        </Row>
                        <Row className="d-flex flex-row-reverse">
                            {
                                data.time_updated !== data.time_created ? 
                                    <small className="text-muted" style={{marginBottom: '2%'}}>Обновлено:{' '}
                                        <Moment locale='ru' parse={'DD-MM-YYYY HH:mm:ss'} format="DD MMMM YYYY HH:mm:ss">
                                            {data.time_updated}
                                        </Moment>
                                    </small> : ''
                            }
                        </Row>
                        {
                            data.content.sort((a, b) => a.order < b.order ? -1 : 1)
                                .map(el => {
                                    if (el.type === 'text'){
                                        return <Row style={{marginBottom: '2%'}}>{parse(el.text)}</Row>
                                    }
                                    if (el.type === 'image'){
                                        return <Row style={{marginBottom: '2%'}} className="justify-content-md-center row">
                                            <Image src={imageRepositoryURL+el.image}
                                                rounded width="600" style={{border: '1px solid'}} />
                                            </Row>
                                    }
                                    if (el.type === 'code'){
                                        return <Row style={{marginBottom: '2%'}} >
                                                <Col md={12}>
                                                    <Card bg='light' style={{whiteSpace: 'pre-wrap', padding: '1%'}}>
                                                        {el.code}
                                                    </Card>
                                                </Col>
                                            </Row>
                                    }
                                })
                        }
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Button block onClick={() => history.push(`/updateArticle/${id}`)} variant="warning" style={{marginTop: '9%'}}>
                    Редактировать статью</Button>
            </Col>
        </Row>
    );
}

export default ArticlePage;
