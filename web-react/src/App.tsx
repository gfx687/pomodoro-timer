import TimerPage from "./pages/TimerPage";
import "./App.css";
import { useEffect, useState, type ReactNode } from "react";
import SettingsPage from "./pages/SettingsPage";
import {
  FullscreenProvider,
  useFullscreenContext,
} from "./contexts/FullscreenContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { IconTray } from "./components/IconTray";
import { ChartsPage } from "./pages/ChartsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChartsSvg,
  KeybindsSvg,
  MenuSvg,
  PomodoroSvg,
  SettingsSvg,
} from "./components/svgs";
import { KeybindsPage } from "./pages/KeybindsPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FullscreenProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </FullscreenProvider>
    </QueryClientProvider>
  );
}

const BASE_PATH = import.meta.env.VITE_BASE_PATH;

const rootPath = BASE_PATH + "/";
const settingsPath = BASE_PATH + "/settings";
const chartsPath = BASE_PATH + "/charts";
const keybindsPath = BASE_PATH + "/keybinds";

function AppContent() {
  const [path, setPath] = useState(window.location.pathname);
  const { isTimerFullscreen } = useFullscreenContext();

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });

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
      content = <ChartsPage />;
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
            <DropdownNav text="Charts" onClick={() => navigate(chartsPath)} />
            <DropdownNav
              text="Keybinds"
              onClick={() => navigate(keybindsPath)}
            />
            <DropdownNav
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

function DropdownNav({ text, onClick }: DropdownLinkProps) {
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
