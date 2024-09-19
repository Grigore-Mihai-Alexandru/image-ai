const vision = require('@google-cloud/vision');
const fs = require("fs");


async function analyzeImage (image){
    try{
        const client = new vision.ImageAnnotatorClient({
            keyFilename:"../../../keyy.json"   //change path(add file)
        });

        // example of a specific thing to look for:
        const labeldetection = await client.labelDetection(image); 
        const logoDetection = await client.logoDetection(image); 
        const imageProps = await client.imageProperties(image);
        return {labeldetection, logoDetection, imageProps};
    }catch(error){
        console.error("error:",error);
    }

} 
async function saveDataToFile(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2); // The 'null, 2' adds indentation to make the file more readable
  
      fs.writeFileSync('data.json', jsonData);
  
    } catch (error) {
      console.error('Error writing data to file:', error);
    }
  }
async function start (){
    const imageAn = await analyzeImage("images.png")
    
    saveDataToFile(imageAn);
}

start();