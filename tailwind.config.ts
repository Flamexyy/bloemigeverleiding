import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // ...existing content configuration
  ],
  theme: {
    extend: {
      // ...existing theme extensions

      // Add typography plugin configuration
      typography: {
        pink: {
          css: {
            "--tw-prose-body": "#654b56",
            "--tw-prose-headings": "#654b56",
            "--tw-prose-links": "#654b56",
            "--tw-prose-bold": "#654b56",
            "--tw-prose-counters": "#654b56",
            "--tw-prose-bullets": "#654b56",
          },
        },
      },
    },
  },
  // Add the typography plugin if not already added
  plugins: [
    require("@tailwindcss/typography"),
    // ...other plugins
  ],
};

export default config;
