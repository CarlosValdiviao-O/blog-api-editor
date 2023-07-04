import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./pages/Create";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter basename="/">
        <div id='blog'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </div>
        {/*<Footer/>*/}
    </BrowserRouter>
  );
}

export default App;
