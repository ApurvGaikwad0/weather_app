export const fetchWikipediaSummary = async (location: string) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Wikipedia summary');
  }

  const data = await response.json();
  console.log('Wikipedia API Response:', data); 
  return data; 
};