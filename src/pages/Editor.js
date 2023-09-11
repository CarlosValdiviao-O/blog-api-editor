import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { TokenContext } from '../components/TokenContext';
import NavBar from '../components/NavBar';
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import Paragraph from '../components/Paragraph';
import Image from '../components/Image';
import "../components/Editor.css";
const serverLink = require('../components/serverLink');

const Editor = (props) => {
    const { storage } = props;
    const token = useContext(TokenContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [ title, setTitle ] = useState('');
    const [ sections, setSections ] = useState([]);
    const [ images, setImages ] = useState([]);
    const [ paragraphs, setParagraphs ] = useState([]);
    const [ published, setPublished ] = useState(false);
    const [ postStatus, setPostStatus ] = useState('');
    const [ formatErrors, setFormatErrors ] = useState([]);
    
    useEffect(() => {
        setPublished(false);
    }, [ title, sections, images, paragraphs ])

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        const aux = async () => {
            let data = await fetchPost();
            setTitle(data.post.title);
            setSections(data.post.sections);
            setImages(data.post.images);
            setParagraphs(data.post.paragraphs);
            setTimeout(()=> {
                setPublished(data.post.published);
            }, 200);
        } 
        aux();
    }, []);

    const fetchPost = async () => {
        let res = await fetch(`${serverLink}/post/${id}/update`, {"headers": {"authorization": `Bearer ${token}`}});
        return res.json();
    }

    const addParagraph = () => {
        setSections(state => [...state, {
            index: paragraphs.length,
            contentType: 'paragraph'
        }]);
        setParagraphs(state => [...state, {
            text: '',
        }])
    }

    const addImage = () => {
        setSections(state => [...state, {
            index: images.length,
            contentType: 'image'
        }]);
        setImages(state => [...state, {

        }]);
    }

    const removeHeader = (index, type) => {
        if (type === 'image') {
            let aux = images;
            delete aux[index].header;
            setImages(state => [...aux]);
        }
        else {
            let aux = paragraphs;
            delete aux[index].header;
            setParagraphs(state => [...aux]);
        }
    }

    const updateParagraph = (index, property, text) => {
        let aux = paragraphs;
        aux[index][property] = text;
        setParagraphs(state => [...aux]);
    }

    const updateImage = (index, property, text) => {
        let aux = images;
        aux[index][property] = text;
        setImages(state => [...aux]);
    }

    const uploadImage = async (index) => {
        const fileInput = document.getElementById(`file${index}`);
        const file = fileInput.files[0];
        if (file === undefined){
            setPostStatus('You must pick a file');
            return;
        }
        if (!file.type.startsWith('image')) {
            setPostStatus('You must pick an image');
            return;            
        }
        await uploadToFirebase(file, index);
        await submitPost('save');
        setPostStatus('Image Uploaded');
    }

    const updateFirebaseImage = async (index) => {
        const fileInput = document.getElementById(`file${index}`);
        const file = fileInput.files[0];
        if (file === undefined) {
            setPostStatus('You must pick a file');
            return;
        }
        if (!file.type.startsWith('image')) {
            setPostStatus('You must pick an image');
            return;            
        }
        deleteFirebaseImage(images[index].name);
        await uploadToFirebase(file, index);
        await submitPost('save');
        setPostStatus('Image Updated');
    }

    const uploadToFirebase = async (file, index) => {
        const storageRef = storage.ref();
        const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
        const imageRef = storageRef.child(filename);
        await imageRef.put(file);
        const url = await getDownloadURL(imageRef);
        updateImage(index, 'url', url);
        updateImage(index, 'name', filename);
    }

    const deleteFirebaseImage = (image) => {
        const imageRef = ref(storage, image);
        deleteObject(imageRef).then(() => {
            console.log('image deleted')
        }).catch((err) => {
            console.error(err);
        })
    }

    const removeSection = (index) => {
        let groupIndex = sections[index].index;
        let type = sections[index].contentType;
        let sectionsAux = sections;
        sectionsAux.forEach(section => {
            if (section.index > groupIndex && section.contentType === type)
                section.index--;
        });
        let removed = sectionsAux.splice(index, 1);
        setSections(state => [...sectionsAux]);
        if (removed[0].contentType === 'image') {
            let imagesAux = images;
            let removedImage = imagesAux.splice(groupIndex, 1);
            if (removedImage[0].url) {
                deleteFirebaseImage(removedImage[0].name);    
            }
            setImages(state => [...imagesAux]);
        }
        else {
            let paragraphsAux = paragraphs;
            paragraphsAux.splice(groupIndex, 1);
            setParagraphs(state => [...paragraphsAux]);
        }
        submitPost('save');
    }

    const submitPost = async (api) => {
        let post = {
            title,
            sections,
            paragraphs,
            images,
            published, 
            _id: id,
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
        setPostStatus('Posting...');
        setFormatErrors([]);
        let link = `${serverLink}/post/${id}/${api}`;
        try {
            let res = await fetch(link, fetchOptions);
            if (!res.ok) {
                setPostStatus('Something went wrong ><');
                let error = await res.text();
                console.log(error);
            }
            let responseData = await res.json();
            if (responseData.status === 'saved') {
                setPostStatus('Saved!'); 
                setPublished(false);
            }
            else if (responseData.status === 'published') {
                setPostStatus('Published!');
                setPublished(true);
            }
            else if (responseData.status === 'error') {
                setPostStatus('Fix format errors before publishing');
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

    const handlePublish = () => {
        if (published) {
            setPublished(false);
            submitPost('save');
        }
        else {
            submitPost('publish');
        }
    }

    return (
        <div>
            <NavBar></NavBar>
            <form className='editor'>
                <input type='text' id='title' placeholder='Title' value={title}
                    onChange={(e) => {setTitle(e.target.value)}}>
                </input>
                {sections.map((section, index) => {
                    if (section.contentType === 'paragraph')
                    return(
                        <Paragraph section={section} index={index} key={index}
                            updateParagraph={updateParagraph} paragraphs={paragraphs}
                            removeHeader={removeHeader} removeSection={removeSection}/>
                    )
                    if (section.contentType === 'image')
                    return(
                        <Image section={section} index={index} images={images} key={index}
                            updateImage={updateImage} uploadImage={uploadImage} removeSection={removeSection}
                            removeHeader={removeHeader} updateFirebaseImage={updateFirebaseImage}/>
                    )
                })}
                <div className='buttons'>
                    <button type='button' onClick={addParagraph}>
                        Add paragraph
                    </button>
                    <button type='button' onClick={addImage}>
                        Add Image
                    </button>
                </div>
                <div className='buttons'>
                    <Link to={`/post/${id}`}>Preview</Link>
                    <button type='button' onClick={handlePublish}>
                        {(published === true) ? 'Unpublish' : 'Publish'}
                    </button>
                    <button type='button' onClick={(e) => submitPost('save')}>Save</button>
                </div>
            </form>
            <ul className='errors'>
                {formatErrors.map((err, index) => {
                    return(
                        <li key={index}>{err.msg}</li>
                    )
                })}
            </ul>
            {postStatus !== '' ? 
            <div className='message-container'>
                <p className='message'>{postStatus}</p>
            </div>
            :
            ''}
        </div>
    );
};

export default Editor;
