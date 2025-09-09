


import type { CartItem } from "@/interfaces/cart-item";
import { defineAction } from "astro:actions";
import { z } from 'astro:schema';

// siempre exportamos y definimos la accion
export const loadProductsFromCart = defineAction({
    // el esquema de datos que vamos a recibir
    accept : 'json',
    // función que maneja la acción. Recibe los datos validados como argumento.
    handler: async (_,{cookies}) => {
        // si existe la cookie cart sino como un array vacio
        const cart = JSON.parse(cookies.get('cart')?.value ?? '[]') as CartItem[];
        console.log(cart)
        if(cart.length === 0) return [];
        return {
            products :cart
        };// retorna esto
    },
});