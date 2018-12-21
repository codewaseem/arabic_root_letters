const puppeteer = require('puppeteer');
const { writeFileSync } = require("fs");
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let baseUrl = 'http://corpus.quran.com/verbs.jsp?page=';
    totalNoOfPages = 30;

    let url, roots = {};

    for (let i = 1; i <= totalNoOfPages; i++) {
        url = baseUrl + i;
        await page.goto(url);
        let a = await page.evaluate((roots) => {
            let rows, currentRow;
            rows = Array.from(document.querySelectorAll(".verbTable tbody tr"));
            rows.shift();
            for (currentRow of rows) {
                let data = currentRow.querySelectorAll("td");
                let rootVerb = data[0].textContent;
                let rootLetters = data[1].textContent;
                let form = data[2].textContent;
                let frequency = +data[3].textContent;
                let translation = data[4].textContent;
                if (!roots[rootLetters]) {
                    roots[rootLetters] = {};
                }

                roots[rootLetters] = {
                    ...roots[rootLetters],
                    [form]: {
                        rootVerb,
                        frequency,
                        translation
                    }
                }

            }
            return roots;
        }, roots);
        roots = { ...a };

    }
    writeFileSync("roots.json", JSON.stringify(roots));
    await browser.close();
});