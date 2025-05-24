export const fetchYouTubeVideos = async (location: string) => {
  const apiKey = 'AIzaSyBE2IOqEkiTpgM57seESpa9YWG3s08-0EE'; 
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    location
  )}&type=video&maxResults=5&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube videos');
  }

  const data = await response.json();
  return data.items; // Returns an array of video results
};