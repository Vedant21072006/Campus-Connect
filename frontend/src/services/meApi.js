
const apiUrl = import.meta.env.VITE_API_URL;

export const getme = async () => {
  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) return null;

    const user = await response.json();

    return user._id || null;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return null;
  }
};
