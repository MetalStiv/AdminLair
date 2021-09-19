import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { Editor } from '@tinymce/tinymce-react'

function TextElement(props) {
    return (
        <Editor
            apiKey='h6n3c96inkb0k6gylfk4itiylvrtj62q1p0umc7us170pn4q'
            onInit={() => {}}
            value={props.text}
            onEditorChange={val =>{
                props.setContent(props.order, {type: 'text', text: val})
            }}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | link | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
}

export default TextElement;
