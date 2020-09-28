import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm = ({onInputChange, onBtnSubmit}) => {
    return (
        <div>
            <p className='f3'>
                {'this magic brain will detect faces in your pictures'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'> 
                    <input type='text' className='f4 pa2 w-70 center' onChange={onInputChange}></input>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                    onClick = {onBtnSubmit}>detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;