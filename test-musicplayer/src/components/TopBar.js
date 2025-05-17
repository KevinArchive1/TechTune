import React, { useState, useEffect, useRef } from 'react';

const TopBar = ({ searchTrack, searchQuery }) => {
  const [input, setInput] = useState(searchQuery || '');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.trim()) {
        console.log('[TopBar] Triggering search for:', input); 
        searchTrack(input);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [input, searchTrack]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('[TopBar] Voice transcript:', transcript); 
      setInput(transcript);
      searchTrack(transcript);
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (err) => {
      console.error('[TopBar] Speech recognition error:', err);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [searchTrack]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      console.log('[TopBar] Manual submit search:', input); 
      searchTrack(input);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white">
      {/* Search Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-xl border-2 border-blue-500 rounded-full px-4 py-2 bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z"
          />
        </svg>
        <input
          type="text"
          className="flex-grow bg-gray-100 outline-none"
          placeholder="Search Music"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="button"
          onClick={handleMicClick}
          className="ml-2"
          aria-label="Toggle voice input"
        > 
          <div className={`p-1 rounded-[100%] ${listening ? 'bg-red-500 animate-pulse' : 'text-gray-700'}`}>
            <img src="/mic.png" alt="MICROPHONE" className="h-6 w-6" />
          </div>
        </button>
      </form>

      {/* Profile Section */}
      <div className="ml-4 flex items-center bg-gray-100 rounded-full px-3 py-2">
        <img
          src='/pfp.jpg'
          alt="User Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="text-gray-700 font-medium">schrodinger's cat</span>
      </div>
    </div>
  );
};

export default TopBar;
