import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getme } from "../services/auth.api.js";

export const useAuth=()=>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setloading} = context

    const handleLogin = async ({ email,password })=>{
        setloading(true);

        try{
            const data = await login({email,password})

            //user comes from the response returned in the auth.controllers from Bck
            setUser(data.user)
            
        }catch(err){

        }finally{
            setloading(false)
        }
    }


    const handleRegister = async({ username,eamil,password })=>{

        setloading(true);
        try{
            const data = await register({ username,email,password });

            setUser(data.user)
        }catch(err){

        }finally{
            
            setloading(false)
        }

    }


    const handleLogout = async () =>{

        setloading(true);
        try{
            const data = await logout()
            
            setUser(null)//Frontend se user ka data null hojayega
        }
        catch(err){

        }finally{
            setloading(false)

        }
    }

    
    //After home page refresh it prevents rolling back to login page 
    useEffect(()=>{

        const getAndSetUser = async()=>{

            // Jab tak token rahega, tab tak backend se user ka current data maang sakte hai
            const data = await getme()
            setUser(data.user)
            setloading(false)
        }
        getAndSetUser()
    },[])

    
    return {user,loading,handleRegister,handleLogin,handleLogout}
}