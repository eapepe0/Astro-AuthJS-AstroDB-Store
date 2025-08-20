import { defineConfig } from 'auth-astro';
import Credentials from '@auth/core/providers/credentials';
import Google from '@auth/core/providers/google';
import { db, eq, User } from 'astro:db';
import bcrypt from 'bcryptjs';
import type { AdapterUser } from '@auth/core/adapters';

export default defineConfig({
  providers: [
    /* Credenciales y su proveedor */
    Credentials({
        /* objeto que define que inputs seran usados como datos */
        credentials: {
            email : {label : 'Correo' , type : 'email'},
            password : {label : 'Contraseña' , type :'password'}
        },
        /* funcion que maneja la logica del login , determina si las credenciales son validas o no */
        authorize: async ({email , password}) => {
            /* buscamos en la tabla User , donde sea igual (eq) el usuario.email al email => esto se guarda en user */
            const [user] = await db.select().from(User).where(eq(User.email ,`${email}`));

            /* si no hay un usuario o no es valido */
            if(!user){
                throw new Error ('User not found')
            }
            /* verificamos la contraseña del usuario */
            /* si la comparacion es incorrecta */
            if(!bcrypt.compareSync(password as string , user.password)){
                throw new Error ('Password incorrecto')
            }

            /* como no podemos retornar el user , por que ahi esta la contraseña tambien y es peligroso , debemos borrarlo */
            const {password :_ , ...rest} =  user; /* desestructuramos con renombrado de usuario , para sacar password del objeto y  retornar lo demas */            
            return rest;
        }
    }),
     Google({
      clientId: import.meta.env.AUTH_GOOGLE_ID,
      clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks : {
    jwt : ({token , user}) => {
        /* si existe el user , lo agregamos al token */
        if(user){
            token.user = user;
        }
        return token; /* jwt siempre devuelve un token de sesion  */
    },
    session : ({session , token}) => {
        session.user = token.user as AdapterUser; /* al no ser del mismo tipo debemos definirlo */
        return session; /* devuelve siempre un session aca es donde agregamos datos a session  */
    }
  }
});