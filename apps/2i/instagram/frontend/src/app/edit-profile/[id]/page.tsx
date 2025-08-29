import { useEffect, useState } from "react";
import { EditProfile } from "../EditProfile"
import { useParams, useRouter } from "next/navigation";


function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.userId || null
  } catch (err) {
    console.error("Invalid token", err)
    return null
  }
}


const  EditProfilePage = () => {
     const router = useRouter()
    const params = useParams()
    const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const idFromToken = getUserIdFromToken()
    if (!idFromToken) {
      router.push("/login") 
      return
    }
    setUserId(idFromToken)
  }, [router])

    if (!userId) return <div>Loading...</div>

  
  return <EditProfile userId={userId}  />
}


export default EditProfilePage;