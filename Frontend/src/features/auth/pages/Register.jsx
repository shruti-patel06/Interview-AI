import { useState } from 'react'
import { useNavigate,Link,Navigate } from 'react-router'
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth"
import { getErrorMessage } from "../../../lib/api.js"


const Register = () => {

    const navigate = useNavigate()

    //Two way Binding
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)


    const { user,loading,handleRegister } = useAuth()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await handleRegister({username,email,password})
            navigate("/")
        } catch (err) {
            setError(await getErrorMessage(err, "Registration failed. Please try again."))
        } finally {
            setSubmitting(false)
        }
    }

    if(loading){
        return(<main><h1>Loading...</h1></main>)
    }

    //Already logged in users don't need the register page
    if(user){
        return <Navigate to={'/'} replace/>
    }

    return(
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                         value={username}
                         onChange={(e)=>{setUsername(e.target.value)}}
                         type="text" id="username" name='username' placeholder='Enter username' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                         value={email}
                         onChange={(e)=>{setEmail(e.target.value)}}
                         type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                         value={password}
                         onChange={(e)=>{setPassword(e.target.value)}}
                         type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>

                    {error && <p className="form-error" role="alert">{error}</p>}

                    <button className='button primary-button' disabled={submitting}>
                        {submitting ? "Creating account..." : "Register"}
                    </button>
                </form>
                <p>Already have an account ? <Link to={"/login"}>Login</Link></p>
            </div>

        </main>
    )
}

export default Register
