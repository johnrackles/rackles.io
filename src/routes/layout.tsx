import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import "@fontsource-variable/recursive/mono.css";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <Header />
      <main class="font-recursive container mx-auto px-4 py-8 md:px-8 md:py-16 lg:px-16 lg:py-32">
        <Slot />
      </main>
      <Footer />
    </div>
  );
});
