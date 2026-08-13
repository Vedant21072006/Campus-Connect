const apiUrl = import.meta.env.VITE_API_URL

export const updateProfilePicture = async (file) => {
  const formData = new FormData()

  formData.append('profilePicture', file)

  const res = await fetch(
    `${apiUrl}/profile/profile-picture`,
    {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    }
  )

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(
      data?.message || 'Failed to update profile picture'
    )
  }

  return data
}


export const updateCoverPicture = async (file) => {
  const formData = new FormData()

  formData.append('coverPicture', file)

  const res = await fetch(
    `${apiUrl}/profile/cover-picture`,
    {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    }
  )

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(
      data?.message || 'Failed to update cover picture'
    )
  }

  return data
}