import React from 'react';
import "./styles.css";
import bgImage from "../assets/gradient.png";

function MarketPlace() {
    return (
        <div className="">
            <nav className="navbar navbar-container" style={{zIndex:1000}}>
                <ul style={{listStyleType:"none"}} >
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} > <a href="/" style={{textDecoration: "none",color:"white"}}  >Home</a></li>
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} >About</li>
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} >Resources</li>
                    <li className="navbar-link1" style={{float:"left",color:"white",fontSize:"16px",fontWeight:"400",textTransform:"uppercase",zIndex:"1000"}} >FAQ</li>
                </ul>
                </nav>
            <img src={bgImage} alt="" className="bgImage" style={{transform: "rotate(180deg)"}}/>
        </div>
    )
}

export default MarketPlace;