import React from 'react';

const GoogleMap = ({ location }: { location: string }) => {
  const apiKey = 'AIzaSyCVzkp0u7ZHV5yRIxVJGxHMVzxQl2iXnbM'; 
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    location
  )}`;

  return (
    <iframe
      width="600"
      height="450"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={mapUrl}
    ></iframe>
  );
};

export default GoogleMap;