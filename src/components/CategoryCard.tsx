import Link from "next/link";

interface CategoryCardProps {
  image: string;
  alt: string;
  title: string;
  price?: string;
  sold?: number;
  remaining?: number;
  href: string;
}

export function CategoryCard({ image, alt, title, price, sold, remaining, href }: CategoryCardProps) {
  return (
    <li className="list-none w-[calc(50%-8px)] md:w-[calc(33.333%-22px)]">
      <article className="border flex flex-col size-full relative bg-[rgb(2,6,23)] rounded-2xl md:rounded-none md:rounded-br-[1.25rem] border-[rgb(253,230,138)] md:rounded-tl-[1.25rem] p-2 md:p-4 pb-2.5 md:pb-6">
        <figure className="relative w-full aspect-[16/9]">
          <img alt={alt} src={image} className="block size-full object-cover absolute left-0 top-0 right-0 bottom-0 rounded-2xl md:rounded-none md:rounded-tl-2xl md:rounded-br-2xl md:rounded-tr-none md:rounded-bl-none" />
        </figure>
        <div className="flex flex-col grow text-center pt-1 pb-1 md:pt-4 md:pb-4">
          <h3 className="font-bold mb-auto text-center text-[rgb(251,191,36)] text-[14px] md:text-[20px] leading-[20px] md:leading-[32px] min-h-10 md:min-h-16">{title}</h3>
          {price && <p className="font-bold text-center text-[12px] md:text-[16px]">{price}</p>}
          {(sold !== undefined || remaining !== undefined) && (
            <p className="text-center text-[10px] md:text-[14px] mt-1 leading-tight">
              {sold !== undefined && (
                <>Đã bán <span className="font-bold text-[rgb(220,38,38)] text-[14px] md:text-[22px] animate-pulse font-[family-name:var(--font-nunito)]">{sold}</span> acc</>
              )}
              {sold !== undefined && remaining !== undefined && <span className="mx-0.5 md:mx-1">|</span>}
              {remaining !== undefined && (
                <>Còn <span className="font-bold text-[rgb(220,38,38)] text-[14px] md:text-[22px] animate-pulse font-[family-name:var(--font-nunito)]">{remaining}</span> acc</>
              )}
            </p>
          )}
        </div>
        <Link href={href} className="items-center flex font-bold justify-center mx-auto mt-auto max-w-full w-[130px] md:w-[200px] h-9 md:h-10 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] rounded-br-xl rounded-tl-xl text-[12px] md:text-[18px] transition-colors text-black">
          XEM THÊM
        </Link>
      </article>
    </li>
  );
}
