import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono();
app.use(cors());

app.get('/notes', (c) => {
  const notes = [
    { id: 1, title: 'Note 1', description: "Tasks for the week: finish the project, prepare the report", tag: "Work", createdAt: "September 20, 2024" },
    { id: 2, title: 'Note 2', description: "Ideas for a new product: user-friendly interface, integration with popular services", tag: "Ideas", createdAt: "September 21, 2024" },
    { id: 3, title: 'Note 3', description: "Shopping list: apples, bread, milk, eggs", tag: "Personal", createdAt: "September 22, 2024" },
    { id: 4, title: 'Note 4', description: "Meeting with the team: discuss project updates and deadlines", tag: "Meeting", createdAt: "September 23, 2024" },
    { id: 5, title: 'Note 5', description: "Books to read: '1984' by George Orwell, 'The Great Gatsby' by F. Scott Fitzgerald", tag: "Reading", createdAt: "September 24, 2024" }
  ];

  return c.json(notes);
})


const port = 3000;
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
