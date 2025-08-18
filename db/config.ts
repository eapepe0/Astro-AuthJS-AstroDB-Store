import { column, defineDb, defineTable } from 'astro:db';

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


const Role = defineTable({
  columns : {
    id: column.text({primaryKey : true}),
    name : column.text(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Role
  }
});
