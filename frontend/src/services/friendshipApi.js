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

// NEW — was missing entirely. FriendshipControls calls this when you
// cancel a request YOU sent (rejectFriendRequest only works for the
// recipient of a request, per the backend's rejectRequest controller,
// which filters on `recipient: req.user._id`).
// Needs a matching backend route+controller, e.g.:
//   router.patch('/request/:recipientId/cancel', protect, cancelRequest)
// where cancelRequest deletes the Friendship doc matching
// { requester: req.user._id, recipient: recipientId, status: 'pending' }.
export const cancelFriendRequest = (recipientId) =>
  fetch(`${BASE}/request/${recipientId}/cancel`, {
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


// FIX: was calling an undefined `request()` function — threw
// ReferenceError on every call. Rewritten with `handle()` like
// everything else in this file.
export async function reportUser(userId, reason) {
  return fetch(`${BASE}/report/${userId}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  }).then(handle)
}

// FIX: previously did `const resp = ...` then reassigned `resp`,
// which throws "Assignment to constant variable" on every call —
// this was the actual reason friendship status never updated in
// the UI. Also added error handling (previously none) and status
// normalization, since the backend returns
// { status: 'none'|'accepted'|'pending'|'blocked'|'self', direction?, requestId? }
// but FriendshipControls expects
// { status: 'none'|'friends'|'pending_sent'|'pending_received'|'blocked'|'self', requestId? }
export async function getFriendshipStatus(userId) {
  const data = await fetch(`${BASE}/request/getFriendsStatus/${userId}`, {
    credentials: 'include',
  }).then(handle)

  if (data.status === 'accepted') return { status: 'friends' }

  if (data.status === 'pending') {
    return {
      status: data.direction === 'sent' ? 'pending_sent' : 'pending_received',
      requestId: data.requestId,
    }
  }

  return { status: data.status } // 'none' | 'blocked' | 'self'
}

// Aliases so this lines up with what FriendshipControls.jsx imports,
// without renaming the functions above (in case other files already
// import acceptFriendRequest / rejectFriendRequest by their original names).
export const acceptRequest = acceptFriendRequest
export const rejectRequest = rejectFriendRequest
export const cancelRequest = cancelFriendRequest