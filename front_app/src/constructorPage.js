import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { blogAxios } from './common/constants'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import { imageRepositoryURL } from './common/constants'
import TextElement from './controls/textElement'
import ImageElement from './controls/imageElement'
import CodeElement from './controls/codeElement'
import Button from 'react-bootstrap/Button'
import defaultImg from './common/defaultImg.jpg'
import Form from 'react-bootstrap/Form'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

function ConstructorPage(props) {
    const [content, setContent] = useState([{order: 0, type: 'text', text: ''}])
    const [categories, setCategories] = useState([])
    const [name, setName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('0')
    const [image, setImage] = useState('')
    const [currentOrder, setCurrentOrder] = useState(-1)
    const [nameError, setNameError] = useState(0)
    const [fileSizeError, setFileSizeError] = useState(0)

    const history = useHistory()
    const articleImage = useRef(null) 
    const {id} = useParams()

    useEffect(() => {
        blogAxios.get('/getCategoryList')
            .then(response => 
            {
                let data = response.data.filter(category => category.children.length === 0)
                setSelectedCategory(data[0].id)
                setCategories(data)
            })
            .then(() => {
                if (props.mode === 1){
                    blogAxios.get('/getArticleById', {
                        params: {
                            id: id
                        }
                    })
                        .then(response => {
                            setName(response.data.name)
                            setImage(response.data.image)
                            setSelectedCategory(response.data.category)
                            if (response.data.content.length > 0){
                                setContent(response.data.content)
                            }
                            else{
                                setContent([{order: 0, type: 'text', text: ''}])
                            }
                        })
                }
            })
        }, []
    );

    const insertAfter = (id, type) =>{
        let modified = content
            .map(el => {
                if (el.order <= id){
                    return el
                }
                if (el.order > id){
                    el.order += 1
                    return el
                }
            })
        if (type === 'text'){
            modified.push({order: id+1, type: 'text', text: ''})
        }
        if (type === 'image'){
            setCurrentOrder(id+1)
            articleImage.current.click()
            modified.push({order: id+1, type: 'image', image: ''})
        }
        if (type === 'code'){
            modified.push({order: id+1, type: 'code', code: ''})
        }
        setContent(modified)
    }

    const deleteById = (id) =>{
        let modified = content
            .filter(el => el.order !== id)
            .map(el => {
                if (el.order < id){
                    return el
                }
                if (el.order > id){
                    el.order -= 1
                    return el
                }
            })
        setContent(modified)
    }

    const setContentByOrder = (order, innerContent) => {
        let tmpContent = content.filter(el => el.order !== order)
        tmpContent.push({order: order, ...innerContent})
        setContent(tmpContent)
    }

    const saveArticle = () => {
        if (name === ''){
            setNameError(1)
            return
        }
        if (props.mode === 0){
            blogAxios.post('/addArticle',
                JSON.stringify({
                    name: name,
                    category: selectedCategory,
                    content: content,
                    image: image
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
            .then(response => history.push('/article/'+response.data.id))
        }
        if (props.mode === 1){
            blogAxios.post('/updateArticle',
                JSON.stringify({
                    id: id,
                    name: name,
                    category: selectedCategory,
                    content: content,
                    image: image
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
            .then(response => history.push('/article/'+id))
        }
    }

    const uploadImage = (e) => {
        if (e.currentTarget.files[0].size > 1024*1024*5){
          setFileSizeError(1)
          return
        }
        setFileSizeError(0)
        let formData = new FormData();
        formData.append("file", e.currentTarget.files[0]);
        blogAxios.post('/uploadImage', formData)
            .then(response => {
                if (currentOrder === -1){
                    setImage(response.data.filename)
                }
                else {
                    let tmpContent = content.filter(el => el.order !== currentOrder)
                    tmpContent.push({order: currentOrder, type: 'image', image: response.data.filename})
                    setContent(tmpContent)
                }
            })
    }

    return (
        <React.Fragment>
            <Col md={9}>
                <Card style={{marginTop: '3%', padding: '2%'}}>
                    <Row>
                        <Col md={8}>
                            <Form.Group as={Row}>
                                <Form.Label column sm={2}>
                                    Название
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm={2}>
                                    Категория
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control 
                                        as="select"
                                        value={selectedCategory}
                                        onChange={e => {
                                            setSelectedCategory(e.target.value)
                                        }}>
                                    {
                                        categories.map(category => {
                                            return <option value={category.id}>{category.name}</option>
                                        })
                                    }
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Row style={{marginTop: '20%'}} className="d-flex flex-row-reverse">
                                <Button variant={'outline-warning'} onClick={() => saveArticle()} style={{margin: '1%'}}>Сохранить статью</Button>
                                <Button variant={'outline-secondary'} onClick={() => history.goBack()} style={{margin: '1%'}}>Отмена</Button>
                            </Row>
                            {
                                nameError === 1 ? <div className='text-danger'>Укажите название статьи!</div> : ''
                            }
                            {
                                fileSizeError === 1 ? <div className='text-danger'>Размер изображения не должен превышать 5Мб!</div> : ''
                            }
                        </Col>
                        <Col md={4}>
                            <Image src={image === '' ? defaultImg : imageRepositoryURL+image}
                                rounded width="300" style={{border: '1px solid'}} onClick={() => {
                                    setCurrentOrder(-1)
                                    articleImage.current.click()
                                }} />
                            <input type="file" name="article-image" id="article-image" class="file-input" accept="image/*"
                                ref={articleImage} style={{display: 'none'}} onChange={(e) => uploadImage(e)} />
                        </Col>
                    </Row>
                    {
                        content.sort((a, b) => a.order < b.order ? -1 : 1)
                            .map(el => {
                                if (el.type === 'text'){
                                    return <Row style={{marginTop: '2%'}}>
                                            <Col md={12}>
                                                <TextElement text={el.text} setContent={setContentByOrder} order={el.order} />
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'text')
                                                }}
                                                variant="outline-warning" style={{marginTop: '10%'}}>
                                                    Добавить текст</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'image')
                                                }} 
                                                variant="outline-warning" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Добавить изображение</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'code')
                                                }} variant="outline-warning" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Добавить код</Button>
                                            </Col>
                                            <Col md={3}>
                                                {
                                                    el.order > 0 ?
                                                        <Button block onClick={() => deleteById(el.order)} variant="outline-danger" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                            Удалить блок</Button> : ''
                                                }
                                            </Col>
                                        </Row>
                                }
                                if (el.type === 'image'){
                                    return <Row style={{marginTop: '2%'}}>
                                            <Col md={12}>
                                                <ImageElement image={el.image} />
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'text')
                                                }}
                                                variant="outline-warning" style={{marginTop: '10%'}}>
                                                    Добавить текст</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'image')
                                                }} 
                                                variant="outline-warning" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Добавить изображение</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'code')
                                                }} variant="outline-warning" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Добавить код</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => deleteById(el.order)} variant="outline-danger" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Удалить блок</Button>
                                            </Col>
                                        </Row>
                                }
                                if (el.type === 'code'){
                                    return <Row style={{marginTop: '2%'}}>
                                            <Col md={12}>
                                                <CodeElement code={el.code} setContent={setContentByOrder} order={el.order} />
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'text')
                                                }}
                                                variant="outline-warning" style={{marginTop: '10%'}}>
                                                    Добавить текст</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'image')
                                                }} 
                                                variant="outline-warning" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Добавить изображение</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => {
                                                    insertAfter(el.order, 'code')
                                                }} variant="outline-warning" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Добавить код</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Button block onClick={() => deleteById(el.order)} variant="outline-danger" style={{marginTop: '10%', marginBottom: '10%'}}>
                                                    Удалить блок</Button>
                                            </Col>
                                        </Row>
                                }
                            })
                    }
                </Card>
            </Col>
        </React.Fragment>
    );
}

ConstructorPage.propTypes = {
    mode: PropTypes.number.isRequired
}

export default ConstructorPage;
