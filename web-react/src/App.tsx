import { FullscreenProvider } from "./contexts/FullscreenContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./Navbar";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FullscreenProvider>
        <SettingsProvider>
          <Navbar />
        </SettingsProvider>
      </FullscreenProvider>
    </QueryClientProvider>
  );
}
