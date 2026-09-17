import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
function Login(){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")
    const navigate=useNavigate()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError("")
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
        try {
            const response=await fetch("http://localhost:4000/api/v1/users/login",{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })
            })
            const data=await response.json()
            if(!response.ok){
                setError(data.message||"Login failed")
                return
            }
            localStorage.setItem("accessToken",data.accessToken)
            localStorage.setItem("refreshToken",data.refreshToken)
            localStorage.setItem("user",JSON.stringify(data.user))
            navigate("/dashboard")
        } catch (error) {
             setError("Unable to connect to server",error)
        }
    }
    return(
        <div className="auth-page">
            <div className="auth-card">
                <h1>DevConnect</h1>
                <p>Welcome back</p>
                <form onSubmit={handleSubmit}>
                    <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    {error&&<p className="error">{error}</p>}
                    <button type="submit">submit</button>
                </form>
                <p>
                    Don't have a account?<Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )

}
export default Login;