
const API_URL = import.meta.env.VITE_API_URL;

export const getPosts = async (cursor = null) => {
  const url = new URL(`${API_URL}/post/getpost`);

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};
