import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  const users: Prisma.UserCreateInput[] = [
    {
      login: 'Alice',
      password: 'password',
    },
    {
      login: 'Elsa',
      password: 'qwerty',
    },
  ];

  await Promise.all(
    users.map(async (user) => {
      await prisma.user.create({
        data: user,
      });
    }),
  );
}

// TODO: seed other tables

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
