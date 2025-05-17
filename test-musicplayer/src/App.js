import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SearchResults from './components/SearchResults';
import BottomPlayer from './components/BottomPlayer';
import Home from './pages/Home';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Playlists from './pages/Playlists';
import Favorites from './pages/Favorites';
import PlaylistDetail from './pages/PlaylistDetail';

const AppWrapper = () => {
  const location = useLocation();
  return <App location={location} />;
};

const App = ({ location }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [playingList, setPlayingList] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [playlists, setPlaylists] = useState(() => {
    const storedPlaylists = localStorage.getItem('playlists');
    if (storedPlaylists) return JSON.parse(storedPlaylists);
  
    
    return [
      { id: 'favorites', name: 'Favorites', songs: [] },
      { id: '1', name: 'Playlist #1', songs: [] },
      { id: '2', name: 'Playlist #2', songs: [] },
    ];
  });

  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage initially
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Pang load sa favorites papuntang localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const addToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.songs.some((s) => s.videoId === song.videoId)
          ? { ...p, songs: [...p.songs, song] }
          : p
      )
    );
  };

  const addToFavorites = (song) => {
    setFavorites((prev) => {
      // Avoid duplicates
      if (prev.find((fav) => fav.videoId === song.videoId)) return prev;
      return [...prev, song];
    });
  };

  const removeFromFavorites = (videoId) => {
    setFavorites((prev) => prev.filter((fav) => fav.videoId !== videoId));
  };

  const isFavorited = (track) => {
    return favorites.some((fav) => fav.videoId === track.videoId);
  };

  const toggleFavorite = (track) => {
    if (isFavorited(track)) {
      setFavorites((prev) => prev.filter((fav) => fav.videoId !== track.videoId));
    } else {
      setFavorites((prev) => [...prev, track]);
    }
  };

  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]);

  const searchTrack = async (query) => {
    setSearchQuery(query);
    try {
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q=${encodeURIComponent(
          query
        )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );

      const ytData = await ytRes.json();

      if (ytData.error) {
        console.error('YouTube API error:', ytData.error);
        setSearchResults([]);
        setCurrentTrackIndex(null);
        return;
      }

      const tracks = ytData.items.map((video) => ({
        videoId: video.id.videoId,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        cover: video.snippet.thumbnails.default.url,
      }));

      setSearchResults(tracks);
      setPlayingList(tracks);
      setCurrentTrackIndex(tracks.length > 0 ? 0 : null);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setCurrentTrackIndex(null);
    }
  };

  const handleTrackSelect = (track) => {
    const index = playingList.findIndex((t) => t.videoId === track.videoId);
    if (index !== -1) {
      setCurrentTrackIndex(index);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex === null || prevIndex >= playingList.length - 1) return 0;
      return prevIndex + 1;
    });
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex === null || prevIndex <= 0) return playingList.length - 1;
      return prevIndex - 1;
    });
  };

  const handleArtistClick = (artistName) => {
    setSearchQuery(artistName);
    searchTrack(artistName);
  };

  const handlePlayFromFavorites = (songs, index) => {
    setPlayingList(songs);
    setCurrentTrackIndex(index);
  };
  

  const currentTrack = currentTrackIndex !== null ? playingList[currentTrackIndex] : null;
  const videoId = currentTrack?.videoId || '';

  return (
    <div className="flex h-screen">
      {sidebarOpen && <Sidebar />}
      <div className={`w-[5%] relative bg-roseRed ${isActive ? 'bg-white' : ''}`}>
        {/* Toggle Button */}
        <button
          className={`absolute top-4 left-4 z-50 px-3 py-1 text-white rounded hover:bg-pink-700 shadow ${isActive ? 'bg-roseRed' : 'bg-white'}`}
          onClick={() => {
            toggleSidebar();
            setIsActive(prev => !prev);
          }}
        >
          {isActive ? '☰' : '❌'}
        </button>

        <div className="">
          <Outlet /> 
        </div>
      </div>
      <main className="flex-1 flex flex-col bg-mint-400 relative pb-24">
        <TopBar searchTrack={searchTrack} searchQuery={searchQuery} />

        {searchQuery && searchResults.length > 0 ? (
          <SearchResults tracks={searchResults} onTrackSelect={handleTrackSelect} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists onArtistClick={handleArtistClick} />} />

            <Route
              path="/albums"
              element={
                <Albums
                  onTrackSelect={handleTrackSelect}
                  setSearchResults={setSearchResults}
                  addToPlaylist={addToPlaylist}
                  playlists={playlists}
                  favorites={favorites}
                  addToFavorites={addToFavorites} 
                />
              }
            />

          <Route
            path="/playlists/*"
            element={
              <Playlists
                playlists={playlists}
                setPlaylists={setPlaylists}
                addToPlaylist={addToPlaylist}
                favorites={favorites}
              />
            }
          >
            <Route
              path=":playlistId" 
              element={
                <PlaylistDetail
                  playlists={playlists}
                  setCurrentTrack={(track) => {
                    setPlayingList([track]);
                    setCurrentTrackIndex(0);
                  }}
                  setVideoId={() => {}}
                  setPlaylists={setPlaylists}
                />
              }
            />
            <Route
              path="favorites"
              element={
                <Favorites
                  favorites={favorites}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  onPlay={handlePlayFromFavorites}
                />
              }
            />
          </Route>
          </Routes>
        )}
      </main>

      <BottomPlayer
        currentTrack={currentTrack}
        videoId={videoId}
        onNext={handleNextTrack}
        onBack={handlePreviousTrack}
        toggleFavorite={toggleFavorite}
        isFavorited={currentTrack ? isFavorited(currentTrack) : false}
      />
    </div>
  );
};

const RootApp = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default RootApp;
