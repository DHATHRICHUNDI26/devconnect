import {useMemo} from "react"

function PostCard({post}){
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

    return(
        <div className="post-card">
            <h4>{post.user?.username||"Unknown user"}</h4>
            <h3>{post.name}</h3>
            <p>{post.description}</p>
            <span>{timeAgo}</span>
        </div>
    )
}

export default PostCard