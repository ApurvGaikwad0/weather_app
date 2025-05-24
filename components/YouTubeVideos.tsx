import React from 'react';

const YouTubeVideos = ({ videos }: { videos: any[] }) => {
  return (
    <>
      {videos.map((video) => (
        <div
          key={video.id.videoId}
          className="bg-white shadow-md rounded-md overflow-hidden border"
        >
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full"
          ></iframe>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{video.snippet.title}</h3>
            <p className="text-sm text-gray-600">{video.snippet.description}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default YouTubeVideos;