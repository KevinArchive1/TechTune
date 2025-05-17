import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const YTSearch = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const YT_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  const searchYouTube = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YT_API_KEY}`
      );
      const data = await res.json();

      if (Array.isArray(data.items)) {
        setResults(data.items);
      } else {
        console.error('Unexpected response:', data);
        setResults([]); // Fallback to an empty list if items is undefined
      }
    } catch (error) {
      console.error('YouTube search failed:', error);
      setResults([]); // Fallback to empty array on error
    }
  };

  const handleAdd = (video) => {
    const song = {
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      cover: video.snippet.thumbnails.default.url,
      videoId: video.id.videoId,
    };
    onAdd(song);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Search</h3>
      <input
        type="text"
        placeholder="Search song or artist"
        className="border p-2 w-full mb-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={searchYouTube}
        className="mb-4 px-4 py-2 bg-roseRed text-white rounded hover:bg-pink-600"
      >
        Search
      </button>

      <ul className="space-y-2">
        {Array.isArray(results) && results.map((video) => (
          <li key={video.id.videoId} className="flex gap-2 items-center">
            <img src={video.snippet.thumbnails.default.url} alt="" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{video.snippet.title}</p>
              <p className="text-xs text-gray-500">{video.snippet.channelTitle}</p>
            </div>
            <button
              onClick={() => handleAdd(video)}
              className="flex items-center px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <img className='w-5 h-5 mr-2' src="/plus.png" alt="ADD SONG" /> Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PlaylistDetail = ({ playlists, setPlaylists, setCurrentTrack, setVideoId }) => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const playlist = playlists.find(p => p.id === playlistId);
  const [showForm, setShowForm] = useState(false);

  if (!playlist) {
    return <div className="p-6">Playlist not found</div>;
  }

  const handlePlay = (song) => {
    setCurrentTrack(song);
    setVideoId(song.videoId);
  };

  const handleAddFromSearch = (song) => {
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    );
    setPlaylists(updatedPlaylists);
    setShowForm(false);
  };

  return (
    <div className="p-6 overflow-y-scroll">
      <button
        className="mb-4 px-4 py-2 bg-roseRed text-white rounded hover:bg-pink-500"
        onClick={() => navigate('/playlists')}
      >
        ← Back to Playlists
      </button>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{playlist.name}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-roseRed text-white rounded hover:bg-pink-600"
        >
          <img className='w-5 h-5 mr-2' src="/plus.png" alt="ADD SONG" /> Add Song
        </button>
      </div>

      {playlist.songs.length === 0 ? (
        <p className="text-gray-600">No songs in this playlist yet.</p>
      ) : (
        <ul className="space-y-2">
          {playlist.songs.map((song, index) => (
            <li key={index} className="p-4 bg-white shadow rounded">
              <div className="flex items-center gap-4">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
                <button
                  onClick={() => handlePlay(song)}
                  className="pr-3 pl-2 flex items-center py-1 bg-roseRed text-white rounded hover:bg-pink-600"
                >
                  <img className='w-5 h-5' src="/play.png" alt="PLAY" /> Play
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Song Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[500px]">
            <YTSearch onAdd={handleAddFromSearch} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
