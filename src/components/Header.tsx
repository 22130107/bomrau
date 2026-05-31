import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const session = await getSession();
  const isLoggedIn = !!session;
  const displayName = session?.displayName || session?.username;
  // Keep username for backward compat
  const username = displayName;
  const role = session?.role;

  // Username luôn dẫn về profile — dashboard có link riêng trong nav
  const dashboardHref = role === "admin" ? "/admin" : role === "npp" ? "/npp" : null;

  return (
    <header className="border-b fixed w-full left-0 top-0 bg-[rgb(15,23,42)] z-[2506] border-b-[rgba(254,226,226,0.5)]">
      <div className="mx-auto w-full max-w-[1200px] px-[14px]">
        <div className="items-center flex w-full h-[60px] md:h-[80px] justify-between gap-[8px] md:gap-[20px]">
          <h1 className="self-center font-bold relative w-[70px] md:w-[100px] shrink-0">
            <Link href="/" className="block">
              <Image
                alt="BomRauTFT Logo"
                src="https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F80db2b3de8cb58d0c798f786a4d8fa265af5886e.png?generation=1779094517541297&alt=media"
                width={100}
                height={60}
                className="block w-full"
                priority
              />
            </Link>
          </h1>

          <HeaderClient
            isLoggedIn={isLoggedIn}
            username={username}
            role={role}
            dashboardHref={dashboardHref}
          />
        </div>
      </div>
    </header>
  );
}
