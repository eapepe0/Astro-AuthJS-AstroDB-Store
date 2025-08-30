


import type { ProductWithImages } from "@/interfaces/product-with-images.interface";
import { defineAction } from "astro:actions";
import { count, db, Product, ProductImage, sql } from "astro:db";
import { z } from 'astro:schema';

// siempre exportamos y definimos la accion
export const getProductsByPage = defineAction({
    // el esquema de datos que vamos a recibir
    accept : 'json',
    input : z.object({
        page: z.number().optional().default(1), /* pagina que es un numero opcional y por defecto un 1 */
        limit: z.number().optional().default(12) /* limite que es un opcional , que por defecto es 12 */
    }),//> si no se cumple este esquema lanzara un error

    //! función que maneja la acción. Recibe los datos validados como argumento.
    handler: async ({page,  limit}) => {

        page = page <= 0 ? 1 : page; /* la pagina sera como minimo 1 (no puede ser 0 o numero negativo) */

        const [totalRecords] = await db.select({count : count()}).from(Product); /* hacemos una consulta a la db , donde contamos la cantidad de productos */
        const totalPages = Math.ceil(totalRecords.count / limit); /* hacemos la cuenta de la cantidad de productos dividido la cantidad de productos que queremos mostrar */

        // si la pagina es mas grande que las paginas totales
        if(page > totalPages){
            //! devolvemos un arreglo vacio de productos 
            return {
                products : [] as ProductWithImages[],
                totalPages : totalPages
            }
        }
        //> hacemos la consulta a la db

        /* const products = await db */
        /* .select() */
        /* .from(Product)  *//* seleccionamos de la tabla productos */
        /* .limit(limit) */ /* cuantos productos = 12  */
        /* .offset((page - 1) * limit ); */ /* desde donde = si pagina es 1 = (1-1 = 0) * 12 = 0  | si la pagina es 2 = (2 - 1 = 1) * 12 = 12 desde el registro 13*/

        const productsQuery = sql`
        select a.*,
            ( select GROUP_CONCAT(image,',') from 
	            ( select * from ${ProductImage} where productId = a.id limit 2 )
            ) as images
            from ${Product} a
            LIMIT ${limit} OFFSET ${(page - 1 ) * limit };
        `

        const {rows} = await db.run(productsQuery); // ejecutamos la query y los resultados los tenemos en row


        return {
           products : rows as unknown as ProductWithImages[] , 
            totalPages : totalPages
        };// retorna esto
    },
});