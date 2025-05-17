import React from 'react';
import TopArtists from '../components/TopArtists';

const Artists = ({ onArtistClick }) => {
  return (
    <div className='overflow-y-scroll'>
      <TopArtists onArtistClick={onArtistClick} />
    </div>
  );
};

export default Artists;
