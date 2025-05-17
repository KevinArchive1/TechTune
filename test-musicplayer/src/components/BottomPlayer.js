import React, { useEffect, useRef, useState } from 'react';

const BottomPlayer = ({
  currentTrack,
  videoId,
  onNext,
  onBack,
  toggleFavorite,
  isFavorited,
}) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (videoId) {
      createPlayer();
    }
  }, [videoId]);

  const createPlayer = () => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = loadPlayer;
      document.body.appendChild(tag);
    } else {
      loadPlayer();
    }
  };

  const loadPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player('yt-player', {
      height: '0',
      width: '0',
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(volume);
          event.target.playVideo();
          setDuration(event.target.getDuration());
          startProgressTracking();
        },
        onStateChange: (event) => {
          const player = playerRef.current;

          if (event.data === window.YT.PlayerState.ENDED) {
            if (repeat && player) {
              player.seekTo(0);
              player.playVideo();
            } else {
              onNext && onNext();
            }
          } else if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setDuration(player.getDuration());
            startProgressTracking();
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
          }
        },
      },
    });
  };

  const togglePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const vol = parseInt(e.target.value, 10);
    setVolume(vol);
    const player = playerRef.current;
    if (player) {
      player.setVolume(vol);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    const player = playerRef.current;
    if (player) {
      player.seekTo(seekTime);
    }
  };

  const startProgressTracking = () => {
    clearInterval(intervalRef.current);
    const player = playerRef.current;

    intervalRef.current = setInterval(() => {
      if (player && player.getDuration) {
        const duration = player.getDuration();
        const current = player.getCurrentTime();
        setDuration(duration);
        setCurrentTime(current);
        setProgress(current);
      }
    }, 1000);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-0 w-full bg-gray-300 text-white px-4 py-3 shadow-md flex items-center justify-between gap-4">
      {currentTrack ? (
        <>
          {/* Cover & Info */}
          <div className="flex items-center gap-3 text-black w-[20%]">
            {currentTrack.cover && (
              <img
                src={currentTrack.cover}
                alt="cover"
                className="h-12 w-12 object-cover rounded"
              />
            )}
            <div>
              <marquee className="font-semibold w-full text-sm">{currentTrack.title}</marquee>
              <div className="text-xs text-gray-900">{currentTrack.artist}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 ml-auto mr-auto w-full w-[50%]">
            <div className="flex gap-4 text-xl justify-center">
              <button onClick={onBack} title="Previous">
                <img src='/previous.png' alt='PREVIOUS'/>
              </button>
              <button onClick={togglePlayPause} title="Play/Pause">
                {isPlaying ? <img src='/pause.png' alt='PAUSE'/> : <img src='/play.png' alt='PLAY'/>}
              </button>
              <button onClick={onNext} title="Next">
                <img src='/next.png' alt='NEXT'/>
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                title="Repeat"
                className={repeat ? 'text-pink-500' : ''}
              >
                <img src='/repeat.png' alt='REPEAT'/>
              </button>

              {/* Favorite toggle button */}
              <button
                onClick={() => toggleFavorite(currentTrack)}
                aria-label={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                className={`text-2xl focus:outline-none transition-colors duration-200 ${
                  isFavorited ? 'text-pink-600' : 'text-gray-400 hover:text-pink-500'
                }`}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center w-[50%] gap-2">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 1}
                value={progress}
                onChange={handleSeek}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Hidden YouTube Player */}
          <div ref={playerContainerRef} style={{ display: 'none' }}>
            <div id="yt-player" />
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-end gap-2 w-[15%]">
            🔊
            <input 
              className='color-roseRed'
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </>
      ) : (
        <div className="flex justify-center w-full text-gray-400 italic text-lg">
          Your tracks will be shown here!!!
        </div>
      )}
    </div>
  );
};

export default BottomPlayer;
