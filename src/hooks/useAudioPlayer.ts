import { useState, useEffect } from 'react';
import { Howl } from 'howler';

interface UseAudioPlayerProps {
  audioUrl?: string;
}

export const useAudioPlayer = ({ audioUrl }: UseAudioPlayerProps = {}) => {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up previous sound instance if it exists
    if (sound) {
      sound.unload();
    }

    // If no audioUrl is provided, don't create a new Howl instance
    if (!audioUrl) {
      setSound(null);
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
      return;
    }

    console.log("Loading audio from URL:", audioUrl);
    setIsLoading(true);
    setError(null);

    const newSound = new Howl({
      src: [audioUrl],
      html5: true,
      onload: () => {
        console.log("Audio loaded successfully, duration:", newSound.duration());
        setDuration(newSound.duration());
        setIsLoading(false);
      },
      onloaderror: (id, err) => {
        console.error("Error loading audio:", err);
        setError("Failed to load audio");
        setIsLoading(false);
      },
      onplay: () => {
        setIsPlaying(true);
        requestAnimationFrame(updateTime);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });

    setSound(newSound);

    return () => {
      if (newSound) {
        newSound.unload();
      }
    };
  }, [audioUrl]);

  const updateTime = () => {
    if (sound && sound.playing()) {
      setCurrentTime(sound.seek());
      requestAnimationFrame(updateTime);
    }
  };

  const togglePlayPause = () => {
    if (!sound) return;
    
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  const seek = (time: number) => {
    if (!sound) return;
    sound.seek(time);
    setCurrentTime(time);
  };

  const reset = () => {
    if (!sound) return;
    sound.stop();
    sound.play();
  };

  return {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    togglePlayPause,
    seek,
    reset
  };
};