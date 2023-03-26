const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//TODO setup CI
async function main() {
  await prisma.user.create({
    data: {
      login: "Henri",
      password: "testastotestato",
      mail: "henri@hihan.io",
    },
  });
  await prisma.user.create({
    data: {
      login: "Jess",
      password: "testastotestato",
      mail: "jess@hihan.io",
    },
  });
  await prisma.playlist.create({
    data: {
      name: "Chill playlist",
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
