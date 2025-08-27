import { db , Role , User , Product , ProductImage } from 'astro:db';
import {v4 as UUID} from 'uuid';
import bcrypt from 'bcryptjs';

// https://astro.build/db/seed
export async function GET() {
	const roles = [
		{id : 'admin' , name : "Administrador"},
		{id : 'user' , name : 'Usuario'}
	];

	const juanPerez = {
		id : UUID(),
		name : 'Juan Perez',
		email : 'juan.perez@google.com',
		password : bcrypt.hashSync('123456'),
		role : 'admin',
	}

	const juanaPerez = {
		id : UUID(),
		name : 'Juana Perez',
		email : 'juana.perez@google.com',
		password : bcrypt.hashSync('123456'),
		role : 'user',
	}



	await db.insert(Role).values(roles); /* insertamos en nuestra tabla Role , los valores de roles */
	await db.insert(User).values([juanPerez , juanaPerez]); /* insertamos en nuestra tabla User , los valores de juanPerez y juanaPerez */

	return new Response("🌱 Seed ejecutado correctamente");

}
