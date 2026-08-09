const API_URL = import.meta.env.VITE_API_URL;

export const getPosts = async () => {
  const response = await fetch(
    `${API_URL}/post/getpost`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};