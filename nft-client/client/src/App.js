import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header/index";
import Main from "./pages/Home/index";
import CreateNFT from "./pages/CreateNFT/index";
import Item from "./pages/Item/index";
import Home from "./components/Home";

// import "./App.css";


function App() {
  return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/marketplace" component={Main} />
          <Route path="/create-nft" component={CreateNFT} />
          <Route path="/nft/:nftId" component={Item} />
          <Route>404 Not Found!</Route>
        </Switch>
      </Router>
  );
}

export default App;
