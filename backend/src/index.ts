import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';

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

  if (!sessionId) return c.json({ authorized: false }, 401);

  const userId = SESSIONS[sessionId];

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (user)
      return c.json({ username: user.username, email: user.email, avatar: user.avatar }, 200);
    else
      return c.json({ authorized: false }, 404);
  } catch {
    return c.json({ authorized: false }, 500);
  }
});

app.post('/auth/signup', async (c) => {
  const { username, email, password, avatar } = await c.req.json();

  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password,
        avatar: avatar
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
    const sessionId = await prisma.session.create({
      data: {
        userId: user.id
      }
    });

    setCookie(c, 'sessionId', sessionId.id, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 });

    return c.json({ email: user.email, avatar: user.avatar }, 200);
  }
  else
    return c.json({ message: 'Incorrect username or password' }, 400);
});

app.get('/auth/signout', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);

  try {
    await prisma.session.delete({
      where: {
        id: sessionId
      }
    });

    deleteCookie(c, 'sessionId');

    return c.json({ message: 'Signed out' }, 200);
  } catch {
    return c.json({ message: 'Error signing out' }, 500);
  }
});

app.post('/auth/update/username', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);
  const { username } = await c.req.json();

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId
    }
  });

  try {
    await prisma.user.update({
      where: {
        id: session!.userId
      },
      data: {
        username: username
      }
    });

    return c.json({ message: 'Username updated' }, 200);
  } catch {
    return c.json({ message: 'Error updating username' }, 500);
  }
});

app.post('/auth/update/email', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);
  const { email } = await c.req.json();

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId
    }
  });

  try {
    await prisma.user.update({
      where: {
        id: session!.userId
      },
      data: {
        email: email
      }
    });

    return c.json({ message: 'Email updated' }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error updating email' }, 500);
  }
});

app.delete('/auth/delete', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId
    }
  });

  try {
    await prisma.user.delete({
      where: {
        id: session!.userId
      }
    });

    deleteCookie(c, 'sessionId');

    return c.json({ message: 'Account deleted' }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error deleting account' }, 500);
  }
});

app.get('/notes', async (c) => {
  const sessionId = getCookie(c, 'sessionId');

  if (!sessionId) return c.json({ message: 'Not authorized' }, 401);

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId
    }
  });

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: session!.userId
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

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId
    }
  });

  try {
    const note = await prisma.note.create({
      data: {
        title: title,
        description: description,
        tag: tag,
        userId: session!.userId
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

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId
    }
  });

  const id = c.req.param('id');

  try {
    await prisma.note.delete({
      where: {
        id: id,
        userId: session!.userId
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
