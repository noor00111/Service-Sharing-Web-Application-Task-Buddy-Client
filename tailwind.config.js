const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                paper: token("paper"),
                card: token("card"),
                ink: token("ink"),
                "ink-soft": token("ink-soft"),
                rule: token("rule"),
                stamp: token("stamp"),
                marker: token("marker"),
                plum: token("plum"),
                deep: token("deep"),
                danger: token("danger"),
            },
            fontFamily: {
                display: ['"Young Serif"', "Georgia", "serif"],
                body: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
                mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
                headingFont: ['"Young Serif"', "Georgia", "serif"],
                bodyFont: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
