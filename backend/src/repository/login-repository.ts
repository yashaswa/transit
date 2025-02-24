import { PrismaClient } from '@prisma/client';

class LoginRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser({ name, email }: { name: string; email: string }) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}

export default LoginRepository;
