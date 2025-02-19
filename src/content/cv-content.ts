import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const content = {
  workExperience: [
    {
      company: "brandung",
      position: "Senior Frontend Developer & Solution Architect",
      timeframe: [new Date("2019-04"), new Date("2023-11")],
      description: [
        "Building prototype solutions to test the viability of headless storefronts for SAP Commerce",
        "Concept and implementing solutions for headless storefronts regarding session sharing and cart manipulation",
        "Internal trainings for new technologies, for example Next.js, qwik, React and Typescript",
        "Hosting the Next.js Berlin Meetup and giving a talk at the event regarding the viability of Next.js in an E-Commerce setting",
        "Implementing a ChatGPT powered chat interface for healthcare providers",
        "Technical SEO Optimization of E-Commerce pages",
        "Next.js page performance optimization",
      ],
    },
    {
      company: "brandung",
      position: "Frontend Developer",
      timeframe: [new Date("2016-11"), new Date("2019-04")],
      description: [
        "Creating Headless E-Commerce solutions for Magento with Next.js",
        "Building Marketing websites for a wide variety of customers with headless CMS like Contenful and Storyblok, using React or Next.js",
        "Hosting internal trainings for the Frontend team regarding React and Next.js",
        "Concept and building store finder web apps, using React and GraphQL, including a data importer and other server side tools",
        "Headless relaunches of existing customer websites",
      ],
    },
    {
      company: "Plan-M",
      position: "Frontend Developer",
      timeframe: [new Date("2014"), new Date("2016")],
      description: [
        "Static websites with HTML & CSS",
        "Online radio administration platform with file upload built in Meteor.js with React",
      ],
    },
  ],
  education: [
    {
      position: "Staatlich geprüfter Mediengestalter Digital / Print",
      company: "Mediadesign University of Applied Sciences",
      timeframe: [new Date("2011"), new Date("2014")],
    },
  ],
  technologies: [
    `React (${dayjs(new Date("2015")).toNow(true)}) / Next.js (${dayjs(
      new Date("2019"),
    ).toNow(true)})`,
    `Vue (${dayjs(new Date("2024")).toNow(true)}) / Nuxt (${dayjs(
      new Date("2024"),
    ).toNow(true)})`,
    `TypeScript (${dayjs(new Date("2019")).toNow(true)})`,
    `Node.js servers with Express / fastify (${dayjs(new Date("2019")).toNow(
      true,
    )})`,
    `GraphQL (${dayjs(new Date("2019")).toNow(true)})`,
    `Tailwind (${dayjs(new Date("2020")).toNow(true)})`,
    `tRPC (${dayjs(new Date("2020")).toNow(true)})`,
    `Prisma (${dayjs(new Date("2020")).toNow(true)})`,
    "Hosting on Vercel / Cloudflare Pages / Ubuntu",
  ],
} as const;
