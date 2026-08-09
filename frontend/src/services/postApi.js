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