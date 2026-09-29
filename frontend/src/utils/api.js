import API_URL from "./config.js"
const refreshAccessToken=async()=>{
    const refreshToken=localStorage.getItem("refreshToken")

    if(!refreshToken){
        return null
    }

    const response=await fetch(`${API_URL}/api/v1/users/refresh`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            refreshToken
        })
    })

    const data=await response.json()

    if(!response.ok){
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        return null
    }

    localStorage.setItem("accessToken",data.accessToken)

    return data.accessToken
}

const apiFetch=async(url,options={})=>{
    let accessToken=localStorage.getItem("accessToken")

    let response=await fetch(url,{
        ...options,
        headers:{
            ...options.headers,
            Authorization:`Bearer ${accessToken}`
        }
    })

    if(response.status===401){
        accessToken=await refreshAccessToken()

        if(!accessToken){
            return response
        }

        response=await fetch(url,{
            ...options,
            headers:{
                ...options.headers,
                Authorization:`Bearer ${accessToken}`
            }
        })
    }

    return response
}

export {apiFetch}