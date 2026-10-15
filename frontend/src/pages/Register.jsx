import React, { useContext, useState } from 'react'
import {Link ,useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext.jsx';
import '../Styles/auth.css';


const Register = () => {

  const[name,setName] = useState('');
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const{login} = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/users/register' ,{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username : name , email , password})
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || 'Registration failed. Please try again.');
        return;
        }

      alert('Registration successful! Check your email for the welcome OTP.');
      login(data);
      navigate('/');
    } catch (error) {
        console.error(error);
      };
    };

  return (
    <div className='auth-container'>
      <form onSubmit={submitHandler} className='auth-form'>
        <h2>Create your account</h2>
        <p className='auth-subtitle'>Join Campus Cart to start shopping.</p>
        <input type="text" placeholder='Full Name' value={name} onChange={(e)=>setName(e.target.value)} required/>
        <input type="email" placeholder='Email Address' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <input type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button type='submit' className='btn'>Register</button>
        <p>Already have an account? <Link to={'/login'}>Login</Link></p>

      </form>
    </div>
  )
}

export default Register
