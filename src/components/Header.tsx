import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

export const Header = component$(() => {
  return (
    <header class="navbar bg-primary text-primary-content">
      <div class="flex-1">
        <Link href="/" class="btn-ghost btn text-xl normal-case text-white">
          rackles.io
        </Link>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a href="mailto:contact@rackles.io">Contact</a>
          </li>
        </ul>
      </div>
    </header>
  )
})
