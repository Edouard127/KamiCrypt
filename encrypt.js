
/***
 *      _  __               _  _____                  _   
 *     | |/ /              (_)/ ____|                | |  
 *     | ' / __ _ _ __ ___  _| |     _ __ _   _ _ __ | |_ 
 *     |  < / _` | '_ ` _ \| | |    | '__| | | | '_ \| __|
 *     | . \ (_| | | | | | | | |____| |  | |_| | |_) | |_ 
 *     |_|\_\__,_|_| |_| |_|_|\_____|_|   \__, | .__/ \__|
 *                                         __/ | |        
 *                                        |___/|_|       
 *     //2022 21:05:58 GMT-04:00  
 */



const Jimp = require('jimp')
const fs = require('fs');
const zlib = require('zlib');
require("colors")


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * 64);
        [array[j], array[i]] = [array[j], array[i]];
    }
}

function scramblePixelPosition(length) {
    const new_rgba = []
    for (let i = 0; i < length; i++) new_rgba.push(i);
    shuffleArray(new_rgba);
    return new_rgba
}
function scramblePixelValue(val) {
    const shuffledBitPositions = scramblePixelPosition(2);
    const bits = []
    for (let i = 0; i < 8; i++) bits.push(val >> i & 1);
    let res = 0
    for(let i = 0; i < 8; i++) {
        if(bits[shuffledBitPositions[i]] === 1) {
            res += (1 << i);
        }
    }
    return res;
}


async function main() {
    console.log(`
    _  __               _  _____                  _   
   | |/ /              (_)/ ____|                | |
   | ' / __ _ _ __ ___  _| |     _ __ _   _ _ __ | |_ 
   |  < / _\` | '_ \` _ \| | |    | '__| | | | '_ \| __|
   | . \ (_| | | | | | | | |____| |  | |_| | |_) | |_ 
   |_|\_\__,_|_| |_| |_|_|\_____|_|   \__, | .__/ \__|
                                       __/ | |        
                                      |___/|_|`.green)
    if(process.argv[2] == undefined){
        console.log("Please specify the source image\nExample: node encrypt .\\my_image.png")
        process.exit(0)
    }
    console.log("Reading the source image...".yellow)
    var buffer = await Jimp.read(require("fs").readFileSync(process.argv[2].toString()))
    console.log("Successfully read the source image".green)
    var rgba = buffer.bitmap.data
    const length = rgba.length

    let key = []
    const new_rgba = Buffer.alloc(length);

    await new Promise(resolve => {
        console.log("Scrambling the pixels values...".yellow)
        for (let i = 0; i < length; i++) {
            key.push(rgba[i])
            rgba[i] = scramblePixelValue(rgba[i]);
        }
        console.log("Scrambled the pixels values".green)

        console.log("Appliying the new pixels...".yellow)
        for (let i = 0; i < length; i++) {
            new_rgba[i] = rgba[i];
        }

        resolve();
    }).then(async() => {
        buffer.bitmap.data = new_rgba;
        console.log("Applied the new pixels".green)

        console.log("Writing the encrypted image to disk...".yellow)
        await buffer.write(process.argv[2].toString()+"_e.jpg")
        console.log("Successfully wrote the encrypted image to disk !".green)

        console.log("Writing the key text...".yellow)
        await fs.writeFileSync(process.argv[2].toString()+"_key.txt", zlib.deflateSync(Buffer.from(key)));
        console.log("Successfully wrote the key text file !".green)

        console.log("Thanks for using this program !".bgMagenta)
    })
}
main()