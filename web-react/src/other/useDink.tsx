import { useCallback, useEffect, useRef } from "react";
import alert from "../assets/alert.mp3";
import { useSettingsContext } from "../contexts/SettingsContext";

export default function useDink(): () => void {
  const audio = useRef<HTMLAudioElement | null>(null);
  const { volume } = useSettingsContext();

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
