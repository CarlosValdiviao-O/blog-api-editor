import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TokenContext } from '../components/TokenContext';
const serverLink = require('../components/serverLink');

const LogIn = (props) => {
    const { setToken, auth } = props;
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
            await auth.signInWithEmailAndPassword(username, password);
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
        <h3>Please Log-In before continuing</h3>
        <form>
          <div>
            <label htmlFor='username'>Username:</label>
            <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} placeholder='username'></input>
          </div>
          <div>
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
          </div>
          <button type='button' onClick={login}>Log-In</button>
        </form>
        {loginError ? <p className='login-error'>{loginError}</p> : ''}
      </div>
    );
};

export default LogIn;

