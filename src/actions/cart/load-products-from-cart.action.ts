


import type { CartItem } from "@/interfaces/cart-item";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";
import { z } from 'astro:schema';

// siempre exportamos y definimos la accion
export const loadProductsFromCart = defineAction({
    // el esquema de datos que vamos a recibir
    accept : 'json',
    // función que maneja la acción. Recibe los datos validados como argumento.
    handler: async (_,{cookies}) => {
        // si existe la cookie cart sino como un array vacio
        const cart = JSON.parse(cookies.get('cart')?.value ?? '[]') as CartItem[];
        if(cart.length === 0) return [];

        /* Carga de productos */
        const productsIds = cart.map(item => item.productId); // obtenemos los ids de los productos

        const dbProducts = await db
        .select() // trae todas las columnas seleccionables
        .from(Product) // de Producto
        .innerJoin(ProductImage , eq(Product.id , ProductImage.productId)) // se une con ProductImage , donde el id del Producto sea igual al id del ProductImage
        .where(inArray(Product.id , productsIds));  // filtra los id de Product en los id del carro

        return  cart.map(item => {
                    const dbProduct = dbProducts.find(p => p.Product.id === item.productId);
                    if (!dbProduct){
                        throw new Error(`Product with id ${item.productId} not found`);
                    }
                const {title , price , slug} = dbProduct.Product;
                const image = dbProduct.ProductImage.image;

                return {
                    productId: item.productId,
                    title: title,
                    size : item.size,
                    quantity: item.quantity,
                    image : image.startsWith('http')
                    ? image
                    : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
                    price : price,
                    slug : slug,
                }
            })
        
    },
});