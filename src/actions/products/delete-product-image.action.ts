


import { ImageUpload } from "@/utils/image-upload";
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";
import { z } from 'astro:schema';
import { getSession } from "auth-astro/server";

// siempre exportamos y definimos la accion
export const deleteProductImage = defineAction({
    // el esquema de datos que vamos a recibir
    accept : 'json',
    input : z.string(),// si no se cumple este esquema lanzara un error
    // función que maneja la acción. Recibe los datos validados como argumento.
    handler: async (imageId,{request}) => {
        console.log("hola")
        // solamente usuarios con permisos
        const session = await getSession(request)
        const user = session?.user;

        // si no estamos autorizados
        if(!user){
            throw new Error('Unauthorized')
        }
        // buscamos el imageId en la base de datos de ProductImage
        const [productImage] = await db.select().from(ProductImage).where(eq(ProductImage.id , imageId));

        // si no la encontramos 
        if(!productImage){
            throw new Error (`image with id ${imageId} not found`);
        }

        // borramos de la db
        const deleted = await db.delete(ProductImage).where(eq(ProductImage.id , imageId))

        // si en el filename es una url
        if(productImage.image.includes('http')){
            // borramos a la imagen en cloudinary tambien
            await ImageUpload.delete(productImage.image)
        }

        return {ok : true };// retorna esto
    },
});