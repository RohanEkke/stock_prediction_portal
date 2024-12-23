import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../AuthProvider'

const LogIn = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState()
    const navigate = useNavigate()
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const userData = {username, password}
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData )
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            console.log('Login sussesful')
            setIsLoggedIn(true)
            navigate('/')
        }
        catch(error){
            console.log('Invalid Credentials')
            setErrors('Invalid Credentials, try again !')
        }
        finally{
            setLoading(false)
        }
    }
    return (
     <>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-md-6 bg-light-dark p-5 rounded' >
                <h3 className='text-light text-center mb-4'>Create an Account</h3>
                <form onSubmit={handleLogin}>

                  <div className='mb-3'>
                    <input type='text' className='form-control' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>

                  <div className='mb-3'>
                    <input type='password' className='form-control' placeholder='Set Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>

                  {errors && <div className='alert alert-danger'>{errors}</div>}

                  {loading ? (
                    <button type='Submit' className='btn btn-info d-block mx-auto' disabled ><FontAwesomeIcon icon={faSpinner} spin/>Logging In...</button>
                  ) : (
                    <button type='Submit' className='btn btn-info d-block mx-auto'>LogIn</button>
                  )}

                </form>
              </div>
            </div>
          </div>
        </>
  )
}

export default LogIn