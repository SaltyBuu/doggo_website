const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//TODO setup CI
async function main() {
  await prisma.user.create({
    data: {
      login: 'Alice',
      password: 'azerty',
      mail: 'alice@prisma.io',
    },
  });
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
