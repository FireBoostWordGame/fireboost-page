import PrismaService from "@/services/prisma";

export const SEPARATOR_UPDATE_USER = "--";
export const dbInstance = new PrismaService().db;
