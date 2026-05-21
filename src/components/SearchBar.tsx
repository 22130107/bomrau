"use client";

export function SearchBar() {
  return (
    <div className="flex-1 max-w-[300px]">
      <input
        type="text"
        placeholder="Nhập tên pet để tìm kiếm..."
        className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[12px] md:text-[14px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.4)]"
      />
    </div>
  );
}
