import { useState, useEffect } from 'react';
import { Howl } from 'howler';

export const useAudioPlayer = () => {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // For demo purposes, we'll use a default meditation sound
    // In a real app, you would load the actual audio from Eleven Labs API
    const meditationSound = new Howl({
      src: ['https://audio.jukehost.co.uk/5PybQbnTEhY3mZpLLWQxcUL0lIh3GqVK'],
      html5: true,
      onload: () => {
        setDuration(meditationSound.duration());
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

    setSound(meditationSound);

    return () => {
      if (meditationSound) {
        meditationSound.unload();
      }
    };
  }, []);

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
    togglePlayPause,
    seek,
    reset
  };
};