import { component$, useServerData } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export default component$(() => {
  const nonce = useServerData<string | undefined>("nonce");
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <RouterHead />
        <script
          dangerouslySetInnerHTML={`
          if (window.matchMedia("(prefers-color-scheme: dark)").matches &&
            localStorage.theme !== 'winter') {
            localStorage.theme = 'night';
          }

          document.documentElement.dataset.theme = localStorage.theme || 'system';
        `}
        />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister nonce={nonce} />
      </body>
    </QwikCityProvider>
  );
});
