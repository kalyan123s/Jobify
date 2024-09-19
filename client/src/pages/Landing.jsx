import React from 'react';
import Wrapper from '../assets/wrappers/LandingPage.js';
import main from "../assets/images/main.svg";
import { Link } from 'react-router-dom';
import { Logo } from '../components/index.js';

const Landing = () => {

  return(
     <Wrapper>
      <nav>
        <Logo/>
      </nav>
      <div className="container page">
        <div className="info">
          <h1> Job <span>tracking</span> app</h1>
          <p>
              I'm baby four loko cornhole keffiyeh snackwave chambray. 
              Put a bird on it irony locavore keytar meditation knausgaard, 
              sustainable authentic distillery. Viral taxidermy snackwave bitters kinfolk,
              hoodie vibecession kogi enamel pin tbh. 3 wolf moon bushwick cronut jawn.
          </p>
          <Link to="/register"className='btn register-link'>Register</Link>
          <Link to="/login"className='btn'>Login/Demo User</Link>
        </div>
        <img src={main} alt="job hunt" className='img main-img'/>
      </div>
    </Wrapper> 
  )
};


// div is styled as Wrapper so div is changed to Wrapper in main code(in Landing function);
// const Wrapper=styled.div`
//   background:red;
//   h1{
//     color:white;
//   }
//   .content{
//     background:blue;
//     color:red;
//   }
// `;
export default Landing
