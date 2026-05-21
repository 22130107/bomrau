"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Navigation } from "./Navigation";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export function Header({ isLoggedIn, username }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b fixed w-full left-0 top-0 bg-[rgb(15,23,42)] z-[2506] border-b-[rgba(254,226,226,0.5)]">
      <div className="mx-auto w-full max-w-[1200px] px-[14px]">
        <div className="items-center flex w-full h-[60px] md:h-[80px] justify-between gap-[8px] md:gap-[20px]">
          <h1 className="self-center font-bold relative w-[70px] md:w-[100px] shrink-0">
            <Link href="/" className="block">
              <img alt="BomRauTFT Logo" src="https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F80db2b3de8cb58d0c798f786a4d8fa265af5886e.png?generation=1779094517541297&alt=media" className="block w-full" />
            </Link>
          </h1>
          <div className="flex items-center gap-2 justify-end flex-1 md:contents">
            <SearchBar />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center gap-[5px] w-8 h-8 md:hidden outline-none cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-[2px] bg-[rgb(251,191,36)] rounded transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`}></span>
              <span className={`w-6 h-[2px] bg-[rgb(251,191,36)] rounded transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`w-6 h-[2px] bg-[rgb(251,191,36)] rounded transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></span>
            </button>
          </div>
          <div className="hidden md:block">
            <Navigation isLoggedIn={isLoggedIn} username={username} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[rgba(254,226,226,0.15)] bg-[rgb(15,23,42)] px-[14px] py-4 animate-fade-in">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/thong-bao" 
              className="text-[16px] font-medium text-white hover:text-[rgb(251,191,36)] transition-colors py-2 border-b border-[rgba(255,255,255,0.05)]"
              onClick={() => setIsOpen(false)}
            >
              Thông Báo
            </Link>
            <Link 
              href="/shopping" 
              className="text-[16px] font-medium text-white hover:text-[rgb(251,191,36)] transition-colors py-2 border-b border-[rgba(255,255,255,0.05)]"
              onClick={() => setIsOpen(false)}
            >
              Shopping
            </Link>
            <div className="pt-2">
              {isLoggedIn ? (
                <Link 
                  href="/profile" 
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[rgb(31,41,55)] border border-[rgb(251,191,36)] text-[rgb(251,191,36)] font-bold text-[14px] rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  {username}
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center justify-center w-full py-2.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[14px] rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng Nhập
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
