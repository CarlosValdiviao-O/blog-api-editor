import { useContext } from 'react';
import { Link } from 'react-router-dom';
import "./Card.css";
import { TokenContext } from '../components/TokenContext';

const Card = (props) => {
    const { post, setDeleted, index, removePost } = props;
    const token = useContext(TokenContext);
    const serverLink = require('./serverLink');
    const deletePost = async (id) => {
        let fetchOptions = {
            method: "POST",       
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
            },
        };
        try {
            let res = await fetch(`${serverLink}/post/${id}/delete`, fetchOptions);
            if (!res.ok) {
                setDeleted('Something went wrong ><');
                let error = await res.text();
                console.log(error);
            }
            let responseData = await res.json();
            if (responseData.status === 'deleted') {
                setDeleted('Post Deleted'); 
                removePost(index);
            }
        }
        catch (error) {
            setDeleted('Something went wrong ><');
            console.error(error);
        }

        setTimeout(() => {
            setDeleted('');
        }, 5000)
    };

    return (
        <div className='card'>
            <Link to={`/post/${post._id}`}>
                <h3>{post.title ? post.title : "???"}</h3>
                <p>{post.paragraphs.length > 0 ? post.paragraphs[0].text.substring(0, 150) : '???'}</p>
            </Link>    
            <div className='buttons'>
                <button type='button'>
                    <Link to={`/post/${post._id}/update`}>Update</Link>
                </button>
                <button type='button' onClick={() => deletePost(post._id)}>Delete</button>
            </div>            
        </div>
    )
}

export default Card