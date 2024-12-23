import { useState } from 'react'
import './assets/css/style.css'
import Main from './components/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Header from './components/Header'
import Footer from './components/Footer'
import LogIn from './components/LogIn'
import AuthProvider from './AuthProvider'


function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<LogIn/>} />
        </Routes>
      <Footer/>
      </BrowserRouter>
    </AuthProvider>

    </>
  )
}

export default App
