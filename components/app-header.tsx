import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { SignOut } from "@/components/sign-out";

/**
 * The signed-in topbar. Same lockup and quiet links as the landing page's
 * `.topbar`, so moving from `/` into the app doesn't feel like a new site.
 */
export function AppHeader({ showNav = true }: { showNav?: boolean }) {
  return (
    <header className="app-wrap app-topbar">
      <Link className="app-brand" href="/">
        <BrandMark width={22} height={24} />
        Honeycomb
      </Link>
      {showNav ? (
        <nav className="app-nav">
          <Link href="/library">My library</Link>
          <Link href="/new">Start a circle</Link>
          <SignOut />
        </nav>
      ) : null}
    </header>
  );
}
