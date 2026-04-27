export const getPhotoUrl = (photoPath?: string | null) =>
  photoPath ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${photoPath}` : undefined;