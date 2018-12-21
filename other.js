let rootLetters = require("./roots.json");
const { writeFileSync } = require("fs");
let roots = Object.keys(rootLetters).map((root) => {
    return root.split(" ").join("");
});
const baseUrl = "http://corpus.quran.com/search.jsp?q=root%3A";
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let root of roots) {
        await page.goto(baseUrl + root);
        const count = await page.evaluate(() => {
            return document.querySelector('p[style="font-size: 0.833em"] b+b+b').textContent;
        });
        rootLetters[root.split("").join(" ")]["rootFrequency"] = count;
    }
    writeFileSync("roots_with_frequency.json", JSON.stringify(rootLetters));
    await browser.close();
});