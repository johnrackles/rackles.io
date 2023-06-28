import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";

export const THEME_KEY = "theme";
export const themes = ["night", "winter"] as const;

export default component$(() => {
  const theme = useSignal<"night" | "winter" | undefined>();

  // on render, set the theme to the value in localStorage
  useVisibleTask$(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme && themes.includes(storedTheme as any)) {
      theme.value = storedTheme as (typeof themes)[number];
    }
  });

  useTask$(({ track }) => {
    const change = track(() => theme.value);

    if (isServer) {
      return; // Server guard
    }

    if (!change) return;

    localStorage.setItem(THEME_KEY, change);
    document.documentElement.dataset.theme = change;
  });

  return (
    <div aria-hidden class="flex flex-row items-center">
      <button
        onClick$={() => {
          theme.value = "winter";
        }}
      >
        🌞
      </button>{" "}
      <input
        type="checkbox"
        class="toggle mx-2"
        id="theme-select"
        checked={theme.value === "night"}
        onInput$={(_event, element) => {
          theme.value = element.checked ? "night" : "winter";
        }}
      />{" "}
      <button
        onClick$={() => {
          theme.value = "night";
        }}
      >
        🌚
      </button>
    </div>
  );
});
