import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home.jsx";
import MarketPlace from "./components/MarketPlace.jsx";

function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path ="/" element={<Home/>} />
          <Route path ="/marketplace" element={<MarketPlace/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;