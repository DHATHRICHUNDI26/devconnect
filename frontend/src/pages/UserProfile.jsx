import {useEffect,useState} from "react"
import {useNavigate,useParams} from "react-router-dom"
import {apiFetch} from "../utils/api.js"

function UserProfile(){
    const {userId}=useParams()
    const navigate=useNavigate()

    const [user,setUser]=useState(null)
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")

    useEffect(()=>{
        const getUserProfile=async()=>{
            try{
                const response=await apiFetch(`http://localhost:4000/api/v1/users/${userId}`,{
                    method:"GET"
                })

                const data=await response.json()

                if(!response.ok){
                    setError(data.message||"Failed to fetch user profile")
                    return
                }

                setUser(data.user)
                setPosts(data.posts)
            }catch(error){
                console.error(error)
                setError("Failed to connect to the server")
            }finally{
                setLoading(false)
            }
        }

        getUserProfile()
    },[userId])

    if(loading){
        return <div className="user-profile-page"><h2>Loading profile...</h2></div>
    }

    if(error){
        return <div className="user-profile-page"><h2>{error}</h2></div>
    }

    return(
    <div className="user-profile-page">
        <button
            className="back-button"
            onClick={()=>navigate("/dashboard")}
        >
            ← Back
        </button>

        <div className="user-profile-card">
            <div className="user-profile-info">
                <div className="user-profile-avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h1>{user?.username}</h1>
                    <p>DevConnect member</p>
                </div>
            </div>
        </div>

        <div className="user-posts-section">
            <h2>{user?.username}'s Posts</h2>

            {posts.length===0?(
                <div className="no-user-posts">
                    <p>{user?.username} hasn't posted anything yet.</p>
                </div>
            ):(
                <div className="user-posts-list">
                    {posts.map((post)=>(
                        <div className="user-post-card" key={post._id}>
                            <h3>{post.name}</h3>
                            <p>{post.description}</p>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
)
}

export default UserProfile