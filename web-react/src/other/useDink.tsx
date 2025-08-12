import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULTS, SETTINGS } from "../constants";
import alert from "../assets/alert.mp3";

export default function useDink(): () => void {
  const audio = useRef<HTMLAudioElement | null>(null);

  const [volume] = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume);
    return v !== null ? Number(v) : DEFAULTS.volume;
  });

  useEffect(() => {
    audio.current = new Audio(alert);
    audio.current.preload = "auto";
  }, []);

  const play = useCallback(() => {
    if (audio?.current) {
      audio.current.volume = volume / 100;
      audio.current.currentTime = 0;
      audio.current.play();
    }
  }, [volume]);

  return play;
}
