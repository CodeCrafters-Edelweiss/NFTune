import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import {useStyles} from './styles.js'
import "../styles.css";
import logo from '../../assets/Logo.svg';

const Header = () => {
  // const classes = useStyles();
  const account = useSelector((state) => state.allNft.account);

  return (
    <nav className="navbar navbar-container" style={{zIndex:1000,position:"sticky"}}>
                <ul style={{listStyleType:"none"}} >
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} > <a href="/" style={{textDecoration: "none",color:"white"}}  >Home</a></li>
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} ><a href="/marketplace" style={{textDecoration: "none",color:"white"}}  >Marketplace</a></li>
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} >Resources</li>
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} >FAQ</li>
                </ul>
          <div >
            <AccountBalanceWalletIcon titleAccess="Wallet Address"  style={{color:"white",marginRight: "0.4rem"}}/>
            <h5 style={{color:"white"}}>{account.slice(0,7)}...{account.slice(-4)}</h5>
          </div>
                </nav>
  );
};

export default Header;
