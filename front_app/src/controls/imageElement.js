import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import { imageRepositoryURL } from '../common/constants'
import defaultImg from '../common/defaultImg.jpg'

function ImageElement(props) {
    return (
        <Row style={{marginBottom: '2%'}} className="justify-content-md-center row">
            <Image src={props.image === '' ? defaultImg : imageRepositoryURL+props.image}
                rounded width="500" style={{border: '1px solid'}} />
        </Row>
    );
}

export default ImageElement;
