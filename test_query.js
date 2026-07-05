const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');
const schema = require('./lib/schema');

let connectionString = '';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
  if (match) connectionString = match[1];
} catch (e) {}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
  try {
    const serviceCats = await db.select().from(schema.serviceCategories);
    const blogCats = await db.select().from(schema.blogCategories);
    const services = await db.select().from(schema.services);
    const blogs = await db.select().from(schema.blogs);
    const servicesCategories = await db.select().from(schema.servicesCategories);
    const blogsCategories = await db.select().from(schema.blogsCategories);

    console.log("SUCCESS!");
    console.log("Service Categories:", serviceCats.length);
    console.log("Blog Categories:", blogCats.length);
    console.log("Services:", services.length);
    console.log("Blogs:", blogs.length);
    console.log("Services-Categories Links:", servicesCategories.length);
    console.log("Blogs-Categories Links:", blogsCategories.length);
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await client.end();
  }
}
main();
