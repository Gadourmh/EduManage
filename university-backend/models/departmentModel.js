import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const DepartmentModel = {
  async getAll() {
    return prisma.department.findMany();
  },

  async getById(id) {
    return prisma.department.findUnique({
      where: { id: parseInt(id) }
    });
  },

  async create(data) {
    return prisma.department.create({
      data
    });
  },

  async update(id, data) {
    return prisma.department.update({
      where: { id: parseInt(id) },
      data
    });
  },

  async delete(id) {
    return prisma.department.delete({
      where: { id: parseInt(id) }
    });
  }
};