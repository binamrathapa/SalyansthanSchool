export const fullImageUrl = (imagePath) => {
    if (!imagePath) {
      return "/placeholder.png"; // fallback image in /public
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    // Check if the imagePath is already a full URL or starts with http/https
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Prepend base URL only if it's a relative path from the API
    return `${baseUrl}${imagePath}`;
  }
