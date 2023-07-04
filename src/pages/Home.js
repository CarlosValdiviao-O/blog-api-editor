import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
    
    //const fetchGames = async (link) => {
    //    let games = await getRAWG({link: link});
    //    return JSON.parse(games.data);
    //}

    return (
        <div id='home'>
            <h1 id='greet'>Welcome to My Personal Blog!</h1>
            <div id='posts'>
                
            </div>
            <Link id='create' to={'/create'}>
            
            </Link>
        </div>
    );
};

export default Home;

