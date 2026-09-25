import {useState,useEffect} from "react"
import {apiFetch} from "../utils/api"

function Profile(){
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [editingPostId,setEditingPostId]=useState(null)
    const [editData,setEditData]=useState({
        name:"",
        description:""
    })

   let user=null

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
                const response=await apiFetch("http://localhost:4000/api/v1/posts/my-posts",{
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
            const response=await apiFetch(`http://localhost:4000/api/v1/posts/delete/${postId}`,{
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
        setError("")
        try{
            const response=await apiFetch(`http://localhost:4000/api/v1/posts/update/${editingPostId}`,{
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
        <div className="profile">
            <h1>My Profile</h1>
            <div className="profile-info">
                <h2>{user?.username}</h2>
                <p>{user?.email}</p>
            </div>
            <h2>My Posts</h2>
            {posts.length===0?(
                <p>You haven't created any posts yet.</p>
            ):(
                posts.map((post)=>(
                    <div className="my-post" key={post._id}>
                        {editingPostId===post._id?(
                            <>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e)=>setEditData({...editData,name:e.target.value})}
                                />
                                <textarea
                                    value={editData.description}
                                    onChange={(e)=>setEditData({...editData,description:e.target.value})}
                                />
                                <div className="post-actions">
                                    <button onClick={updatePost}>Update</button>
                                    <button
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
                            </>
                        ):(
                            <>
                                <h3>{post.name}</h3>
                                <p>{post.description}</p>
                                <div className="post-actions">
                                    <button
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
                                    <button onClick={()=>deletePost(post._id)}>
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}

export default Profile