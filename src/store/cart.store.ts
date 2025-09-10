import {atom} from 'nanostores';

export const itemsInCart = atom<number>(0); // creamos un atomo , una caja con un valor simple que se puede leer , escribir y suscribirte a sus cambios.
