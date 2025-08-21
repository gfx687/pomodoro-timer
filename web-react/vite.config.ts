import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH + "/",
  };
});
