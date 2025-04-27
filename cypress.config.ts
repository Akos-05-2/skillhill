import { defineConfig } from 'cypress';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async prismaDeleteEnrollment({ where }) {
          await prisma.enrollment.deleteMany({ where });
          return null;
        }
      });
    },
    baseUrl: 'http://localhost:3000',
    supportFile: false
  }
}); 