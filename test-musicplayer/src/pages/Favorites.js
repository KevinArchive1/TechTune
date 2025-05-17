import React from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = ({ favorites, onPlay }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/playlists')}
        className="mb-6 px-4 py-2 bg-roseRed text-white rounded hover:bg-pink-500"
      >
        ← Back to Playlists
      </button>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <span className="text-pink-600 text-8xl mb-6">❤️</span>
          <h2 className="text-xl font-bold text-center">
            Your Favorite Songs will be shown here!!!
          </h2>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
          <ul className=''>
            {favorites.map((track, index) => (
              <li key={track.videoId} className="mb-4 flex items-center  justify-between space-x-4">
                <div className='flex gap-2'>
                  <img src={track.cover} alt={track.title} className="w-12 h-12 rounded" />
                  <div>
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-sm text-gray-600">{track.artist}</div>
                  </div>
                </div>
                <button
                  onClick={() => onPlay(favorites, index)}
                  className="flex items-center ml-auto pl-2 pr-3 py-1 bg-roseRed text-white rounded hover:bg-pink-500"
                >
                  <img className='w-5 h-5' src='/play.png' alt='PLAY'/> Play
                </button>
              </li>

            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Favorites;
