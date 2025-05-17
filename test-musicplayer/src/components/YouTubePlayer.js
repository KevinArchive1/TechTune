import React, { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    let interval;

    const loadYT = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      } else {
        createPlayer();
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    };

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('ytplayer', {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onReady: () => {
            setDuration(playerRef.current.getDuration());
            playerRef.current.setVolume(volume);
            interval = setInterval(() => {
              setCurrentTime(playerRef.current.getCurrentTime());
              setDuration(playerRef.current.getDuration());
            }, 1000);
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    loadYT();

    return () => clearInterval(interval);
  }, [videoId]);

  const play = () => playerRef.current?.playVideo();
  const pause = () => playerRef.current?.pauseVideo();
  const seek = (e) => {
    const time = parseFloat(e.target.value);
    playerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  };
  const changeVolume = (e) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    playerRef.current?.setVolume(vol);
  };

  const format = (sec) => {
    const min = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${min}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="text-white p-4 max-w-xl mx-auto">
      <div id="ytplayer" className="hidden" />
      <div className="flex items-center gap-4 mb-4">
        <button onClick={play} className="bg-green-600 px-3 py-1 rounded">▶️</button>
        <button onClick={pause} className="bg-yellow-500 px-3 py-1 rounded">⏸️</button>

        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={seek}
          className="w-full"
        />
        <span className="text-sm">{format(currentTime)} / {format(duration)}</span>
      </div>
      <div className="flex items-center gap-2">
        <label>🔊</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={changeVolume}
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;
