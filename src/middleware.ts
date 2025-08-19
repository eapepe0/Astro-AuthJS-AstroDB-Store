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

    if (isLoggedIn) {
     
      /* creamos un objeto en locals con estos datos */
      locals.user = {
         /* avatar: UserActivation.photoURL ?? '', */
         email: user?.email!,
         name: user?.name!,
         /* emailVerified: user.emailVerified, */
      };
    }

    // TODO: Eventualmente tenemos que controlar el acceso por roles
    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
