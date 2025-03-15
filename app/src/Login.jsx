import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const username = useRef()
    const password = useRef()
    const navigate = useNavigate()
    let login = () => {
        
         username.current.value === 'admin' && password.current.value === 'harish' ? navigate('/app') : alert('Invalid Credentials')
    }

  return (
    <div>
        <h1>Login</h1>
        Name: <input type="text" placeholder='Enter your name' ref={username}/><br />
        Password: <input type="password" placeholder='Enter your password' ref={password}/><br />
        <button onClick={login}>Login</button>
    </div>
  )
}

export default Login