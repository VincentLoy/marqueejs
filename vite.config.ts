import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    return {
      server: {
        open: true,
      },
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
    };
  }

  if (command === "preview") {
    return {
      preview: {
        port: 4173,
        open: true,
      },
    };
  }

  const config = {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "MarqueeJS",
      },
      sourcemap: true,
      minify: "esbuild",
      rollupOptions: {
        output: [
          {
            format: "es",
            entryFileNames: "marqueejs.es.min.js",
            compact: true,
          },
          {
            format: "umd",
            entryFileNames: "marqueejs.umd.min.js",
            name: "MarqueeJS",
            compact: true,
          },
        ],
      },
    },
  };

  if (mode === "docs") {
    return {
      root: "docs/src",
      build: {
        outDir: "../dist",
        emptyOutDir: true,
      },
    };
  }

  return config;
});
