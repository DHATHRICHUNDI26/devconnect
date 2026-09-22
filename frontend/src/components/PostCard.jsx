import {useMemo,useState} from "react"
import {apiFetch} from "../utils/api.js"
function PostCard({post}){
    const [liked,setLiked]=useState(()=>{
        const user=JSON.parse(localStorage.getItem("user"))
        return post.likes?.some((id)=>id.toString()===user?.id?.toString())||false
    })
    const [likesCount,setLikesCount]=useState(post.likes?.length||0)
    const [loading,setLoading]=useState(false)
    const timeAgo=useMemo(()=>{
        const seconds=Math.floor((Date.now()-new Date(post.createdAt).getTime())/1000)

        if(seconds<60){
            return "just now"
        }

        const minutes=Math.floor(seconds/60)

        if(minutes<60){
            return `${minutes} ${minutes===1?"minute":"minutes"} ago`
        }

        const hours=Math.floor(minutes/60)

        if(hours<24){
            return `${hours} ${hours===1?"hour":"hours"} ago`
        }

        const days=Math.floor(hours/24)

        if(days<7){
            return `${days} ${days===1?"day":"days"} ago`
        }

        const weeks=Math.floor(days/7)

        if(weeks<4){
            return `${weeks} ${weeks===1?"week":"weeks"} ago`
        }

        return new Date(post.createdAt).toLocaleDateString()
    },[post.createdAt])
    const toggleLike=async()=>{
        if(loading) return

        try{
            setLoading(true)

            const response=await apiFetch(`http://localhost:4000/api/v1/posts/${post._id}/like`,{
                method:"POST"
            })

            const data=await response.json()

            if(!response.ok){
                console.error(data.message)
                return
            }

            setLiked(data.liked)
            setLikesCount(data.likesCount)
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }

    }

    return(
        <div className="post-card">
            <h4>{post.user?.username||"Unknown user"}</h4>
            <h3>{post.name}</h3>
            <p>{post.description}</p>
            <span>{timeAgo}</span>
             <div>
                <button onClick={toggleLike} disabled={loading}>
                    {liked?"❤️ Liked":"🤍 Like"}
                </button>
                <span>{likesCount}</span>
                </div>
        </div>
    )
}

export default PostCard