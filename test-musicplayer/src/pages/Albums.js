import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Albums = ({ onTrackSelect, setSearchResults, addToPlaylist, playlists, favorites, addToFavorites }) => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);


  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  const albumQueries = [
    'wave to earth 0.1 flaws and all.',
    'Kendrick Lamar GNX',
    'SZA SOS',
    'Sabrina Carpenter Short n Sweet',
    'Tyler the Creator Chromakopia',
    'Taylor Swift Midnights',
    'TWICE STRATEGY',
    'brb. relationship sh*t'
  ];

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumData = await Promise.all(
          albumQueries.map(async (query) => {
            const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
              params: {
                part: 'snippet',
                q: `${query} album`,
                type: 'video',
                key: API_KEY,
                maxResults: 5,
              },
            });

            const songs = res.data.items.map((item) => ({
              title: item.snippet.title,
              artist: item.snippet.channelTitle,
              videoId: item.id.videoId,
              cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
            }));

            return {
              name: query,
              artist: songs[0]?.artist || 'Unknown Artist',
              cover: songs[0]?.cover || 'https://via.placeholder.com/150',
              songs,
            };
          })
        );

        setAlbums(albumData);
      } catch (err) {
        console.error('Failed to fetch albums:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleAlbumClick = (album) => setSelectedAlbum(album);

  const handleSongClick = (song, albumSongs) => {
    setSearchResults(albumSongs);
    onTrackSelect(song);
  };

  const handleAddToPlaylist = (song, playlistId) => {
    addToPlaylist(playlistId, song);
  };

  if (loading) return <div className="p-6 text-lg font-semibold">Loading albums...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-deepPurple">Albums</h2>
      {!selectedAlbum ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {albums.map((album) => (
            <div
              key={album.name}
              className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
              onClick={() => handleAlbumClick(album)}
            >
              <img
                src={album.cover}
                alt={album.name}
                className="w-full aspect-square object-cover rounded mb-4"
              />
              <div className="w-full">
                <p className="font-semibold truncate">{album.name}</p>
                <p className="text-sm text-gray-500 truncate">{album.artist}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Album Info */}
          <div className="md:w-1/3 bg-white rounded-lg shadow p-4">
            <img src={selectedAlbum.cover} alt={selectedAlbum.name} className="w-full h-auto rounded mb-4" />
            <h2 className="text-xl font-bold">{selectedAlbum.name}</h2>
            <p className="text-gray-600 mb-2">{selectedAlbum.artist}</p>
            <button
              className="mt-4 text-sm text-blue-600 underline"
              onClick={() => setSelectedAlbum(null)}
            >
              ← Back to albums
            </button>
          </div>

          {/* Songs List */}
          <div className="md:w-2/3">
            <h3 className="text-lg font-semibold mb-3">Songs</h3>
            <ul>
              {selectedAlbum.songs.map((song) => (
                <li
                  key={song.videoId}
                  className="flex justify-between items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div onClick={() => handleSongClick(song, selectedAlbum.songs)} className="flex items-center gap-4">
                    <img src={song.cover} alt={song.title} className="w-10 h-10 rounded" />
                    <div>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-sm text-gray-500">{song.artist}</p>
                    </div>
                  </div>

                  <select
                    className="p-1 border rounded"
                    onChange={(e) => handleAddToPlaylist(song, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Add to Playlist</option>
                    {playlists.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;
