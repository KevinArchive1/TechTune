import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = ({ searchTrack, handleTrackSelect }) => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  const YT_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  const fetchContent = async () => {
    if (!YT_API_KEY) {
      console.error("YouTube API key is missing!");
      return;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=top music&type=video&key=${YT_API_KEY}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("YouTube API error:", res.status, text);
        return;
      }

      const data = await res.json();
      if (!data.items || !Array.isArray(data.items)) return;

      const items = data.items.map((item) => ({
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        cover: item.snippet.thumbnails.medium.url,
        videoId: item.id.videoId,
      }));

      setSongs(items);
      setArtists(items.slice(0, 5));
      setAlbums(items.slice(5, 10));
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleArtistClick = (artistName) => {
    navigate(`/artists/${encodeURIComponent(artistName)}`);
  };

  const handleAlbumClick = (albumTitle) => {
    navigate(`/albums/${encodeURIComponent(albumTitle)}`);
  };

  return (
    <div className="h-screen px-4 py-6  overflow-y-scroll">
      {/* Top Artist Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-deepPurple">Top Artist</h2>
          <div className="flex items-center space-x-2">
            <Link
              to="/artists"
              className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600"
              aria-label="Go to Artist page"
            >
              ➤
            </Link>
            <Link to="/artists" className="text-sm text-gray-600 hover:underline">
              See All
            </Link>
          </div>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-2">
          {artists.map((artist) => (
            <div
              key={artist.videoId}
              className="flex flex-col items-center cursor-pointer flex-shrink-0"
              onClick={() => handleArtistClick(artist.artist)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleArtistClick(artist.artist);
              }}
            >
              <img
                src={artist.cover}
                alt={artist.artist}
                className="w-20 h-20 object-cover rounded-full border-2 border-gray-300 hover:scale-105 transition"
              />
              <div className="text-sm mt-2 text-center truncate w-24">{artist.artist}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Albums Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-deepPurple">Top Albums</h2>
          <div className="flex items-center space-x-2">
          <Link
              to="/albums"
              className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600"
              aria-label="Go to Artist page"
            >
              ➤
            </Link>
            <Link to="/albums" className="text-sm text-gray-600 hover:underline">
              See All
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div
              key={album.videoId}
              className="cursor-pointer rounded overflow-hidden shadow hover:shadow-lg transition"
              onClick={() => handleAlbumClick(album.title)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAlbumClick(album.title);
              }}
            >
              <img src={album.cover} alt={album.title} className="w-full h-48 object-cover" />
              <div className="p-2">
                <div className="text-base font-semibold truncate">{album.title}</div>
                <div className="text-xs text-gray-600">{album.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-deepPurple mb-4">Trending</h2>
        <div className="space-y-4">
          {songs.slice(0, 3).map((track) => (
            <div
              key={track.videoId}
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition"
              onClick={() => handleTrackSelect(track)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleTrackSelect(track);
              }}
            >
              <div className="flex items-center space-x-4">
                <img src={track.cover} alt={track.title} className="w-14 h-14 object-cover rounded" />
                <div>
                  <div className="text-sm font-semibold">{track.title}</div>
                  <div className="text-xs text-gray-500">{track.artist}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">3:57</span>
                <button className="text-gray-400 hover:text-pink-500">♡</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
