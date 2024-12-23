import React from 'react'
import Button from './Button'
import { useContext } from 'react'
import { AuthContext } from '../AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    console.log('logged out')
    navigate('/login')
  }
  return (
    <>
        <nav className='navbar container pt-3 pb-3 align-items-start'>
            <Link className='navbar-brand text-light' to="/">Stock Prediction Portal</Link>

            <div>
              {isLoggedIn ? (
                <button className='text-light btn btn-danger' onClick={handleLogOut}>Logout</button>
              ) : (
                <>
                <Button text="Login" class="btn-outline-info" url='/login' />
                &nbsp;
                <Button text="Register" class="btn-info" url='/register'/>
                </>
              )}

            </div>
        </nav>
    </>
  )
}

export default Header