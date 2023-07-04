// tailwind.config.js
const spacing = {};
for (let i = 0; i < 100; i++) {
  spacing[i] = i + "px";
}
module.exports = {
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'], //根据情况而定
    darkMode: false, // or 'media' or 'class'
    corePlugins: {
        // 屏蔽默认配置样式
        preflight: false,
        container: false,
    },
    theme: {
        extend: {
            lineHeight: {
                18: "18px",
                19: "19px",
                32: "32px",
            },
        },
        fontFamily: {
            sans: ["AkzidGrtskProMed"],
        },
        textColor: {
            primary: "#E50071",
            first: "#000000",
            secondary: "#666666",
            third: "#999999",
            ford: "#CDCDCD",
            sale: "#D0011B",
        },
        fontSize: {
            zero: 0,
            sm: ["12px", "12px"],
            tiny: ["14px", "18px"],
            base: ["16px"],
            lg: ["22px", "24px"],
            xl: ["28px"],
            xxl: ["32px"],
        },
        spacing,
    },
    variants: {
        extend: {},
    },
    plugins: [],
}

  