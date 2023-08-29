
const Paragraph = (props) => {
    const { section, index, updateParagraph, paragraphs,
        removeSection, removeHeader } = props;
    return(
        <div>
            {paragraphs[section.index].header !== undefined ? 
            <div>
                <input type='text' placeholder='Header' value={paragraphs[section.index].header}
                    onChange={(e) => {updateParagraph(section.index, 'header', e.target.value)}}>
                </input>
                <button
                    onClick={() => removeHeader(section.index, 'paragraph')}
                    type='button'> Remove Header
                </button>
            </div>
            :
            <button 
                onClick={() => {updateParagraph(section.index, 'header', '')}}
                type='button'> Add Header
            </button>}
            <textarea
                onChange={(e) => {updateParagraph(section.index, 'text', e.target.value)}}
                placeholder='Think how to begin..' value={paragraphs[section.index].text}>
            </textarea>
            <button type='button' onClick={() => removeSection(index)}>Remove Section</button>  
        </div>
    )
}

export default Paragraph;