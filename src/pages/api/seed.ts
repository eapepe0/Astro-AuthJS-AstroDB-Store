import { db , Role , User , Product , ProductImage } from 'astro:db';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from './seed-data';
import { sql } from 'astro:db'; // para ejecutar queries crudas


/* Seedeamos remoto */

/* debemos hacer npx astro db push para crear las tablas faltantes en turso */
/* tiene que estarse ejecutando npm run dev --remote o npm run dev:remote */
/* despues si debemos entrar a /api/seed */

// helper para chequear existencia de tabla
async function tableExists(tableName: string) {
  const result = await db.run(sql`
    SELECT name FROM sqlite_master WHERE type='table' AND name=${tableName};
  `);
  return result.rows.length > 0;
}

export async function GET() {
  // 🔎 primero chequeamos qué tablas existen
  const hasProductImage = await tableExists("ProductImage");
  const hasProduct = await tableExists("Product");
  const hasUser = await tableExists("User");
  const hasRole = await tableExists("Role");

  // 🔧 borramos en orden correcto (hijos → padres)
  if (hasProductImage) await db.delete(ProductImage);
  if (hasProduct) await db.delete(Product);
  if (hasUser) await db.delete(User);
  if (hasRole) await db.delete(Role);

  // 👤 Roles base
  const roles = [
    { id: 'admin', name: "Administrador" },
    { id: 'user', name: 'Usuario' }
  ];

  const juanPerez = {
    id: UUID(),
    name: 'Juan Perez',
    email: 'juan.perez@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'admin',
  };

  const juanaPerez = {
    id: UUID(),
    name: 'Juana Perez',
    email: 'juana.perez@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'user',
  };

  if (hasRole) await db.insert(Role).values(roles);
  if (hasUser) await db.insert(User).values([juanPerez, juanaPerez]);

  // 📦 Seed de productos (si la tabla existe)
  if (hasProduct && hasProductImage) {
	const queries : any = []; /* cola */

    seedProducts.forEach((p) => {
      const product = {
        id: UUID(),
        description: p.description,
        gender: p.gender,
        price: p.price,
        sizes: p.sizes.join(','),
        slug: p.slug,
        stock: p.stock,
        tags: p.tags.join(','),
        title: p.title,
        type: p.title,
        user: juanPerez.id,
      };

	  console.log(product)
      queries.push(db.insert(Product).values(product));

      p.images.forEach(img => {
        const image = {
          id: UUID(),
          image: img,
          productId: product.id,
        };
		console.log(product)
        queries.push(db.insert(ProductImage).values(image));
      });
    });

    await db.batch(queries);
  }

  return new Response("🌱 Seed ejecutado correctamente");
}