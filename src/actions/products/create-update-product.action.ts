import { defineAction } from "astro:actions";
import { db, eq, Product } from "astro:db";
import { z } from 'astro:schema';
import { getSession } from "auth-astro/server";
import {v4 as UUID} from 'uuid'
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
    }),// si no se cumple este esquema lanzara un error
    // función que maneja la acción. Recibe los datos validados como argumento.
    handler: async (form,{request}) => {
        const session = await getSession(request); // obtenemos la sesion desde el context => request
        const user = session?.user; // obtenemos el usuario

        /* si no existe el usuario es que no estamos logueados */
        if(!user){
            throw new Error('Unauthorized')
        }

        const {id = UUID(), ...rest } = form; // en el form no viene el id que crea el producto usamos el UUID y copiamos el resto
        rest.slug = rest.slug.toLowerCase().replaceAll(' ','-').trim(); // del slug del formulario , lo pasamos a miniscula reemplazamos los espacios por guiones

        const product = {
            id : id,
            user : user.id!,
            ...rest,
        };

        console.log(product)
        await db.update(Product).set(product).where(eq(Product.id, id));

        

        return product; // retorna esto
    },
});