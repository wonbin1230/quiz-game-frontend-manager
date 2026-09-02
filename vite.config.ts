import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// 本機 dev 用 `/`；build / preview 用 GitHub Pages 專案路徑
	base: mode === "production" ? "/quiz-game-frontend-manager/" : "/",
}));
