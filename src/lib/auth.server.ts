import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const signupUserDb = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { username: string; email: string; password: string }) => data
  )
  .handler(async ({ data }) => {
    const username = data.username.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (!username || !email || !password) {
      return { success: false, message: "Missing fields" };
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return { success: true, user };
  });

export const loginUserDb = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { success: false, message: "Invalid email or password" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  });

export const getUsersDb = createServerFn({ method: "GET" }).handler(
  async () => {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return users;
  }
);

export const loginAdminDb = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
      },
    });

    if (!admin) {
      return {
        success: false,
        message: "Invalid admin credentials",
      };
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return {
        success: false,
        message: "Invalid admin credentials",
      };
    }

    const token = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

await (prisma as any).adminSession.create({
      data: {
        adminId: admin.id,
        token,
        expiresAt,
      },
    });

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  });

  export const verifyAdminSessionDb = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) {
      return {
        valid: false,
      };
    }

    const session = await (prisma as any).adminSession.findUnique({
      where: {
        token: data.token,
      },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!session) {
      return {
        valid: false,
      };
    }

    if (session.expiresAt < new Date()) {
      await (prisma as any).adminSession.delete({
        where: {
          id: session.id,
        },
      });

      return {
        valid: false,
      };
    }

    return {
      valid: true,
      admin: session.admin,
    };
  });