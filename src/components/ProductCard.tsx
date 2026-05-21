import Link from "next/link";
import { DiscountBadge } from "./DiscountBadge";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  sold?: number;
  remaining?: number;
}

export function ProductCard({ id, name, image, price, originalPrice, discount, sold, remaining }: ProductCardProps) {
  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + " ₫";

  return (
    <li className="list-none w-[calc(50%-8px)] md:w-[calc(33.333%-22px)]">
      <article className="border flex flex-col size-full relative bg-[rgb(2,6,23)] rounded-br-[1.25rem] border-[rgb(253,230,138)] rounded-tl-[1.25rem] p-2.5 md:p-4 pb-4 md:pb-6">
        <div className="font-medium text-[rgb(251,191,36)] text-[14px] md:text-[24px] leading-tight md:leading-[38.4px] font-[family-name:var(--font-nunito)]">
          {name}
        </div>
        <figure className="relative w-full mt-[12px] aspect-[16/9]">
          <DiscountBadge discount={discount} />
          <img src={image} className="block size-full object-cover absolute left-0 top-0 right-0 bottom-0 rounded-2xl" alt={name} />
        </figure>
        <div className="flex flex-col grow text-center pt-3 pb-3 md:pt-4 md:pb-4">
          <div className="border-t text-center mt-[12px] pt-3 border-dashed border-t-[rgba(251,191,36,0.4)]">
            <span className="font-bold text-[rgb(251,191,36)] text-[13px] md:text-[20px] pr-1.5 md:pr-2 font-[family-name:var(--font-nunito)]">
              {formatPrice(price)}
            </span>
            <span className="font-medium line-through text-[rgba(238,238,238,0.6)] text-[10px] md:text-[14px] font-[family-name:var(--font-nunito)]">
              {formatPrice(originalPrice)}
            </span>
          </div>
          {(sold !== undefined || remaining !== undefined) && (
            <p className="text-center text-[10px] md:text-[14px] mt-1.5 md:mt-2">
              {sold !== undefined && (
                <>Đã bán <span className="font-bold text-[rgb(220,38,38)] text-[13px] md:text-[22px] animate-pulse font-[family-name:var(--font-nunito)]">{sold}</span> acc</>
              )}
              {sold !== undefined && remaining !== undefined && <span> | </span>}
              {remaining !== undefined && (
                <>Còn <span className="font-bold text-[rgb(220,38,38)] text-[13px] md:text-[22px] animate-pulse font-[family-name:var(--font-nunito)]">{remaining}</span> acc</>
              )}
            </p>
          )}
        </div>
        <Link href={`/shopping/${id}`} className="items-center flex font-bold justify-center mx-auto mt-auto max-w-full w-full md:w-[200px] h-8 md:h-10 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] rounded-br-xl rounded-tl-xl text-[12px] md:text-[18px] transition-colors text-black">
          CHI TIẾT
        </Link>
      </article>
    </li>
  );
}
