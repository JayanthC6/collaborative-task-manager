import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthRepository {
    async createUser(email: string, hashedPassword: string, name: string): Promise<User> {
        return prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async getAllUsers(): Promise<Omit<User, 'password'>[]> {
        return prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
