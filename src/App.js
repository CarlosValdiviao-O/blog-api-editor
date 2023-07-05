import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./pages/Create";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import { TokenContext } from './components/TokenContext';
import { useState } from "react";

function App() {

  const [ token, setToken ] = useState(null);

  return (
    <BrowserRouter basename="/">
        <TokenContext.Provider value={token}>
          <div id='blog'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn setToken={setToken} />}/>
              <Route path="/create" element={<Create />} />
            </Routes>
          </div>
          {/*<Footer/>*/}
        </TokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;
