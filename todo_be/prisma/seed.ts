/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from 'src/common/prisma/prisma.service';
import { hash } from 'argon2';

const prisma = new PrismaService();

async function main() {
  const password = await hash('123456');

  const user = await prisma.user.upsert({
    where: { email: 'owner@test.com' },
    update: {},
    create: {
      email: 'owner@test.com',
      password,
      name: 'Owner',
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Workspace',
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });

  await prisma.project.create({
    data: {
      name: 'Demo Project',
      workspaceId: workspace.id,
    },
  });
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
