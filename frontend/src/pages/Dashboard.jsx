import {useState,useEffect} from "react"
import PostCard from "../components/PostCard"
import {useNavigate} from "react-router-dom"
import {apiFetch} from "../utils/api.js"
function Dashboard(){
    const navigate=useNavigate()
    const [posts,setPosts]=useState([])
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(true)
    const [name,setName]=useState("")
    const [description,setDescription]=useState("")
    const [showForm,setShowForm]=useState(false)

    useEffect(()=>{
        const getPosts=async()=>{
            try{
                const response=await apiFetch("http://localhost:4000/api/v1/posts/getPosts",{
                    method:"GET",
                })
                const data=await response.json()
                if(!response.ok){
                    setError(data.message||"Failed to fetch posts")
                    return
                }
                setPosts(data.posts)
            }catch(error){
                setError("Failed to connect to the server")
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        getPosts()
    },[])

    if(loading){
        return <h2>Loading posts...</h2>
    }

    if(error){
        return <h2>{error}</h2>
    }
    const createPost=async()=>{
    try{
        const response=await apiFetch("http://localhost:4000/api/v1/posts/create",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                description
            })
        })
        const data=await response.json()
        if(!response.ok){
            setError(data.message||"Failed to create post")
            return
        }
        setPosts((prevPosts)=>[...prevPosts,data.post])
        setName("")
        setDescription("")
        setShowForm(false)
    }catch(error){
        console.error(error)
        setError("Failed to connect to the server")
    }
}
const logout=async()=>{
    try{
        const refreshToken=localStorage.getItem("refreshToken")

        if(refreshToken){
            await apiFetch("http://localhost:4000/api/v1/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    refreshToken
                })
            })
        }

        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        navigate("/login")
    }catch(error){
        console.error(error)
    }
}
    return(
    <div className="dashboard">
        <h1>DevConnect</h1>
        <div className="dashboard-header">
    <h1>DevConnect</h1>
    <button onClick={()=>navigate("/profile")}>
        Profile
    </button>
    <button onClick={logout}>Logout</button>
    </div>
        <div className="create-post-section">
            {!showForm&&(
                <button
                    className="create-post-button"
                    onClick={()=>setShowForm(true)}
                >
                    + Create Post
                </button>
            )}

            {showForm&&(
                <div className="create-post-form">
                    <h2>Create Post</h2>

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />

                    <textarea
                        placeholder="What's on your mind?"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                    />
                    <div className="form-buttons">
                        <button
                            className="cancel-button"
                            onClick={()=>{
                                setShowForm(false)
                                setName("")
                                setDescription("")
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="post-button"
                            onClick={createPost}
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>

        <div className="posts-container">
            {posts.length===0?(
                <p>No posts available</p>
            ):(
                posts.map((post)=>(
                    <PostCard
                        key={post._id}
                        post={post}
                    />
                ))
            )}
        </div>
    </div>
)
}

export default Dashboard