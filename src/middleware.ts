import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

const notAuthenticatedRoutes = ['/login', '/register'];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect , request }, next) => {
    const session = await getSession(request); /* sacamos la sesion del request */
    const isLoggedIn = !!session; /* si existe sesion es que estamos logeados  */
    const user = session?.user; /* metemos en user , el user de session */

    // TODO:
    locals.isLoggedIn = isLoggedIn; /* decimos que isLoggedIn en locals es igual a isLoggedIn de session */
    locals.user = null; /* creamos en locals un usuario vacio o nulo */
    locals.isAdmin = false; /* siempre vendra pero sera falso hasta que se verifique */

    if (user) {
     
      /* creamos un objeto en locals con estos datos */
      locals.user = {
        email: user?.email!,
        name: user?.name!,
      };
      locals.isAdmin = user?.role === 'admin'; /* preguntamos si es admin ?  true o false */
    }

    // TODO: Eventualmente tenemos que controlar el acceso por roles
    /* si no es administrador y quiere entrar a /dashboard vamos al root */
    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }
    
    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
