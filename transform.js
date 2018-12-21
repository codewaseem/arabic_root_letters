const rootLetters = require("./roots_with_frequency.json");
const roots = require("./roots.json");
const fs = require("fs");

const transformed = Object.keys(rootLetters).reduce((final, key) => {
    return {
        ...final,
        [key]: {
            rootLetters: key,
            forms: {
                ...roots[key]
            },
            frequency: +rootLetters[key].rootFrequency
        }
    }
}, {});

fs.writeFileSync("final.json", JSON.stringify(transformed));