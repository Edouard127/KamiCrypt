
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



const fs = require('fs');
const Jimp = require('jimp')
const zlib = require('zlib');
require('colors')

async function main(){
    console.log(`
    _  __               _  _____                  _   
   | |/ /              (_)/ ____|                | |  
   | ' / __ _ _ __ ___  _| |     _ __ _   _ _ __ | |_
   |  < / _\` | '_ \` _ \| | |    | '__| | | | '_ \| __|
   | . \ (_| | | | | | | | |____| |  | |_| | |_) | |_ 
   |_|\_\__,_|_| |_| |_|_|\_____|_|   \__, | .__/ \__|
                                       __/ | |        
                                      |___/|_|`.green)
    if(process.argv[2] == undefined || process.argv[3] == undefined){
        console.log("Please specify the encrypted image and the password file\nExample: node encrypt .\\my_image.png .\\my_image.png_key.txt")
        process.exit(0)
    }
    console.log("Reading the encrypted image...".yellow)
    const image = await Jimp.read(process.argv[2].toString());
    console.log("Successfully read the encrypted image".green)

    const rgba = image.bitmap.data;

    // get the length of the rgba array
    const length = rgba.length;

    console.log("Read the key file...".yellow)
    const key = await fs.readFileSync(process.argv[3].toString());
    console.log("Successfully read the key file".green)

    // decode the key
    console.log("Deflating the key...".yellow)
    const keyDecoded = zlib.inflateSync(key)
    console.log("Successfully deflated the key".green)

    console.log("Rebuilding the source image...".yellow)
    const keyArray = Array.from(keyDecoded);
    for (let i = 0; i < length; i++) {
        rgba[i] = keyArray[i]
    }
    image.bitmap.data = rgba
    console.log("Successfully rebuilded the source image".green)

    console.log("Writing the decrypted image...".yellow)
    await image.write(process.argv[2].toString()+"_d.jpg")
    console.log("Successfully wrote the decrypted image !".green)

    console.log("Thanks for using this program !".bgMagenta)


}
main()