import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
		gridTemplateColumns: {
			'19': 'repeat(19, 1fr)'
		}
	},
  },
  plugins: [],
} satisfies Config;
