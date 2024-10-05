import { PrismaClient } from "@prisma/client";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import bcrypt from "bcrypt";
import { Hono } from "hono";
import { isSessionExists } from "../utils/isSessionExists";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const authRoutes = (app: Hono) => {
    const prisma = new PrismaClient();

    app.get('/auth/check', async (c) => {
        const userId = await isSessionExists(c);

        if (!userId) return c.json({ authorized: false }, 401);

        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                }
            });

            if (!user) return c.json({ authorized: false }, 401);

            return c.json({ username: user.username, email: user.email, avatar: user.avatar }, 200);
        } catch {
            return c.json({ authorized: false }, 500);
        }
    });

    app.post('/auth/signin', async (c) => {
        const { username, password } = await c.req.json();

        try {
            const user = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });

            if (!user) return c.json({ message: 'User not found' }, 404);

            const match = await bcrypt.compare(password, user.password);
            if (!match) return c.json({ message: 'Incorrect username or password' }, 400);

            const session = await prisma.session.create({
                data: {
                    userId: user.id
                }
            });

            setCookie(c, 'sessionId', session.id, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 });

            return c.json({ email: user.email, avatar: user.avatar }, 200);
        } catch (error) {
            console.error(error);
            return c.json({ message: 'Error signing in' }, 500);
        }
    });

    app.post('/auth/signup', async (c) => {
        const { username, email, password, avatar } = await c.req.json();

        try {
            const hashedPassword = await bcrypt.hash(password, 10);


            await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword,
                    avatar: avatar
                }
            });

            return c.json({ message: 'User created' }, 201);
        } catch (error) {
            console.error(error);

            if (error instanceof PrismaClientKnownRequestError)
                if (error.code === 'P2002')
                    return c.json({ message: 'Username or email already exists' }, 400);


            return c.json({ message: 'Error signing up' }, 500);
        }
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
        const userId = await isSessionExists(c);

        if (!userId) return c.json({ message: 'Not authorized' }, 401);

        const { username } = await c.req.json();

        try {
            await prisma.user.update({
                where: {
                    id: userId
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
        const userId = await isSessionExists(c);
        if (!userId) return c.json({ message: 'Not authorized' }, 401);
        const { email } = await c.req.json();

        try {
            await prisma.user.update({
                where: {
                    id: userId
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

    app.post('/auth/update/password', async (c) => {
        const userId = await isSessionExists(c);

        if (!userId) return c.json({ message: 'Not authorized' }, 401);

        const { oldPassword, newPassword } = await c.req.json();

        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                }
            });

            if (!user) return c.json({ message: 'User not found' }, 404);

            const match = await bcrypt.compare(oldPassword, user.password);
            if (!match) return c.json({ message: 'Incorrect password' }, 400);

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    password: hashedPassword
                }
            });

            return c.json({ message: 'Password updated' }, 200);
        } catch (error) {
            console.error(error);
            return c.json({ message: 'Error updating password' }, 500);
        }
    });

    app.delete('/auth/delete', async (c) => {
        const userId = await isSessionExists(c);

        if (!userId) return c.json({ message: 'Not authorized' }, 401);

        try {
            await prisma.user.delete({
                where: {
                    id: userId
                }
            });

            deleteCookie(c, 'sessionId');

            return c.json({ message: 'Account deleted' }, 200);
        } catch (error) {
            console.error(error);
            return c.json({ message: 'Error deleting account' }, 500);
        }
    });
}