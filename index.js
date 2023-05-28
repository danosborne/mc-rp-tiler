const walk = require('walkdir');
const {spawnSync} = require('node:child_process');
const fs = require('fs');
const path = require('path');
const Jimp = require("jimp");

const tileFile = (src, target) => {
    const buffer = Buffer.alloc(32 * 32 *4);
    new Jimp({ data: buffer, width: 32, height: 32 }, (err, image) => {
        if (err) console.error(err);
        
        Jimp.read(src, (err, texture) => {
            if (err) throw err;
        
            const d = texture.bitmap.data;
            for (let x = 0; x < 16 * 2; x++) {
                for (let y = 0; y < 16; y++) {
                    image.setPixelColor(texture.getPixelColor(x % 16, y), x, y);
                }   
            }
            for (let x = 0; x < 16 * 2; x++) {
                for (let y = 0; y < 16; y++) {
                    image.setPixelColor(texture.getPixelColor(x % 16, y), x, 16 + y);
                }   
            }

            image.write(target);
        });    
    });
}

const target = (src) => src.replace(/\/images\//, '/tiled-images/');

const handleFile = (filename) => {
    if (filename.endsWith('.png')) {
        const targetFilePath = target(filename);
        const dirname = path.dirname(targetFilePath);
        if (!fs.existsSync(dirname)){
            fs.mkdirSync(dirname, { recursive: true });
        }
        tileFile(filename, targetFilePath);
    }
};

const WALK_DIR = `${__dirname}/images/`;
const paths = walk.sync(WALK_DIR);
paths.forEach(handleFile); 

