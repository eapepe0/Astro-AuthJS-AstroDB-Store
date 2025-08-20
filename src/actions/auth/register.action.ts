import { defineAction } from 'astro:actions';
import { db , User , eq } from 'astro:db';
import { z } from 'astro:schema';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';


export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ name, email, password }, { request }) => {


    // Verificamos que el usuario no existe ya en la base de datos
    const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.email,email))

    /* Si ya existe el usuario */
    if (existingUser.length > 0){
      throw new Error ('El usuario ya esta registrado') // tiramos un error el cual sera capturado por register.astro para hacer un alerta
    }

    /* hasheamos el password  */
    const hashedPassword = bcrypt.hashSync(password , 10);

    /* creamos el usuario */
    await db.insert(User) /* insertamos en la tabla Users , con los valores */
    .values({
      id:UUID(),
      name,
      email,
      password : hashedPassword,
      role: 'user',
      createAt : new Date(),
    });

    /* mostramos mensaje de usuario creado correctamente */
    return {
      ok: true,
      message: "Usuario registrado correctamente",
    };
  },
});
