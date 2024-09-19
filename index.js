require('dotenv').config(); // Load environment variables
const OpenAI = require('openai');
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
async function saveDataToFile(data,fileName) {
    try {
        const jsonData = JSON.stringify(data, null, 2); // The 'null, 2' adds indentation to make the file more readable

        fs.writeFileSync(fileName+'.json', jsonData);

    } catch (error) {
        console.error('Error writing data to file:', error);
    }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, so you can omit this line if you want
});

async function generateResponse(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or "gpt-4" if you have access
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API error:', error.message);
        return null;
    }
}

async function start (){
    // const imageAn = await analyzeImage("images.png")
    const imageAn = await analyzeImage("air-force.jpg")
    
    saveDataToFile(imageAn,"data");
    
    // Extract information from image analysis
    const labels = imageAn.labeldetection[0].labelAnnotations.map(label => label.description).join(", ");
    const logos = imageAn.logoDetection[0].logoAnnotations.map(logo => logo.description).join(", ");
    
    // Extract dominant colors
    const dominantColors = imageAn.imageProps[0].imagePropertiesAnnotation.dominantColors.colors
      .slice(0, 3)  // Get top 3 dominant colors
      .map(color => `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`)
      .join(", ");

    const prompt = `Create a product description for an item with the following characteristics:
      Labels: ${labels}
      Logos: ${logos}
      Dominant Colors: ${dominantColors}
      Please incorporate the color information into the description.`;

    const description = await generateResponse(prompt);
    console.log("Generated Description:", description);

    // Save the description to a file
    saveDataToFile({ description }, "productDescription");
};

start();