import { useEffect } from 'react';
import Comment from '../components/Comment';
const serverLink = require('../components/serverLink');

const Comments = (props) => {
    const { id, comments, setComments, setPostStatus } = props;

    useEffect(() => {
        const aux = async () => {
            let data = await fetchComments();
            setComments(data.comments);
        } 
        aux();
    }, []);

    const fetchComments = async () => {
        let res = await fetch(`${serverLink}/post/${id}/comments`);
        return res.json();
    }

    const removeComment = (index) => {
        let aux = comments;
        aux.splice(index, 1);
        setComments(aux);
    }

    return (
       <div className='comments-wrapper'>
            <h3>Comments</h3>
                <div className='comments'>
                    {comments ? 
                    comments.map((comment, index)=> {
                        return(
                            <Comment comment={comment} id={id} key={index} 
                                setPostStatus={setPostStatus} index={index}
                                removeComment={removeComment}/>
                        )
                    }):
                    <p>Searching for comments...</p>}  
                    {comments && comments.length == 0 && <p>No comments found</p>}
                </div>
       </div> 
    )

}

export default Comments;