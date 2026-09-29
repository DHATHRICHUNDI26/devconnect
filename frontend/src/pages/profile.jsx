import {useState,useEffect} from "react"
import {apiFetch} from "../utils/api"
import {useNavigate} from "react-router-dom"
import API_URL from "../utils/config"
function Profile(){
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    //const [updateLoading,setUpdateLoading]=useState(false)
    const [error,setError]=useState("")
    const [editingPostId,setEditingPostId]=useState(null)
    const [deletingPostId,setDeletingPostId]=useState(null)
    const [editData,setEditData]=useState({
        name:"",
        description:""
    })

   let user=null
    const navigate=useNavigate()
try{
    const storedUser=localStorage.getItem("user")

    if(storedUser){
        user=JSON.parse(storedUser)
    }
    }catch(error){
    console.error("Invalid user data",error)
    }

    useEffect(()=>{
        const getMyPosts=async()=>{
            try{
                const response=await apiFetch(`${API_URL}/api/v1/posts/my-posts`,{
                    method:"GET"
                })
                const data=await response.json()
                if(!response.ok){
                    setError(data.message||"Failed to fetch posts")
                    return
                }
                setPosts(data.posts)
            }catch(error){
                console.error(error)
                setError("Failed to connect to the server")
            }finally{
                setLoading(false)
            }
        }
        getMyPosts()
    },[])

    if(loading){
        return <h2>Loading profile...</h2>
    }

    if(error){
        return <h2>{error}</h2>
    }

    const deletePost=async(postId)=>{
        setError("")
        try{
            const response=await apiFetch(`${API_URL}/api/v1/posts/delete/${postId}`,{
                method:"DELETE"
            })
            const data=await response.json()
            if(!response.ok){
                setError(data.message||"Failed to delete post")
                return
            }
            setPosts((prevPosts)=>prevPosts.filter((post)=>post._id!==postId))
        }catch(error){
            console.error(error)
            setError("Failed to connect to the server")
        }
    }

    const updatePost=async()=>{
    if(!editData.name.trim()||!editData.description.trim()){
        setError("All fields are important")
        return
    }

    try{
        setError("")

        const response=await apiFetch(`${API_URL}/api/v1/posts/update/${editingPostId}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(editData)
        })

        const data=await response.json()

        if(!response.ok){
            setError(data.message||"Failed to update post")
            return
        }

        setPosts((prevPosts)=>
            prevPosts.map((post)=>
                post._id===editingPostId
                    ? {...post,...data.post}
                    : post
            )
        )

        setEditingPostId(null)

        setEditData({
            name:"",
            description:""
        })
    }catch(error){
        console.error(error)
        setError("Failed to connect to the server")
    }
}
return(
    <div className="profile-page"><button
    className="back-button"
    onClick={()=>navigate("/dashboard")}
>
    ← Back to Dashboard
    </button>

        <div className="profile-header">
            <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
                <h1>{user?.username}</h1>
                <p>{user?.email}</p>
            </div>
        </div>

        <div className="posts-heading">
            <h2>My Posts</h2>
            <span>{posts.length} posts</span>
        </div>

        <div className="my-posts">
            {posts.length===0?(
                <div className="empty-posts">
                    <h3>No posts yet</h3>
                    <p>You haven't created any posts yet.</p>
                </div>
            ):(
                posts.map((post)=>(
                    <div className="my-post" key={post._id}>
                        {deletingPostId===post._id?(
                            <div className="delete-confirm">
                                <h3>Delete this post?</h3>
                                <p>This action cannot be undone.</p>

                                <div className="post-actions">
                                    <button
                                        className="delete-confirm-btn"
                                        onClick={()=>deletePost(post._id)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className="cancel-btn"
                                        onClick={()=>setDeletingPostId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ):editingPostId===post._id?(
                            <div className="edit-post">
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e)=>setEditData({...editData,name:e.target.value})}
                                    placeholder="Post title"
                                />

                                <textarea
                                    value={editData.description}
                                    onChange={(e)=>setEditData({...editData,description:e.target.value})}
                                    placeholder="Post description"
                                />

                                <div className="post-actions">
                                    <button
                                        className="update-btn"
                                        onClick={updatePost}
                                    >
                                        Update
                                    </button>

                                    <button
                                        className="cancel-btn"
                                        onClick={()=>{
                                            setEditingPostId(null)
                                            setEditData({
                                                name:"",
                                                description:""
                                            })
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ):(
                            <>
                                <div className="post-content">
                                    <h3>{post.name}</h3>
                                    <p>{post.description}</p>
                                </div>

                                <div className="post-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={()=>{
                                            setEditingPostId(post._id)
                                            setEditData({
                                                name:post.name,
                                                description:post.description
                                            })
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={()=>setDeletingPostId(post._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
)
}

export default Profile