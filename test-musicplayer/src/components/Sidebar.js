import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `gap-3 flex items-center block px-5 py-2 rounded hover:bg-gray-700 text-[1.5rem] ${isActive ? 'border-l border-l-white border-l-[4px] rounded-none' : ''}`;

  return (
    <aside className="w-64 text-white p-4 bg-roseRed">
      <h2 className="text-xl font-bold mb-4 flex items-center text-[1.5rem]"><img src='/logo.png' alt='LOGO'/> Tech Tune</h2>
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass} end>
          <img src='/home.png' alt='HOME'/> Home
        </NavLink>
        <NavLink to="/artists" className={linkClass}>
          <img src='/artist.png' alt='ARTIST'/> Artists
        </NavLink>
        <NavLink to="/albums" className={linkClass}>
          <img src='/albums.png' alt='ALBUMS'/> Albums
        </NavLink>
        <NavLink to="/playlists" className={linkClass}>
          <img src='/playlist.png' alt='PLAYLISTS'/> Playlists
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
