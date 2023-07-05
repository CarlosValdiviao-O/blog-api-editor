import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TokenContext } from '../components/TokenContext';
const serverLink = require('../components/serverLink');

const LogIn = (props) => {
    const { setToken } = props;
    const token = useContext(TokenContext)
    const [ username, setUsername ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ loginError, setLoginError ] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (token)
            navigate('/');
    }, []);
    const login = async () => {
        console.log(username);
        let fetchOptions = {
          method: "POST",  
          redirect: 'manual',  
          mode: 'cors',        
          headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        };
        console.log(fetchOptions)
        try {
          let res = await fetch(`${serverLink}/login`, fetchOptions);
          //If the response is not ok throw an error (for debugging)
          if (!res.ok) {
            let error = await res.text();
            console.log(error);
          }
          //If the response was OK, return the response body.
          let responseData = await res.json();
          if (responseData.status == 'ok') {
            setToken(responseData.token); 
            navigate('/');
            setLoginError(null);
          }
          else {
            setLoginError(responseData.status);
            navigate('/login')
          }
        }
        catch (error) {
          console.error(error);
        }
      }

    return (
        <div id='login'>
            <form>
                <input onChange={(e) => setUsername(e.target.value)} placeholder='username'></input>
                <input onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                <button type='button' onClick={login}></button>
            </form>
            {loginError ? <p>{loginError}</p> : ''}
        </div>
    );
};

export default LogIn;

