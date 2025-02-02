const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.aldi.com.au/groceries/super-savers/', { waitUntil: 'networkidle2' });

    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.box--wrapper')).map(product => {
            const name = product.querySelector('.box--description')?.innerText.trim() || 'No Name';
            const price = product.querySelector('.box--price')?.innerText.trim() || 'No Price';
            const image = product.querySelector('img')?.src || 'No Image';
            return { name, price, image };
        });
    });

    console.log(products);
    fs.writeFileSync('aldi_super_savers.json', JSON.stringify(products, null, 2));

    await browser.close();
})();
