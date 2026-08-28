const apiUrl = import.meta.env.VITE_API_URL

const BASE = `${apiUrl}/friend`

async function handle(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Request failed')
  return data
}

export const getIncomingRequests = () =>
  fetch(`${BASE}/request/getIncomingRequests`, { credentials: 'include' }).then(handle)

export const getSentRequests = () =>
  fetch(`${BASE}/request/getSentRequests`, { credentials: 'include' }).then(handle)


export const acceptFriendRequest = (requesterId) =>
  fetch(`${BASE}/request/${requesterId}/accept`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requesterId }),
  }).then(handle)

export const rejectFriendRequest = (requestId) =>
  fetch(`${BASE}/request/${requestId}/reject`, {
    method: 'PATCH',
    credentials: 'include',
  }).then(handle)


export const blockUser = (userId) =>
  fetch(`${BASE}/block/${userId}`, {
    method: 'PATCH',
    credentials: 'include',
  }).then(handle)

  
export const sendRequest = async (recipientId) => {
  try {
    const response = await fetch(
      `${BASE}/request/${recipientId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to send friend request"
      );
    }

    return data;

  } catch (error) {
    console.error("Send friend request error:", error);
    throw error;
  }
};

export const getFriends = async (userId) => {
  const response = await fetch(
    `${BASE}/request/getFriends/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get friends"
    );
  }

  return data;
};

export const removeFriend = async (friendId) => {
  const response = await fetch(
    `${BASE}/request/remove-friend/${friendId}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to remove friend"
    );
  }

  return data;
};


export async function reportUser(userId, reason) {
  return request(`/report/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

// Poll/refetch the current relationship between the viewer and this profile.
// Expected response shape: { status: 'none' | 'pending' | 'friends' }
export async function getFriendshipStatus(userId) {
   const resp = await fetch(`${BASE}/request/getFriendsStatus/${userId}`,{
    credentials:'include'
   })
    resp = await resp.json()
    return resp;
}