import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllUsers = async (role) => {
  if (!role) {
    return await prisma.user.findMany();
  }

  return await prisma.user.findMany({
    where: { role },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id: Number(id) } });
};

export const createUser = async (data) => {
  return await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: data.password, // ⚠️ Hasher avec bcrypt en prod
      role: data.role
    }
  });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: data
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id: Number(id) } });
};
