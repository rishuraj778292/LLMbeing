import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINIARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;
        // upload file on cloudinary
        const uploadResult = await cloudinary.uploader
            .upload(
                'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
                public_id: 'shoes',
            })
         // file has been uploaded successfully 
         console.log("file is uploaded on cloudinary",uploadResult.url);
         return response;
    }
    catch (err) {
        fs.unlinkSync(localfilepath) // remove the locally  saved temporary file as the upload operation got failed

        return null;
    }
}





// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });

// console.log(autoCropUrl);    