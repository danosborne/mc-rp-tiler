const walk = require('walkdir');
const {spawn} = require('node:child_process');
const fs = require('fs');
const path = require('path');

const target = (src) => src.replace(/\/images\//, '/tiled-images/');
const spawnCommand = (src) => {
    const input = `tile:${src}`;
    const output = target(src);
    return spawn(
    //   'convert', [
    //     '-size',
    //     '32x32',
    //     input,
    //     output
    //     ],
    `magick -size 32x32 ${input} ${output}`,[],
      {
        stdio: 'inherit',
        shell: true,
      }
    );
};

const WALK_DIR = `${__dirname}/images/`;
const emitter = walk(WALK_DIR);
emitter.on('file', function(filename, stat) {
    if (filename.endsWith('.png')) {
        const targetFilePath = target(filename);
        const dirname = path.dirname(targetFilePath);
        if (!fs.existsSync(dirname)){
            fs.mkdirSync(dirname, { recursive: true });
        }
        const cp = spawnCommand(filename);
        cp.on('error', (err) => {
            console.error(err);
        });
    }
});
 
