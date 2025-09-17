import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({ 
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME, 
    api_key: import.meta.env.CLOUDINARY_API_KEY, 
    api_secret: import.meta.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});




export class ImageUpload{

    static async uploadImage(file : File){       // recibimos un File de un input

        const buffer = await file.arrayBuffer(); //  convertimos el file a un array binario
        const base64Image = Buffer.from(buffer).toString('base64'); // creamos un Buffer de Node con ese buffer y lo pasamos a base64
        const imageType = file.type.split('/')[1] // image/png  extraemos el png

        const resp = await cloudinary.uploader.upload(`data:image/${imageType};base64,${base64Image}`,{folder : 'AstroStore'}); // enviamos los datos a cloudinary
        
        return resp.secure_url // devolvemos la url de la o las imagenes subidas
    }

}