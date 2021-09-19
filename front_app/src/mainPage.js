import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { blogAxios } from './common/constants'
import ArticlePreview from './controls/articlePreview'
import PropTypes from 'prop-types'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'

function MainPage(props) {
    const [articles, setArticles] = useState([]);
    const history = useHistory()

    const getArticles = (clear) => {
        let startId = articles.length
        if (clear){
            startId = 0
        }
        const idStep = 5;
        blogAxios.get('/getArticles', {
            params: {
                startId: startId,
                step: idStep,
                categoryFilter: props.categoryFilter,
                searchFilter: props.searchFilter
            }
        })
            .then(response => {
                if (clear){
                    setArticles(response.data)
                }
                else {
                    setArticles(articles.concat(response.data))
                }
            })
    }

    useEffect(() => {
        getArticles(true)
    }, [props.categoryFilter, props.searchFilter]);

    const handleOnDocumentBottom = useCallback(() => {
        getArticles(false)
    }, [articles]);

    useBottomScrollListener(handleOnDocumentBottom);

    return (
        <Row style={{margin: '0'}}>
            <Col md={9}>
            {
                articles.map(article => <ArticlePreview title={article.name} 
                    image={article.image} key={article.id} id={article.id} 
                    toArticle={() => history.push('/article/'+article.id)}
                    createdTime={article.time_created}
                    text={article.content.find(el => el.order === 0) ? 
                    article.content.find(el => el.order === 0).text.substr(0, 500) : ''} />)
            }
            </Col>
            <Col md={3}>
                <Button block onClick={() => history.push('/constructor')} variant="warning" style={{marginTop: '7%'}}>
                    Добавить статью</Button>
            </Col>
        </Row>
    );
}

MainPage.propTypes = {
    categoryFilter: PropTypes.number.isRequired,
    searchFilter: PropTypes.string.isRequired,
}

export default MainPage;
