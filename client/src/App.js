import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home.jsx";

function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path ="/" element={<Home/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;