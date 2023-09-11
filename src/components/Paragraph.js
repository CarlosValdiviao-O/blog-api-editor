import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
import { useState } from 'react';

const Paragraph = (props) => {
    const { section, index, updateParagraph, paragraphs,
        removeSection, removeHeader } = props;
    const [ isHovered, setIsHovered ] = useState(false);

    return(
        <div>
            {paragraphs[section.index].header !== undefined ?
                <input type='text' placeholder='Header' className='header' 
                    value={paragraphs[section.index].header}
                    onChange={(e) => {updateParagraph(section.index, 'header', e.target.value)}}>
                </input>
                : ''
            }
            <textarea
                onChange={(e) => {updateParagraph(section.index, 'text', e.target.value)}}
                placeholder='Think how to begin..' value={paragraphs[section.index].text}>
            </textarea>
            <div className='buttons'>
                {paragraphs[section.index].header !== undefined ? 
                    <button
                        onClick={() => removeHeader(section.index, 'paragraph')}
                        type='button'> Remove Header
                    </button>
                    :
                    <button 
                        onClick={() => {updateParagraph(section.index, 'header', '')}}
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

export default Paragraph;