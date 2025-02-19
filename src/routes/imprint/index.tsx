import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="prose mx-auto">
      <h1>Impressum</h1>
      <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
      <p>
        Johannes Rackles
        <br />
        Colbestr 25
        <br />
        10247 Berlin
      </p>
      <h2>Kontakt</h2>
      <p>
        <br />
        E-Mail: contact@rackles.io
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "rackles.io | Imprint",
  meta: [{ name: "description", content: "Contact John Rackles" }],
};
