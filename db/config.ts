import { column, defineDb, defineTable } from 'astro:db';


const Role = defineTable({
  columns : {
    id: column.text({primaryKey : true}),
    name : column.text(),
  }
})

/* definimos una tabla llamada User */
const User = defineTable({
  columns : {
    id : column.text({primaryKey: true , unique : true}), /* el id sera unico ,  */
    name : column.text(),  /* nombre sera texto */
    email : column.text({unique : true}), /* email sera un texto unico */
    password : column.text(), /* password texto */
    createAt :  column.date({default : new Date()}), /* sera una fecha que por defecto sera la fecha de creacion */
    role :  column.text({ references : () => Role.columns.id}), /* relacionamos rol que sera un texto con la tabla Rol ==> id  */
  }
})



/* definimos nuestra tabla llama Productos */
const Product = defineTable({
  columns:{
    id: column.text({primaryKey : true}),
    description: column.text(),
    gender : column.text(),
    price : column.number(),
    sizes : column.text(),
    slug : column.text({unique: true}),
    stock : column.number(),
    tags: column.text(),
    title : column.text(),
    type: column.text(),

    /* relacion con otra tabla , Usuario */
    user : column.text({references : () => User.columns.id })
  }
})


/* definimos nuestra tabla de Imagenes de Productos */

const ProductImage = defineTable({
  columns:{
    id: column.text({primaryKey : true}),
    /* relacion con tabla Producto */
    productId : column.text({references : () => Product.columns.id}),
    image : column.text(),
  }
})
// https://astro.build/db/config
export default defineDb({
  tables: {
    Role,
    User,
    Product,
    ProductImage
  }
});
