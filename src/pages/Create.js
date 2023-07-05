import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TokenContext } from '../components/TokenContext';
const serverLink = require('../components/serverLink');

const Create = (props) => {
    const token = useContext(TokenContext);
    const navigate = useNavigate();
    const [ title, setTitle ] = useState('');
    const [ sections, setSections ] = useState([]);
    const [ images, setImages ] = useState([]);
    const [ paragraphs, setParagraphs ] = useState([]);
    const [ published, setPublished ] = useState(false);
    const [ postStatus, setPostStatus ] = useState('');
    const [ formatErrors, setFormatErrors ] = useState([]);
    
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, []);

    const addParagraph = () => {
        setSections(state => [...state, {
            index: paragraphs.length,
            contentType: 'paragraph'
        }]);
        setParagraphs(state => [...state, {
            text: '',
        }])
    }

    const updateParagraph = (index, property, text) => {
        let aux = paragraphs;
        aux[index][property] = text;
        setParagraphs(state => [...aux]);
    }

    const submitPost = async (e) => {
        e.preventDefault();
        let post = {
            title,
            sections,
            paragraphs,
            images,
            published,
            createdAt: new Date(),  
        };

        let fetchOptions = {
            method: "POST",  
            redirect: 'manual',  
            mode: 'cors',        
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(post),
        };
        //Get the response body as JSON.
        //If the response was not OK, throw an error.
        setPostStatus('Posting...');
        setFormatErrors([]);
        try {
            let res = await fetch(`${serverLink}/create`, fetchOptions);
            //If the response is not ok throw an error (for debugging)
            if (!res.ok) {
                setPostStatus('Something went wrong ><');
                let error = await res.text();
                console.log(error);
            }
            //If the response was OK, return the response body.
            let responseData = await res.json();
            if (responseData.status == 'saved') {
                setPostStatus('Saved!');
                //if create
                //redirect to post/:id/editor
                //if update dont redirect
            }
            else if (responseData.status == 'error') {
                setPostStatus('Format errors');
                setFormatErrors(state => [ ...responseData.errors])
            }
        }
        catch (error) {
            setPostStatus('Something went wrong ><');
            console.error(error);
        }

        setTimeout(() => {
            setPostStatus('');
        }, 5000)

    }

    return (
        <div>
            <form>
                <input type='text' id='title' placeholder='Title'
                    onChange={(e) => {setTitle(e.target.value)}}>
                </input>
                {sections.map((section, index) => {
                    if (section.contentType === 'paragraph')
                    return(
                        <div key={index}>
                            {paragraphs[section.index].header !== undefined ? 
                            <input type='text' placeholder='Header'
                                onChange={(e) => {updateParagraph(section.index, 'header', e.target.value)}}>
                            </input>
                            :
                            <button 
                                onClick={() => {updateParagraph(section.index, 'header', '')}}
                                type='button'> Add Header
                            </button>}
                            <textarea
                                onChange={(e) => {updateParagraph(section.index, 'text', e.target.value)}}
                                placeholder='Think how to begin..'>
                            </textarea>
                        </div>
                    )
                })}
                <button type='button' onClick={addParagraph}>
                    Add paragraph
                </button>
                <button type='button' onClick={() => {setPublished(!published)}}>
                    {published ? 'Published' : 'Unpublished'}
                </button>
                <button type='button' onClick={(e) => submitPost(e)}>Submit</button>
            </form>
            <ul className='errors'>
                {formatErrors.map((err, index) => {
                    return(
                        <li key={index}>{err.msg}</li>
                    )
                })}
            </ul>
            {postStatus !== '' ? 
            <div className='message'>
                <p>{postStatus}</p>
            </div>
            :
            ''}
        </div>
    );
};

export default Create;