import React, { useContext, useState } from 'react'
import {Link ,useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../Styles/auth.css';

const Login = () => {

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[error,setError] = useState('');
  const[isSubmitting,setIsSubmitting] = useState(false);
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/users/login' ,{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email , password})
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.token) {
        setError(data?.message || 'Email or password is incorrect.');
        return;
        }

      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      console.error(error);
      setError('Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    };


  return (
    <div className='auth-container'>
      <form onSubmit={submitHandler} className='auth-form'>
        <h2>Welcome back</h2>
        <p className='auth-subtitle'>Sign in to your Campus Cart account.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <input type="email" value={email} placeholder='Email Address' onChange={(e)=>setEmail(e.target.value)} required/>
        <input type="password" value={password} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required/>
        <button type='submit' className='btn' disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Login'}</button>
        <p>Don't have an account? <Link to={'/register'}>Register</Link></p>

      </form>
    </div>
  )
}

export default Login
