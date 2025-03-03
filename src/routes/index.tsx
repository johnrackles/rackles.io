import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { content } from "~/content/cv-content";

dayjs.extend(relativeTime);

export default component$(() => {
  return (
    <div class="prose mx-auto">
      <h1 class="">
        Hi{" "}
        <span role="img" aria-label="waving hand">
          👋
        </span>
      </h1>

      <p>
        My name is John and I am a Frontend Developer.{" "}
        <a href="mailto:contact@rackles.io" class="link">
          Send me an E-Mail!
        </a>
      </p>
      <p>
        I've been working in this field for{" "}
        {dayjs(new Date("2015")).toNow(true)} years now, most of this time in
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
        {content.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
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
      </ul>
      <p>
        Most of these projects are still online, so if you have questions
        regarding a specific one, please{" "}
        <a href="mailto:contact@rackles.io" class="link-hover link">
          contact
        </a>{" "}
        me.
      </p>
      <h2 id="various">Other skills:</h2>
      <ul>
        <li>Next.js page performance optimizations</li>
        <li>Technical SEO</li>
      </ul>
      <p>
        If this sounds interesting to you, please feel free to{" "}
        <a href="mailto:contact@rackles.io" class="link">
          contact
        </a>{" "}
        me{" "}
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
      content: "John Rackles - Senior Frontend Developer",
    },
  ],
};
