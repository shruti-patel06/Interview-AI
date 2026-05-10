import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"
import React from 'react'

const Protected = ({children}) => {
    const {loading,user} = useAuth()
    // const navigate = useNavigate()

    if(loading){
        return(<main><h1>Loading...</h1></main>)
    }

    //if user not logged in, he cannot access the other pages, navigated to login page again.
    if(!user){
       
        return <Navigate to={'/login'}/>
       
    }

    return children // wrapper kind of
}

export default Protected