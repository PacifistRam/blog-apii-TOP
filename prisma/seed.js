const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    const alice = await prisma.user.upsert({
      where: { email: "alice@mail.com" },
      update: {},
      create: {
        email: "alice@mail.com",
        name: "Alice",
        password: "myPassword",
        role: "author",
        posts: {
          create: [
            {
              title:"Why My Coffee Machine is the Most Reliable Relationship in My Life",
              content:"Some days, the only thing brewing consistently is my caffeine addiction. At least my coffee machine doesn't ghost me.",
              published: true,
            },
          ],
        },
      },
    });
    const bob = await prisma.user.upsert({
      where: { email: "bob@mail.com" },
      update: {},
      create: {
        email: "bob@mail.com",
        name: "Bob",
        password: "myPassword",
        role: "author",
        posts: {
          create: [
            {
              title:
                "The Art of Pretending to Work While Perfecting My Internet Browsing Skills",
              content:
                "It’s amazing how many new productivity hacks I discover when I’m actually not working. My computer’s history is proof.",
              published: true,
            },
          ],
        },
      },
    });
    
    
    const john = await prisma.user.upsert({
        where:{email: 'john@mail.com'},
        update:{},
        create:{
            email: 'john@mail.com',
            name:'John',
            password: 'myPassword',
            role: 'author',
            posts: {
                create:[
                    {
                        title: 'Why My Plants Are the Only Ones Who Appreciate My \'Green Thumb\' Decor',
                content:'I water them, talk to them, and still, they give me nothing but green, unenthusiastic leaves. At least they’re consistent.',
                published: false,
                    },
                    {
                        title: 'How My Gym Membership and I Are in a Long-Distance Relationship',
                content:'I pay monthly, it takes my money without complaint, and we only meet when I feel guilty enough. True love, indeed.',
                published: false,
                    }
                ]
                
                
            }
        }
    })
    console.log({ alice, bob, john})
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })