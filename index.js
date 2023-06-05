const walk = require('walkdir');
const fs = require('fs');
const path = require('path');
const Jimp = require("jimp");

const tileFile = (src, target) => {
    Jimp.read(src, (err, texture) => {
        if (err) throw err;

        let srcWidth = texture.bitmap.width;
        let srcHeight = texture.bitmap.height;
        let targetWidth = srcWidth * 2;
        let targetHeight = srcHeight * 2;
        if (srcWidth !== srcHeight) {
            console.log(src, 'is not square', srcWidth, srcHeight);
        }

        const buffer = Buffer.alloc(targetWidth * targetHeight * 4);
    
        new Jimp({ data: buffer, width: targetWidth, height: targetHeight }, (err, image) => {
            if (err) console.error(err);
            
            const d = texture.bitmap.data;
            for (let x = 0; x < targetWidth; x++) {
                for (let y = 0; y < srcHeight; y++) {
                    image.setPixelColor(texture.getPixelColor(x % srcWidth, y), x, y);
                }   
            }
            for (let x = 0; x < targetWidth; x++) {
                for (let y = 0; y < srcHeight; y++) {
                    image.setPixelColor(texture.getPixelColor(x % srcWidth, y), x, srcHeight + y);
                }   
            }

        
            image.write(target);    
        });
    });    

}

// Just GUI
// const target = (src) => src.replace(/\/images\/gui\//, '/tiled-images/');

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

