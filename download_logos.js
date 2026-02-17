const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'public/images/partners';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const download = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(dir, filename));
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                download(response.headers.location, filename).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(filename);
            reject(err);
        });
    });
};

const images = [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Coat_of_arms_of_Nigeria.svg/500px-Coat_of_arms_of_Nigeria.svg.png', name: 'nigeria_coa.png' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Arik_Air_logo.svg/500px-Arik_Air_logo.svg.png', name: 'arik_air.png' },
    { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Ibom_Air_Logo.jpg/250px-Ibom_Air_Logo.jpg', name: 'ibom_air.jpg' } // Trying a thumbnail for Ibom
];

// Air Peace - using a direct link that seems reliable from search results or previous knowledge could be tricky. 
// I'll try to find a reliable one or just use a placeholder if it fails. 
// Let's try to add one for Air Peace.
// Wikipedia often has them.
images.push({ url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Air_Peace_logo.png', name: 'air_peace.png' });


async function run() {
    for (const img of images) {
        try {
            console.log(`Downloading ${img.name}...`);
            await download(img.url, img.name);
            console.log(`Downloaded ${img.name}`);
        } catch (e) {
            console.error(`Failed to download ${img.name}:`, e.message);
        }
    }
}

run();
