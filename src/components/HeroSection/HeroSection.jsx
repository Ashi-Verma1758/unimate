import "./HeroSection.css";
import { Link } from 'react-router-dom';
import photo from '../../assets/photo.jpg';
import { useRef } from "react";
import Navbar from "../HomePage/Navbar.jsx"
import {
  Users ,  
  CalendarCheck,   
  MessageCircle,   
  Search,           
  BadgeCheck,    
  Zap } from 'lucide-react';

const HeroSection = () =>{
  const cardsRef = useRef(null);
  const scrollToCards = ()=>{
    cardsRef.current.scrollIntoView({behavior: 'smooth'});
  }
    return(
    <> 
    <Navbar/>
    <div className="full">
      <div className="box1">
        <h1>Connect. <span className = "create">Collaborate.</span> Create.</h1>
        <p>The ultimate platform for university students to find teammates, discover events, and<br/>
       build amazing projects together. Join thousands of students already collaborating on <br/>Unimate.</p>
       <br/>
       <br/>
       <div className="button"> 
        
       <Link to="/signup">
         <button>Get Started</button>
       </Link>
        <button onClick={scrollToCards}>Explore Platform</button>
       </div>
       <img src={photo}/> 
      </div> 
    </div>
    <div className="part2">
      <h2>Everything you need to succeed together</h2>
      <p>From finding the perfect teammate to managing your next big project, Unimate<br/> provides all the tools you need for successful collaboration.</p>
      <br/><br/>
      <div className="cards" ref={cardsRef}>
        <div className="card">
          <Users className="icons"/>
          <span className="head">Team Building</span>
          <p>Connect with like-minded students and form <br/>teams for projects, hackathons, and assignments.</p>
        </div>
        <div className="card">
          <CalendarCheck className="icons"/>
          <span className="head">Event Discovery</span>
          <p>Discover hackathons, competitions, and<br/> university events happening around you.</p>
        </div>
        <div className="card">
          <MessageCircle className="icons"/>
          <span className="head">Real-time Chat</span>
          <p>Communicate seamlessly with your team <br/>members through our integrated chat system.</p>
        </div>
        <div className="card">
          <Search className="icons"/>
          <span className="head">Smart Matching</span>
          <p>Find teammates based on skills, interests, and<br/> project requirements.</p>
        </div>
        <div className="card">
          <BadgeCheck className="icons"/>
          <span className="head">University Verified
</span>
          <p>Connect only with verified university students for<br/> secure collaboration.</p>
        </div>
        <div className="card">
          <Zap className="icons"/>
          <span className="head">Quick Setup</span>
          <p>Get started in minutes and begin collaborating<br/> with fellow students instantly.</p>
        </div>
      </div>
      <div className="part3">
        <span className="heaidng">Ready to start collaborating?</span><br/><br/>
        <span className="word">Join thousands of students who are already building amazing things together.</span><br/><br/><br/>
        <Link to="/signup">
           <button className="btnsd">Sign Up Now- It's free</button>
        </Link>


      </div>
    </div>
    </>
    );
};
export default HeroSection;