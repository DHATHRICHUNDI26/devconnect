import {useMemo,useState} from "react"
import {apiFetch} from "../utils/api.js"

function PostCard({post}){
    const [liked,setLiked]=useState(()=>{
        const user=JSON.parse(localStorage.getItem("user"))
        return post.likes?.some((id)=>id.toString()===user?.id?.toString())||false
    })

    const [comments,setComments]=useState([])
    const [commentText,setCommentText]=useState("")
    const [commentLoading,setCommentLoading]=useState(false)
    const [likesCount,setLikesCount]=useState(post.likes?.length||0)
    const [loading,setLoading]=useState(false)
    const [showComments,setShowComments]=useState(false)

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

    const toggleComments=async()=>{
        if(showComments){
            setShowComments(false)
            return
        }

        try{
            const response=await apiFetch(`http://localhost:4000/api/v1/posts/${post._id}/comments`,{
                method:"GET"
            })

            const data=await response.json()

            if(!response.ok){
                console.error(data.message)
                return
            }

            setComments(data.comments)
            setShowComments(true)
        }catch(error){
            console.error(error)
        }
    }

    const addComment=async()=>{
        if(!commentText.trim()||commentLoading) return

        try{
            setCommentLoading(true)

            const response=await apiFetch(`http://localhost:4000/api/v1/posts/${post._id}/comments`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    content:commentText
                })
            })

            const data=await response.json()

            if(!response.ok){
                console.error(data.message)
                return
            }

            setComments((prevComments)=>[
                ...prevComments,
                data.comment
            ])

            setCommentText("")
        }catch(error){
            console.error(error)
        }finally{
            setCommentLoading(false)
        }
    }

    return(
        <div className="post-card">
            <h4>{post.user?.username||"Unknown user"}</h4>
            <h3>{post.name}</h3>
            <p>{post.description}</p>
            <span>{timeAgo}</span>

            <div className="post-actions">
                <button onClick={toggleLike} disabled={loading}>
                    {liked?"❤️ Liked":"🤍 Like"}
                </button>
                <span>{likesCount}</span>
            </div>

            <div className="comments-toggle">
                <button onClick={toggleComments}>
                    {showComments
                        ? "Hide comments"
                        : comments.length>0
                            ? `View all ${comments.length} comments`
                            : "View comments"
                    }
                </button>

                {showComments && (
                    <div className="comments-section">
                        <div className="comments-list">
                            {comments.length===0 ? (
                                <p className="no-comments">
                                    No comments yet. Be the first to comment.
                                </p>
                            ) : (
                                comments.map((comment)=>(
                                    <div className="comment" key={comment._id}>
                                        <strong>
                                            {comment.user?.username||"Unknown user"}
                                        </strong>
                                        <p>{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="comment-form">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e)=>setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                            />

                            <button
                                onClick={addComment}
                                disabled={commentLoading}
                            >
                                {commentLoading?"Posting...":"Post"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCard