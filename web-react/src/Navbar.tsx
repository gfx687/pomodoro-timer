import "./Navbar.css";
import { useState, useEffect, type ReactNode, lazy } from "react";
import { IconTray } from "./components/IconTray";
import {
  PomodoroSvg,
  MenuSvg,
  SettingsSvg,
  KeybindsSvg,
  ChartsSvg,
} from "./components/svgs";
import { useFullscreenContext } from "./contexts/FullscreenContext";
import { KeybindsPage } from "./pages/KeybindsPage";
import TimerPage from "./pages/TimerPage";
import { SettingsPage } from "./pages/SettingsPage";

const BASE_PATH = import.meta.env.VITE_BASE_PATH;

const rootPath = BASE_PATH + "/";
const settingsPath = BASE_PATH + "/settings";
const chartsPath = BASE_PATH + "/charts";
const keybindsPath = BASE_PATH + "/keybinds";

const ChartsPageLazy = lazy(() => import("./pages/ChartsPage"));

export function Navbar() {
  const [path, setPath] = useState(window.location.pathname);
  const { isTimerFullscreen } = useFullscreenContext();

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(to: string) {
    if (to === path) return;

    window.history.pushState({}, "", to);
    setPath(to);
  }

  let isFullWidthPage = false;
  let content: ReactNode;
  switch (path) {
    case rootPath:
    case BASE_PATH:
      content = <TimerPage />;
      break;
    case settingsPath:
      content = <SettingsPage />;
      break;
    case chartsPath:
      content = <ChartsPageLazy />;
      isFullWidthPage = true;
      break;
    case keybindsPath:
      content = <KeybindsPage />;
      break;
    default:
      content = <h1>404 Not Found</h1>;
      break;
  }

  return (
    <div
      className={
        "app" +
        (isFullWidthPage ? " app-fullwidth" : "") +
        (isTimerFullscreen ? " hidden" : "")
      }
    >
      <nav className="navbar">
        <a
          onClick={() => navigate(rootPath)}
          className="navbar-item navbar-item-link navbar-hover"
        >
          <PomodoroSvg />
          <span>Pomodoro</span>
        </a>
        <div className="navbar-item">
          <IconTray />
        </div>
        <div className="navbar-item navbar-item-link navbar-item-right navbar-dropdown">
          <MenuSvg />
          <div className="navbar-dropdown-content">
            <DropdownNavItem
              text="Charts"
              onClick={() => navigate(chartsPath)}
            />
            <DropdownNavItem
              text="Keybinds"
              onClick={() => navigate(keybindsPath)}
            />
            <DropdownNavItem
              text="Settings"
              onClick={() => navigate(settingsPath)}
            />
          </div>
        </div>
      </nav>

      <main>{content}</main>
    </div>
  );
}

interface DropdownLinkProps {
  text: string;
  onClick: () => void;
}

function DropdownNavItem({ text, onClick }: DropdownLinkProps) {
  let svg: ReactNode;
  switch (text) {
    case "Settings":
      svg = <SettingsSvg />;
      break;
    case "Keybinds":
      svg = <KeybindsSvg />;
      break;
    case "Charts":
      svg = <ChartsSvg />;
      break;
    default:
      svg = <></>;
      break;
  }
  return (
    <a className="navbar-dropdown-item navbar-hover" onClick={onClick}>
      {svg}
      <span>{text}</span>
    </a>
  );
}
