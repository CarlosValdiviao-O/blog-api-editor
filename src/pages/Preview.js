import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TokenContext } from '../components/TokenContext';
import NavBar from '../components/NavBar';
import "../components/Preview.css";
const serverLink = require('../components/serverLink');

const Preview = () => {

    const token = useContext(TokenContext);
    const { id } = useParams();
    const [ title, setTitle ] = useState('');
    const [ sections, setSections ] = useState([]);
    const [ images, setImages ] = useState([]);
    const [ paragraphs, setParagraphs ] = useState([]);
    const [ published, setPublished ] = useState(false);
    
    useEffect(() => {
        const aux = async () => {
            let data = await fetchPost();
            setTitle(data.post.title);
            setSections(data.post.sections);
            setImages(data.post.images);
            setParagraphs(data.post.paragraphs);
            setPublished(data.post.published);
        } 
        aux();
    }, []);

    const fetchPost = async () => {
        let res = await fetch(`${serverLink}/post/${id}`, {"headers": {"authorization": `Bearer ${token}`}});
        return res.json();
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className='post'>
                <h1 className='title'>{title}</h1>
                {sections.map((section, index) => {
                    if (section.contentType === 'paragraph')
                    return(
                        <div key={index} className='section'>
                            {paragraphs[section.index].header !== undefined ?
                                <h3 className='header'>
                                    {paragraphs[section.index].header}
                                </h3>
                                : ''
                            }
                            <p className='paragraph'>{paragraphs[section.index].text}</p>
                        </div>                       
                    )
                    if (section.contentType === 'image')
                    return(
                        <div key={index} className='section'>
                            {images[section.index].header !== undefined ? 
                                <h3 className='header'>
                                    {images[section.index].header}
                                </h3>
                                : ''
                            }    
                            {images[section.index].url !== undefined ?                        
                                <div className='preview'>
                                    <img src={images[section.index].url} alt={images[section.index].name}></img>
                                </div>
                                : ''
                            }
                        </div>
                    )
                })}
                <div className='buttons'>
                    <div className={published ? 'published' : 'unpublished'}>{published ? 'Published' : 'Unpublished'}</div>
                    <Link className='edit' to={`/post/${id}/update`}>
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Preview;