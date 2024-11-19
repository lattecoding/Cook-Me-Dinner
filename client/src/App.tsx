import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import Navbar from './components/Navbar';

function App() {
  // States for YouTube functionality
  const [videos, setVideos] = useState<any[]>([]); // Store the videos
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null); // Store selected video ID

  // Function to handle search queries
  const handleSearch = async (query: string) => {
    const API_KEY = 'AIzaSyCspIUuocKpc10150WmsBMm9bLihaxVNYI'; // Replace with your actual API key
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            q: query, // Search query
            type: 'video',
            key: API_KEY,
            maxResults: 10, // Number of results to return
          },
        }
      );

      const videoData = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
      }));

      setVideos(videoData); // Update state with fetched videos
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Function to handle video selection
  const handleSelectVideo = (videoId: string) => {
    setSelectedVideoId(videoId); // Update selected video ID
  };

  return (
    <div className="container">
      <Navbar />
      <main>
        <h1>Cookify - Cooking Videos</h1>
        <SearchBar onSearch={handleSearch} /> {/* Search bar for YouTube videos */}
        
        {selectedVideoId ? (
          <VideoPlayer videoId={selectedVideoId} /> // Display the video player if a video is selected
        ) : (
          <VideoList videos={videos} onSelect={handleSelectVideo} /> // Show video list otherwise
        )}

        <Outlet /> {/* Existing routing functionality */}
      </main>
    </div>
  );
}

export default App;
