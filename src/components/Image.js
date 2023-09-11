import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
import { useState } from 'react';

const Image = (props) => {
    const { section, index, updateImage, images, removeSection,
        uploadImage, removeHeader, updateFirebaseImage } = props;
        const [ isHovered, setIsHovered ] = useState(false);
    return(
        <div>
            {images[section.index].header !== undefined ? 
                <input type='text' placeholder='Header' className='header'
                    value={images[section.index].header}
                    onChange={(e) => {updateImage(section.index, 'header', e.target.value)}}>
                </input>
                : ''
            }    
            {images[section.index].url !== undefined ?                        
            <div className='preview'>
                <img src={images[section.index].url} alt={images[section.index].name}></img>
            </div>
            : ''}
            <div className='buttons'>
                <input type='file' id={`file${section.index}`}></input>
                {images[section.index].url !== undefined ? 
                <button type="button" onClick={() => updateFirebaseImage(section.index)}>Update Image</button>
                :
                <button type='button' onClick={() => uploadImage(section.index)}>Upload Image</button>   
                } 
            </div>
            <div className='buttons'>
                {images[section.index].header !== undefined ? 
                    <button
                        onClick={() => removeHeader(section.index, 'image')}
                        type='button'> Remove Header
                    </button>
                    :
                    <button 
                        onClick={() => {updateImage(section.index, 'header', '')}}
                        type='button'> Add Header
                    </button>
                }
                <button type='button' className="remove-section" 
                    onClick={() => removeSection(index)}                
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                        <Icon path={mdiDelete} size={1} />
                </button> 
            </div> 
            {isHovered && 
                <div className='cover'></div>} 
        </div>
    )
}

export default Image;