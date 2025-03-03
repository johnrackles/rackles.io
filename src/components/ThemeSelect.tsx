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
  // eslint-disable-next-line qwik/no-use-visible-task
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
    <div class="flex flex-row items-center">
      <button
        onClick$={() => {
          theme.value = "winter";
        }}
      >
        <span
          role="img"
          aria-label="Sun with a face, used to select light mode"
        >
          🌞
        </span>
      </button>{" "}
      <label for="theme-select" class="sr-only">
        Toggle Darkmode
      </label>
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
        <span
          role="img"
          aria-label="Moon with a face, used to select dark mode"
        >
          🌚
        </span>
      </button>
    </div>
  );
});
