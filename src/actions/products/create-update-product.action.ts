import { defineAction } from "astro:actions";
import { db, eq, Product } from "astro:db";
import { z } from 'astro:schema';
import { getSession } from "auth-astro/server";
import {v4 as UUID} from 'uuid'

const MAX_FILE_SIZE = 5_000_000 ; // 5 MB

const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
]

// siempre exportamos y definimos la accion
export const createUpdateProduct = defineAction({
    // el esquema de datos que vamos a recibir un form
    accept : 'form',
    input : z.object({
        id : z.string().optional(),
        description : z.string(),
        gender : z.string(),
        price : z.number(),
        sizes : z.string(),
        slug : z.string(),
        stock : z.number(),
        tags : z.string(),
        title : z.string(),
        type : z.string(),
        // TODO imagen
        
        imageFiles : z.array( /* recibimos un array */
            z.instanceof(File) // que sea un archivo
            .refine((file) => file.size <= MAX_FILE_SIZE, 'Max image size 5MB' ) // como maximo 5mb
            .refine((file) => { // Si el archivo es de los tipos aceptados
                return ACCEPTED_IMAGE_TYPES.includes(file.type)
            }, `Only supported image files are valid , ${ACCEPTED_IMAGE_TYPES.join(',')}`)
        ).optional(),
    }),// si no se cumple este esquema lanzara un error
    // función que maneja la acción. Recibe los datos validados como argumento.
    handler: async (form,{request}) => {
        const session = await getSession(request); // obtenemos la sesion desde el context => request
        const user = session?.user; // obtenemos el usuario

        /* si no existe el usuario es que no estamos logueados */
        if(!user){
            throw new Error('Unauthorized')
        }

        console.log('Llegamos hasta aca')
        const {id = UUID(), imageFiles,...rest } = form; // en el form no viene el id que crea el producto usamos el UUID y copiamos el resto
        rest.slug = rest.slug.toLowerCase().replaceAll(' ','-').trim(); // del slug del formulario , lo pasamos a miniscula reemplazamos los espacios por guiones

        const product = {
            id : id,
            user : user.id!,
            ...rest,
        };

        console.log(product)

        // si el form.id no existe o es undefined , por que es un producto nuevo , no se genero el producto , es del form no el id = UUID
        if(!form.id ){
            await db.insert(Product).values(product);  // insertamos el producto en la db
        } else{ // si ya existe el producto
            await db.update(Product).set(product).where(eq(Product.id, id)); // actualizamos
        }
        
        // Imagenes
        console.log("🚀 ~ :72 ~ imageFiles:", {imageFiles})

        return product; // retorna esto
    },
});
