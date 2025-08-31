/* se encargara del manejo del carro y las cookies */

import type { CartItem } from "@/interfaces/cart-item";
import Cookies from "js-cookie";

export class CartCookiesClient{
    /* buscamos el carro */
    static getCart(): CartItem[]{
        return JSON.parse( Cookies.get('cart') ?? '[]'); /* buscamos las cookies llamandas 'cart' si no existen devolvemos un array vacio */
    }
    /* agregamos un item al carro */
    static addItem( cartItem : CartItem ): CartItem[]{
        const cart = CartCookiesClient.getCart(); /* obtenemos le carro */
        /* buscamos si el item ya existe en el carro y es con el mismo tamaño  */
        const itemInCart = cart.find((item) =>  item.productId === cartItem.productId && item.size === cartItem.size) 

        if(itemInCart){
            itemInCart.quantity += cartItem.quantity; /* le sumamos la cantidad a la cantidad que ya teniamos */
        }else{
            cart.push(cartItem) /* mandamos al carro el nuevo item */
        }

        Cookies.set('cart', JSON.stringify(cart)) /* mandamos el carro a la cookie */
        return cart;
    }
    /* removemos un item del carro */
    static removeItem(productId : string , size : string): CartItem[]{
        const cart = CartCookiesClient.getCart(); /* obtenemos le carro */
        const updatedCart = cart.filter((item) => !(item.productId === productId && item.size === size))

        console.log(updatedCart)
        
        Cookies.set('cart', JSON.stringify(cart));

        return updatedCart;
    }
}