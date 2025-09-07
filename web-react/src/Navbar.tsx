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
        "shadow-fg mt-2 mr-auto ml-auto w-full max-w-125 p-4 shadow-[0_0_10px]" +
        (isFullWidthPage ? " box-border !w-98/100 !max-w-full p-4" : "") +
        (isTimerFullscreen ? " invisible" : "")
      }
    >
      <nav className="border-bg-alt mr-auto ml-auto flex max-w-117 border-b-2 pb-2">
        <a
          onClick={() => navigate(rootPath)}
          className="navbar-item navbar-item-link hover:!bg-hover active:!bg-active"
        >
          <PomodoroSvg />
          Pomodoro
        </a>
        <div className="navbar-item">
          <IconTray />
        </div>
        <div className="navbar-item navbar-item-link navbar-dropdown ml-auto">
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
    <a
      className="border-hover hover:!bg-hover active:!bg-active z-1 flex cursor-pointer items-center gap-1 border-b-1 pt-3 pr-4 pb-3 pl-4"
      onClick={onClick}
    >
      {svg}
      <span>{text}</span>
    </a>
  );
}
