import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Header = component$(() => {
  return (
    <div class="navbar bg-primary text-primary-content">
      <Link href="/" class="btn btn-ghost normal-case text-xl">
        rackles.io
      </Link>
    </div>
  );
});
