const vision = require('@google-cloud/vision');

console.log("ok")

async function analyzeImage (image){
    try{
        const client = new vision.ImageAnnotatorClient({
            keyFilename:"../../../key.json"   //change path(add file)
        });
        console.log("ok")
        // example of a specific thing to look for:
        const labeldetection = await client.labelDetection(image); 
        return {labeldetection};
    }catch(error){
        console.error("error:",error);
    }

} 
(async () => {
    const imageAn = await analyzeImage("images.png")
    console.log(imageAn);
} )