import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="prose mx-auto">
      <h1 class="">
        Hi{" "}
        <span role="img" aria-label="waving hand">
          👋
        </span>
      </h1>

      <p>My name is John and I am a Frontend Developer.</p>
      <p>
        I've been working in this field for 8+ years now, most of this time in
        online agencies, doing various{" "}
        <a href="#projects" class="link">
          projects
        </a>{" "}
        and using a lot of different{" "}
        <a href="#technologies" class="link">
          technologies
        </a>
        .
      </p>
      <h2 id="technologies">Technologies:</h2>
      <ul>
        <li>React / Next.js</li>
        <li>TypeScript</li>
        <li>Tailwind</li>
        <li>tRPC</li>
        <li>Prisma</li>
        <li>GraphQL</li>
        <li>Node.js servers with Express / fastify</li>
        <li>Hosting on Vercel / Cloudflare Pages / Ubuntu</li>
      </ul>
      <p>This list is just an overview, there have been many more.</p>
      <h2 id="projects">Projects:</h2>
      <ul>
        <li>Marketing Landingpages</li>
        <li>Magento Headless Frontends</li>
        <li>SAP Commerce Headless Frontend</li>
        <li>Store Finder</li>
        <li>OpenAI Chat Interface</li>
        <li>
          <a href="https://qwik-news.rackles.io" class="link">
            Hackernews clone
          </a>{" "}
          built with qwik
        </li>
        <p>
          Most of these projects are still online, so if you have questions
          regarding a specific one, please{" "}
          <a href="mailto:contact@rackles.io" class="link link-hover">
            contact
          </a>{" "}
          me.
        </p>
      </ul>
      <h2 id="various">Other skills:</h2>
      <ul>
        <li>Next.js page performance optimizations</li>
        <li>Technical SEO</li>
      </ul>
      <p>
        If this sounds interesting to you, please feel free to{" "}
        <Link href="/contact">contact</Link> me{" "}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "rackles.io | Home",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
