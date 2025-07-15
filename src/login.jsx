import { useState } from 'react'


import './login.css'

function Login() {

  return (
    <>
      <div class="logpage-box">
       
            <h1>Member Login</h1>
            <form onsubmit="">
        <div class="logpage-username">
           <label for="username"></label>
                <input type="text" id="username" name="username" placeholder="Username" required/>
                <i class='bx bxs-user'></i>
           
        </div>
        <div class="logpage-username">
            <label for="password"></label>
                <input type="password" id="password" name="password" placeholder="Password" required/>
                <i class='bx bxs-lock-alt'></i>
          
        </div>
        <div class="forget">
            <label for="forget">
               Forgot Password?</label>
                <a href="">Click here</a>
        </div>
        <button type="submit" class="logpage-button">Login</button>
        <div class="logpage-signup">
            <p>Don't have an account? <a href="#">SignUp</a> </p> 
        </div>
    </form>
    </div>
   
    </>
  )
}

export default Login
