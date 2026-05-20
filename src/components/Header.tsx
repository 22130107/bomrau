"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Navigation } from "./Navigation";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export function Header({ isLoggedIn, username }: HeaderProps) {
  return (
    <header className="border-b fixed w-full left-0 top-0 bg-[rgb(15,23,42)] z-[2506] border-b-[rgba(254,226,226,0.5)]">
      <div className="mx-auto w-full max-w-[1200px] px-[14px]">
        <div className="items-center flex flex-wrap md:flex-nowrap w-full h-[60px] md:h-[80px] gap-[12px] md:gap-[20px]">
          <h1 className="self-center font-bold mr-auto relative w-[80px] md:w-[100px] shrink-0">
            <Link href="/" className="block">
              <img alt="BomRauTFT Logo" src="https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F80db2b3de8cb58d0c798f786a4d8fa265af5886e.png?generation=1779094517541297&alt=media" className="block w-full" />
            </Link>
          </h1>
          <SearchBar />
          <Navigation isLoggedIn={isLoggedIn} username={username} />
        </div>
      </div>
    </header>
  );
}
