import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"

function Register(){
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [error,setError]=useState("")
    const [message,setMessage]=useState("")
    const navigate=useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError("")
        setMessage("")
        if(!username.trim()){
            setError("username required")
            return
        }
        if(username.trim().length>30){
            setError("username should be atmost 30")
            return
        }
        if(!email.trim()){
            setError("Email is required")
            return
        }
         if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError("Please enter a valid email")
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
            const response=await fetch("http://localhost:4000/api/v1/users/register",{
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
            setError("Unable to connect to server",error)
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
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />

                    {error&&<p className="error">{error}</p>}
                    {message&&<p className="success">{message}</p>}

                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register