const apiUrl = import.meta.env.VITE_API_URL


export const createPost = async ({ title, description, postType, visibility, media = [] }) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('postType', postType)
  formData.append('visibility', visibility)

  media.forEach((file) => {
    formData.append('media', file)
  })

  const res = await fetch(`${apiUrl}/post/createPost`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to create post')
  }

  return data
}


export const getMyPosts = async (id) => {
  const res = await fetch(`${apiUrl}/post/my-posts/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to fetch posts"
    );
  }

  return data;
};


export const deletePost = async (id) => {
  const res = await fetch(
    `${apiUrl}/post/delete-post/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to delete post"
    );
  }

  return data;
};


// export const pinPost = async (id) => {
//   const res = await fetch(
//     `${apiUrl}/post/pin-post/${id}`,
//     {
//       method: "PATCH",
//       credentials: "include",
//     }
//   );

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(
//       data?.message || "Failed to pin post"
//     );
//   }

//   return data;
// };

export const likePost = async(id)=>{
  try{
    const res = await fetch(`${apiUrl}/post/${id}/like`,{
      method:'POST',
      credentials:'include'
    })
    res = await res.json()
    return res;

  }
  catch(error){
    console.log(error.message);
    
  }
}