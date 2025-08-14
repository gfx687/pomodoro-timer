import { useCallback, useEffect, useRef } from "react";
import alert from "../assets/alert.mp3";
import { useSettings } from "./useSettings";

export default function useDink(): () => void {
  const audio = useRef<HTMLAudioElement | null>(null);
  const { volume } = useSettings();

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
