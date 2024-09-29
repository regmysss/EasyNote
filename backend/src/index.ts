import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client';
import { setCookie, getCookie } from 'hono/cookie';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono();
const prisma = new PrismaClient();
const SESSIONS: { [key: string]: string } = {};

app.use(cors({
  origin: 'http://localhost:5173',
  allowHeaders: ['Content-Type'],
  allowMethods: ['POST', 'GET', 'DELETE'],
  credentials: true
}));

app.get('/auth/check', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);

  const userId = SESSIONS[sessionId];

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (user)
      return c.json({ username: user.username, email: user.email }, 200);
    else
      return c.json({ message: 'User not found' }, 404);
  } catch {
    return c.json({ message: 'Error fetching user' }, 500);
  }
});

app.post('/auth/signup', async (c) => {
  const { username, email, password } = await c.req.json();

  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password
      }
    });

    return c.json({ message: 'User created' }, 201);
  }
  catch (error) {
    return c.json({ message: 'User with this email already exists' });
  }
});

app.post('/auth/signin', async (c) => {
  const { username, password } = await c.req.json();

  const user = await prisma.user.findFirst({
    where: {
      username: username
    }
  });

  if (!user) return c.json({ message: 'User not found' }, 404);

  if (username === user.username && password === user.password) {
    const sessionId = uuidv4();
    SESSIONS[sessionId] = user.id;

    setCookie(c, 'sessionId', sessionId, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 });

    return c.json({ message: 'Logged in successfully' }, 200);
  }
  else
    return c.json({ message: 'Incorrect username or password' }, 400);
});

app.get('/notes', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);

  const userId = SESSIONS[sessionId];

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: userId
      }
    });

    return c.json(notes, 200);
  } catch {
    return c.json({ message: 'Error fetching notes' }, 500);
  }
})

app.post('/notesCreate', async (c) => {
  const sessionId = getCookie(c, 'sessionId');
  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);

  const { title, description, tag } = await c.req.json();

  const userId = SESSIONS[sessionId];

  try {
    const note = await prisma.note.create({
      data: {
        title: title,
        description: description,
        tag: tag,
        userId: userId
      }
    })

    return c.json(note, 201);
  } catch {
    return c.json({ message: 'Error creating note' }, 500);
  }

});

app.delete('/notesDelete/:id', async (c) => {
  const sessionId = getCookie(c, 'sessionId');
  if (!sessionId) return c.json({ message: 'Not authorized' }, { status: 401 });

  const userId = SESSIONS[sessionId];
  const id = c.req.param('id');

  try {
    await prisma.note.delete({
      where: {
        id: id,
        userId: userId
      }
    });

    return c.json({ message: 'Note deleted' }, 200);
  } catch {
    return c.json({ message: 'Error deleting note' }, 500);
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
