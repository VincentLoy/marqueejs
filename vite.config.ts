import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    return {
      server: {
        open: true,
      },
      css: {
        postcss: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
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
        fileName: (format) => `marqueejs.${format}${format === "umd" ? ".min" : ""}.js`,
        formats: ["es", "umd"],
      },
      sourcemap: true,
      rollupOptions: {
        output: {
          exports: "named",
        },
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
