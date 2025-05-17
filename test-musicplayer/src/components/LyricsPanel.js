import React from 'react';

const LyricsPanel = ({ lyrics, songInfo }) => {
  return (
    <div className="bg-gray-800 p-4 mt-4 rounded">
      {songInfo && (
        <div className="mb-2">
          <h2 className="text-xl font-bold">{songInfo.title}</h2>
          <p className="text-sm text-gray-400">By {songInfo.artist}</p>
        </div>
      )}
      <pre className="whitespace-pre-wrap">{lyrics}</pre>
    </div>
  );
};

export default LyricsPanel;
