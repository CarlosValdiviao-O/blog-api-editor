import { BrowserRouter, Route, Routes } from "react-router-dom";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import { TokenContext } from './components/TokenContext';
import { useState } from "react";
import './components/App.css';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import Preview from "./pages/Preview";
import Footer from "./components/Footer"

firebase.initializeApp({
  apiKey: "AIzaSyCDh_-AoS40VaWulGmyqZetAmiGq0hBEZo",
  authDomain: "carlos-valdivia-blog-editor.firebaseapp.com",
  projectId: "carlos-valdivia-blog-editor",
  storageBucket: "carlos-valdivia-blog-editor.appspot.com",
  messagingSenderId: "943898005108",
  appId: "1:943898005108:web:7ed1edff6eefc59ecc0b21"
});

function App() {

  const [ token, setToken ] = useState(null);

  const storage = firebase.storage();
  const auth = firebase.auth();
  //auth.signInWithEmailAndPassword()

  return (
    <BrowserRouter basename="/">
        <TokenContext.Provider value={token}>
          <div id='blog'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn setToken={setToken} auth={auth}/>}/>
              <Route path="/post/:id" element={<Preview />} />
              <Route path="/post/:id/update" element={<Editor storage={storage}/>} />
            </Routes>
          </div>
          <Footer />
        </TokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;
