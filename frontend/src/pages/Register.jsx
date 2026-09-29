import {useEffect,useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import API_URL from "../utils/config"

function Register(){
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [error,setError]=useState("")
    const [message,setMessage]=useState("")
    const [emailAvailable,setEmailAvailable]=useState(null)
    const [checkedEmail,setCheckedEmail]=useState("")

    const navigate=useNavigate()

    const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    useEffect(()=>{
        if(!email.trim()||!validEmail){
            return
        }

        const timer=setTimeout(async()=>{
            try{
                const response=await fetch(`${API_URL}/api/v1/users/check-email?email=${encodeURIComponent(email)}`)
                const data=await response.json()

                if(!response.ok){
                    setEmailAvailable(null)
                    setCheckedEmail("")
                    return
                }

                setEmailAvailable(data.available)
                setCheckedEmail(email)
            }catch(error){
                console.error(error)
                setEmailAvailable(null)
                setCheckedEmail("")
            }
        },500)

        return()=>clearTimeout(timer)
    },[email,validEmail])

    const emailChecking=
        email.trim()&&
        validEmail&&
        checkedEmail!==email

    const handleSubmit=async(e)=>{
        e.preventDefault()

        setError("")
        setMessage("")

        if(!username.trim()){
            setError("Username required")
            return
        }

        if(username.trim().length>30){
            setError("Username should be at most 30 characters")
            return
        }

        if(!email.trim()){
            setError("Email is required")
            return
        }

        if(!validEmail){
            setError("Please enter a valid email")
            return
        }

        if(emailChecking){
            setError("Please wait while email is being checked")
            return
        }

        if(emailAvailable===false&&checkedEmail===email){
            setError("Email is already registered")
            return
        }

        if(!password){
            setError("Password is required")
            return
        }

        if(password.length<6){
            setError("Password must be at least 6 characters")
            return
        }

        if(password!==confirmPassword){
            setError("Passwords do not match")
            return
        }

        try{
            const response=await fetch(`${API_URL}/api/v1/users/register`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    username,
                    email,
                    password
                })
            })

            const data=await response.json()

            if(!response.ok){
                setError(data.message||"Registration failed")
                return
            }

            setMessage("Registration successful")

            setTimeout(()=>{
                navigate("/login")
            },1000)
        }catch(error){
            console.error(error)
            setError("Unable to connect to server")
        }
    }

    return(
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Join DevConnect</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>{
                            setEmail(e.target.value)
                            setEmailAvailable(null)
                            setCheckedEmail("")
                        }}
                    />

                    {email.trim()&&!validEmail&&(
                        <p className="validation-error">
                            Please enter a valid email address
                        </p>
                    )}

                    {emailChecking&&(
                        <p className="validation-message">
                            Checking email...
                        </p>
                    )}

                    {!emailChecking&&
                        validEmail&&
                        emailAvailable===true&&
                        checkedEmail===email&&(
                        <p className="validation-success">
                            ✓ Email is available
                        </p>
                    )}

                    {!emailChecking&&
                        validEmail&&
                        emailAvailable===false&&
                        checkedEmail===email&&(
                        <p className="validation-error">
                            ✕ Email is already registered
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    {password.length>0&&password.length<6&&(
                        <p className="validation-error">
                            Password must be at least 6 characters
                        </p>
                    )}

                    {password.length>=6&&(
                        <p className="validation-success">
                            ✓ Password is valid
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />

                    {confirmPassword.length>0&&password!==confirmPassword&&(
                        <p className="validation-error">
                            Passwords do not match
                        </p>
                    )}

                    {confirmPassword.length>0&&password===confirmPassword&&(
                        <p className="validation-success">
                            ✓ Passwords match
                        </p>
                    )}

                    {error&&<p className="error">{error}</p>}
                    {message&&<p className="success">{message}</p>}

                    <button
                        type="submit"
                        disabled={emailChecking||emailAvailable===false}
                    >
                        Register
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register