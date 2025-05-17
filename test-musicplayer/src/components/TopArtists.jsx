import React, { useEffect, useState } from 'react';

const artistNames = [
  'Drake', 'Ariana Grande', 'Eminem', 'Justin Bieber', 'Ed Sheeran',
  'Taylor Swift', 'Beyoncé', 'Kanye West', 'Rihanna', 'Katy Perry',
  'Bruno Mars', 'Billie Eilish', 'Post Malone', 'Doja Cat', 'Sia',
  'Shawn Mendes', 'Selena Gomez', 'The Weeknd', 'Imagine Dragons', 'Lady Gaga',
  'Nicki Minaj', 'Camila Cabello', 'Olivia Rodrigo', 'Harry Styles', 'Lana Del Rey',
  'Lil Nas X', '21 Savage', 'J. Cole', 'Travis Scott', 'Bad Bunny',
  'Charlie Puth', 'Dua Lipa', 'Maroon 5', 'Adele', 'BLACKPINK',
  'BTS', 'Zayn', 'Niall Horan', 'Halsey', 'Jason Derulo'
];

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const TopArtists = ({ onArtistClick }) => {
  const [artists, setArtists] = useState([]);

  const fetchWikipediaImage = async (artistName) => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(
          artistName
        )}&origin=*`
      );
      const data = await res.json();
      const pages = data.query.pages;
      const page = Object.values(pages)[0];
      return page.original?.source || null;
    } catch (error) {
      console.error(`Image fetch failed for ${artistName}`, error);
      return null;
    }
  };

  useEffect(() => {
    const shuffledArtists = shuffleArray(artistNames).slice(0, 30); 
    const fetchAll = async () => {
      const results = await Promise.all(
        shuffledArtists.map(async (name) => {
          const imageUrl = await fetchWikipediaImage(name);
          return { name, imageUrl };
        })
      );
      setArtists(results);
    };

    fetchAll();
  }, []);

  return (
    <div className="p-6 "> 
      <h1 className="text-3xl font-bold mb-6 text-deepPurple">Top Artists</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {artists.map((artist, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => onArtistClick(artist.name)}
          >
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-md hover:shadow-lg transition"
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
                No Image
              </div>
            )}
            <h2 className="mt-2 text-sm font-medium text-gray-800">{artist.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default TopArtists;
