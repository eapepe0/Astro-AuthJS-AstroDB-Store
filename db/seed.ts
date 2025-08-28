import { db , Role , User , Product , ProductImage } from 'astro:db';
import {v4 as UUID} from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from 'db/seed-data';

// https://astro.build/db/seed
export default async function seed(){
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

	const queries : any = []; /* cola */

	/* recorremos el objeto seedProducts de seed-data donde estan los productos */
	/* crearemos un product , con los valores y generaremos una query para insertarlo en la base de datos */
	/* crearemos un image , con los valores del producto y generaremos una query para insertarlo en la DB */
	/* Lo bueno de Batch Transactions es que  son una forma de agrupar varias acciones en una sola operación */
	/* en lugar de ejecutar tres acciones independientes que actualizan la base de datos (crear usuario, crear perfil, asignar rol),  */
	/* podés enviarlas como un lote. Si alguna falla, todas se revierten automáticamente, manteniendo los datos consistentes. */


	seedProducts.forEach ((p) => {

		/* creamos el objeto producto */
		const product = {
			id : UUID(), /* creamos un id unico para cada producto */
			description : p.description,
			gender : p.gender ,
			price : p.price ,
			sizes : p.sizes.join(',') ,
			slug : p.slug ,
			stock : p.stock ,
			tags : p.tags.join(',') ,
			title : p.title ,
			type : p.title ,
			user: juanPerez.id, /* usuario administrador */
		};

		/* creamos la query de los productos*/

		queries.push(db.insert(Product).values(product));

		p.images.forEach(img => {
			const image = {
				id : UUID(),
				image : img,
				productId : product.id,
			}
			/* crearemos la query de productImage */
			queries.push(db.insert(ProductImage).values(image))
		})
	})

	await db.batch(queries);
	
	return new Response("🌱 Seed ejecutado correctamente");

}
