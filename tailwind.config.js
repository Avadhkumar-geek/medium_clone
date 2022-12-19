/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "yellow-450": "#ffc017",
            },
            // height: {
            //     "455": "455px",
            // },
        },
    },
    plugins: [],
};
