import React from 'react';

const SearchResults = ({ tracks, onTrackSelect }) => {
  return (
    <div className="p-4 overflow-auto">
      {tracks.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-4">
          {tracks.map((track, idx) => (
            <li
              key={idx}
              className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => onTrackSelect(track)}
            >
              {track.cover && (
                <img
                  src={track.cover}
                  alt={`${track.title} cover`}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
              )}
              <div>
                <p className="font-semibold">{track.title}</p>
                <p className="text-sm text-gray-300">{track.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
