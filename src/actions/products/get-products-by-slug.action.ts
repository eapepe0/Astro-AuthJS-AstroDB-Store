


import { defineAction } from "astro:actions";
import { db, Product , eq, ProductImage} from "astro:db";
import { z } from 'astro:schema';


const newProduct = {
        id :"",
        description : "Nueva descripcion",
        gender : "men|women|unisex",
        price : 0,
        sizes : "XS,S,M,L,XL,XXL",
        slug : "new-product",
        stock : 0,
        tags : "tag1,tag2,tag3",
        title : "Nuevo Producto",
        type : "shirts"
}
// siempre exportamos y definimos la accion
export const getProductBySlug = defineAction({
    // el esquema de datos que vamos a recibir
    accept : 'json',
    input : z.string(),// si no se cumple este esquema lanzara un error
    // función que maneja la acción. Recibe los datos validados como argumento.
    handler: async (slug) => {
        
        // si como slug llega /new , devolvemos un producto nuevo
        if(slug === 'new'){
            return {
                product : newProduct,
                images : []
            }
        }
        /* buscamos el producto por el slug */
        const [product] = await db
            .select()
            .from(Product)
            .where(eq(Product.slug , slug))

        /* si no existe el producto en la db error */
        if(!product){
            throw new Error (`Product with slug ${slug} not found`);
        }

        /* buscamos las imagenes */

        const images = await db
            .select()
            .from(ProductImage)
            .where(eq(ProductImage.productId , product.id))


        return {
            product : product,
            images: images.map((i) => i.image)
        }// retorna esto
    },
});