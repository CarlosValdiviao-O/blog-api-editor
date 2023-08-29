
const Image = (props) => {
    const { section, index, updateImage, images, removeSection,
        uploadImage, removeHeader, updateFirebaseImage } = props;
    return(
        <div>
            {images[section.index].header !== undefined ? 
            <div>
                <input type='text' placeholder='Header' value={images[section.index].header}
                    onChange={(e) => {updateImage(section.index, 'header', e.target.value)}}>
                </input>
                <button
                    onClick={() => removeHeader(section.index, 'image')}
                    type='button'> Remove Header
                </button>
            </div>
            :
            <button 
                onClick={() => {updateImage(section.index, 'header', '')}}
                type='button'> Add Header
            </button>}    
            {images[section.index].url !== undefined ?                        
            <div className='preview'>
                <img src={images[section.index].url} alt={images[section.index].name}></img>
            </div>
            : ''}
            <input type='file' id={`file${section.index}`}></input>
            {images[section.index].url !== undefined ? 
            <button type="button" onClick={() => updateFirebaseImage(section.index)}>Update Image</button>
            :
            <button type='button' onClick={() => uploadImage(section.index)}>Upload Image</button>   
            } 
            <button type='button' onClick={() => removeSection(index)}>Remove Section</button>           
        </div>
    )
}

export default Image;