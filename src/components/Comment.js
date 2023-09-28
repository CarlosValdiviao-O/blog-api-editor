import { useContext, useState } from 'react';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
import { TokenContext } from '../components/TokenContext';

const Comment = (props) => {
    const { comment, id, setPostStatus, removeComment, index } = props;
    const token = useContext(TokenContext);
    const serverLink = require('./serverLink');
    const [ isHovered, setIsHovered ] = useState(false);
    const deleteComment = async () => {
        let fetchOptions = {
            method: "POST",       
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
            },
        };
        try {
            let res = await fetch(`${serverLink}/post/${id}/comment/${comment._id}/delete`, fetchOptions);
            if (!res.ok) {
                setPostStatus('Something went wrong ><');
                let error = await res.text();
                console.log(error);
            }
            let responseData = await res.json();
            if (responseData.status === 'deleted') {
                setPostStatus('Comment Deleted'); 
                removeComment(index);
            }
        }
        catch (error) {
            setPostStatus('Something went wrong ><');
            console.error(error);
        }

        setTimeout(() => {
            setPostStatus('');
        }, 5000)
    };
    return (
        <div className='comment'>
            <h3>{comment.author}</h3>
            <p>{comment.text}</p>
            <p className='date'>{comment.createdAt ? new Date(comment.createdAt).toDateString() : new Date().toDateString()}</p>      
            <button type='button' className="remove-comment" 
                onClick={deleteComment}                
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                    <Icon path={mdiDelete} size={1} />
            </button> 
            {isHovered && 
                <div className='cover'></div>} 
        </div>
    )
}

export default Comment;