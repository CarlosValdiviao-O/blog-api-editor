import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import NavBar from '../components/NavBar';
import { TokenContext } from '../components/TokenContext';
const serverLink = require('../components/serverLink');

const Home = () => {

    const [ posts, setPosts ] = useState(null);
    const [ deleted, setDeleted ] = useState('');
    const token = useContext(TokenContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        else {
            const aux = async () => {
                let data = await fetchPosts();
                setPosts(data.posts);
            } 
            aux();
        }
    }, []);
    
    const fetchPosts = async () => {
        let res = await fetch(`${serverLink}/api`, {"headers": {"authorization": `Bearer ${token}`}});
        return res.json();
    }

    const removePost = (index) => {
        let aux = posts;
        aux.splice(index, 1);
        setPosts(aux);
    }

    return (
        <div id='home'>
            <NavBar></NavBar>
            <div className='greet-div'>
                <h1 className='greet'>Welcome Mr Editor</h1>
            </div>
            <h3>Posts</h3>
            <div className='posts'>
                {posts ? 
                posts.map((post, index)=> {
                    return(
                        <Card post={post} key={index} index={index} setDeleted={setDeleted} removePost={removePost}></Card>
                    )
                }):
                <p>Searching for posts...</p>}  
                {posts && posts.length == 0 && <p>No posts found</p>}
            </div>
            {deleted != '' ? 
                <div className='message-container'>
                    <p className='message'>{deleted}</p>
                </div>
            : ''}
        </div>
    );
};

export default Home;

