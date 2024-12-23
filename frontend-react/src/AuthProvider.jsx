import React, { createContext, useContext, useState } from 'react'

// Create the context
const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('accessToken') //True or False
    )
  return (
    <>
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>  {/* context provider */}
        {children}    {/* children means app components */}
    </AuthContext.Provider>
    </>
  )
}

export default AuthProvider
export {AuthContext}