import React, { useState } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

const Playlists = ({ playlists, setPlaylists, favorites = [] }) => {
  const navigate = useNavigate();
  const isAtRoot = useMatch('/playlists');

  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleClick = (playlist) => {
    if (playlist.isCreate) {
      setShowForm(true);
      return;
    }

    if (playlist.id === 'favorites') {
      navigate('/playlists/favorites');
      return;
    }

    navigate(`/playlists/${playlist.id}`);
  };

  const handleCreate = () => {
    if (!newPlaylistName.trim()) return;

    const newId = Date.now().toString();
    const newPlaylist = {
      id: newId,
      name: newPlaylistName.trim(),
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setShowForm(false);
    navigate(`/playlists/${newId}`);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this playlist?');
    if (confirmed) {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (isAtRoot) {
    const updatedPlaylists = playlists.map((pl) =>
      pl.id === 'favorites' ? { ...pl, songs: favorites } : pl
    );

    return (
      <div className="p-4 overflow-y-scroll">
        <h2 className="text-3xl font-bold mb-6 text-deepPurple">Playlists</h2>

        <div className="grid grid-cols-5 gap-8">
          {/* Create Playlist */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setShowForm(true)}
              className="cursor-pointer flex items-center justify-center bg-black text-white text-6xl font-bold rounded-lg w-full aspect-square hover:brightness-110 transition"
            >
              <img className='w-10 h-10' src='/Vector.png' alt='ADD'/>
            </div>
            <span className="mt-2 text-center font-medium text-gray-800">Create Playlist</span>
          </div>

          {/* Playlist Cards */}
          {updatedPlaylists.map((pl) => (
            <div key={pl.id} className="flex flex-col items-center relative">
              <div
                onClick={() => handleClick(pl)}
                className={`cursor-pointer flex items-center justify-center rounded-lg w-full aspect-square
                  ${pl.id === 'favorites' ? 'bg-pink-100' : 'bg-roseRed'}
                  hover:brightness-110 transition`}
              >
                {pl.id === 'favorites' ? (
                  <span className="text-6xl text-pink-600">❤️</span>
                ) : null}
              </div>

              {/* Delete button (not for favorites) */}
              {pl.id !== 'favorites' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pl.id);
                  }}
                  className="absolute top-2 right-2 text-white bg-roseRed rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  title="Delete Playlist"
                >
                  ✕
                </button>
              )}

              {/* Caption under card */}
              <div className="mt-2 text-center">
                <span className="font-medium text-gray-800">{pl.name}</span>
                <br />
                <small className="text-sm text-gray-500">{pl.songs.length} Songs</small>
              </div>
            </div>
          ))}
        </div>

        {/* Create Playlist Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex items-center bg-white p-6 rounded-lg shadow-lg w-96">
              <div className='bg-white mr-3'>
                <img className='w-25 h-25' src='/addToPlayList.png' alt='ADD SONGS'/>
              </div>
              <div className='bg-white'>
                <h3 className="text-xl font-semibold mb-4">Create Playlist</h3>
                <input
                  type="text"
                  placeholder="Playlist Name"
                  className="w-full p-2 border rounded mb-4"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-roseRed text-white rounded hover:bg-pink-600"
                  >
                    Create
                  </button>  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <Outlet />;
};

export default Playlists;
