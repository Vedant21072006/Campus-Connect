 const apiUrl = import.meta.env.VITE_API_URL
export  const getme=async()=>{
    try{
     let api = await fetch(`${apiUrl}/auth/me`,{
      credentials:'include'
     })
     api =await api.json()
     console.log(api._id);
     
     return api._id
    }
    catch(error){
      console.log(error)
    }
  }


