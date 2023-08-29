import { useState, useContext } from 'react';
import { TokenContext } from './TokenContext';
import { useNavigate } from 'react-router-dom';
const serverLink = require('./serverLink');

const CreatePost = () => {

    const token = useContext(TokenContext);
    const navigate = useNavigate();  
    const [ creating, setCreating ] = useState(false);

    const createPost = async () => {
        setCreating(true);
        let fetchOptions = {
            method: "POST",  
            redirect: 'manual',  
            mode: 'cors',        
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
            },
        };
        let link = `${serverLink}/create`;
        try {
            let res = await fetch(link, fetchOptions);
            if (!res.ok) {
                let error = await res.text();
                console.log(error);
                setCreating(false);
                navigate('/');
            }
            let responseData = await res.json();
            if (responseData.status === 'saved') {
                setCreating(false);
                navigate(`/post/${responseData.id}/update`); 
            }
            else if (responseData.status === 'error') {
                setCreating(false);
                navigate('/login');
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return(
        <button type='button' onClick={createPost} disabled={creating ? true : false}>
            Create Post
        </button>
    )
}

export default CreatePost;