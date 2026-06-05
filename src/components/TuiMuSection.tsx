import Link from "next/link";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

const tierStyles = `
  .tuimu-thuong .tuimu-border {
    background: linear-gradient(135deg, rgb(156,163,175), rgba(107,114,128,0.6), rgb(156,163,175));
    box-shadow: 0 0 12px rgba(156,163,175,0.15);
  }
  .tuimu-thuong:hover .tuimu-border {
    box-shadow: 0 0 24px rgba(156,163,175,0.3);
  }
  .tuimu-thuong .tuimu-badge {
    background: linear-gradient(135deg, rgb(156,163,175), rgb(107,114,128));
    box-shadow: 0 0 10px rgba(156,163,175,0.4);
  }
  .tuimu-thuong .tuimu-btn {
    background: linear-gradient(135deg, rgb(107,114,128), rgb(156,163,175));
    box-shadow: 0 0 10px rgba(156,163,175,0.25);
  }
  .tuimu-thuong:hover .tuimu-btn {
    background: linear-gradient(135deg, rgb(156,163,175), rgb(209,213,219));
    box-shadow: 0 0 16px rgba(156,163,175,0.4);
    transform: scale(1.03);
  }
  .tuimu-thuong .tuimu-title { color: rgb(209,213,219); }
  .tuimu-thuong .tuimu-icon { color: rgb(156,163,175); }

  .tuimu-vip .tuimu-border {
    background: linear-gradient(135deg, rgb(253,230,138), rgba(202,138,4,0.6), rgb(253,230,138));
    box-shadow: 0 0 12px rgba(251,191,36,0.15);
  }
  .tuimu-vip:hover .tuimu-border {
    box-shadow: 0 0 24px rgba(251,191,36,0.3);
  }
  .tuimu-vip .tuimu-badge {
    background: linear-gradient(135deg, rgb(202,138,4), rgb(251,191,36));
    box-shadow: 0 0 10px rgba(251,191,36,0.4);
  }
  .tuimu-vip .tuimu-btn {
    background: linear-gradient(135deg, rgb(202,138,4), rgb(251,191,36));
    box-shadow: 0 0 10px rgba(251,191,36,0.25);
  }
  .tuimu-vip:hover .tuimu-btn {
    background: linear-gradient(135deg, rgb(251,191,36), rgb(255,215,0));
    box-shadow: 0 0 16px rgba(251,191,36,0.4);
    transform: scale(1.03);
  }
  .tuimu-vip .tuimu-title { color: rgb(251,191,36); }
  .tuimu-vip .tuimu-icon { color: rgb(251,191,36); }

  .tuimu-sieuvip .tuimu-border {
    background: linear-gradient(135deg, rgb(168,85,247), rgba(236,72,153,0.6), rgb(168,85,247));
    box-shadow: 0 0 12px rgba(168,85,247,0.15);
  }
  .tuimu-sieuvip:hover .tuimu-border {
    box-shadow: 0 0 24px rgba(168,85,247,0.3);
  }
  .tuimu-sieuvip .tuimu-badge {
    background: linear-gradient(135deg, rgb(168,85,247), rgb(236,72,153));
    box-shadow: 0 0 10px rgba(168,85,247,0.4);
  }
  .tuimu-sieuvip .tuimu-btn {
    background: linear-gradient(135deg, rgb(147,51,234), rgb(219,39,119));
    box-shadow: 0 0 10px rgba(168,85,247,0.25);
  }
  .tuimu-sieuvip:hover .tuimu-btn {
    background: linear-gradient(135deg, rgb(219,39,119), rgb(168,85,247));
    box-shadow: 0 0 16px rgba(168,85,247,0.4);
    transform: scale(1.03);
  }
  .tuimu-sieuvip .tuimu-title { color: rgb(216,180,254); }
  .tuimu-sieuvip .tuimu-icon { color: rgb(168,85,247); }

  .tuimu-border, .tuimu-btn {
    transition: all 0.3s ease;
  }
`;

export async function TuiMuSection() {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT c.name as title, c.slug, c.description as price, c.image_url as image,
           c.fake_remaining_count as remaining,
           c.fake_sold_count as sold,
           c.spin_price,
           (SELECT \`value\` FROM settings WHERE \`key\` = 'spin_cost' LIMIT 1) as global_spin_cost
    FROM categories c
    WHERE c.is_spin_enabled = 1
    ORDER BY c.sort_order ASC
  `);

  if (rows.length === 0) return null;

  const globalSpinCost = rows.length > 0 ? Number(rows[0].global_spin_cost) || 10000 : 10000;

  const tierClass = ["tuimu-thuong", "tuimu-vip", "tuimu-sieuvip"];
  const tierBadge = ["THƯỜNG", "VIP", "SIÊU VIP"];

  return (
    <>
      <style>{tierStyles}</style>
      <section id="tuimu" className="relative pt-10 md:pt-16 pb-8 md:pb-12 animate-fade-in-up overflow-hidden" style={{ animationDelay: "0.2s" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(251,191,36,0.06)] via-[rgba(251,191,36,0.03)] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[rgba(251,191,36,0.08)] blur-[80px] rounded-full pointer-events-none" />
      <div className="mx-auto w-full max-w-[1200px] px-[14px] relative">
        <div className="flex items-center gap-3 mb-[16px] md:mb-[24px] pl-4 md:pl-6">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[rgba(251,191,36,0.15)] flex items-center justify-center shrink-0 border border-[rgba(251,191,36,0.3)]">
            <i className="fa-solid fa-gift text-[rgb(251,191,36)] text-[18px] md:text-[28px]" />
          </div>
          <div>
            <h2 className="font-bold text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px]">
              Túi Mù
            </h2>
            <p className="text-[rgba(238,238,238,0.4)] text-[12px] md:text-[14px] -mt-1 md:-mt-2">
              Quay ngay, nhận acc siêu hấp dẫn!
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap mt-[24px] md:mt-[40px] gap-[16px] md:gap-[32px]">
          {rows.map((category, index) => {
            const spinPrice = category.spin_price !== null ? Number(category.spin_price) : globalSpinCost;
            const cls = tierClass[index] || "tuimu-thuong";
            const badge = tierBadge[index] || "THƯỜNG";
            return (
              <li key={index} className={`list-none w-[calc(50%-8px)] md:w-[calc(33.333%-22px)] ${cls}`}>
                <div className="h-full relative p-[1.5px] rounded-2xl md:rounded-2xl tuimu-border">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 tuimu-badge text-black text-[10px] md:text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    <i className="fa-solid fa-dice mr-1" />{badge}
                  </div>
                  <article className="flex flex-col size-full relative bg-[rgb(2,6,23)] rounded-2xl p-2 md:p-4 pb-2.5 md:pb-6 overflow-hidden">
                    <figure className="relative w-full aspect-[16/9]">
                      {category.image ? (
                        <img src={category.image} className="object-contain w-full h-full rounded-2xl" alt={category.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[rgb(17,24,39)] rounded-2xl">
                          <i className="fa-solid fa-gift tuimu-icon text-[48px]" />
                        </div>
                      )}
                    </figure>
                    <div className="flex flex-col grow text-center pt-1 pb-1 md:pt-4 md:pb-4 relative z-10">
                      <h3 className="tuimu-title font-bold mb-auto text-center text-[14px] md:text-[20px] leading-[20px] md:leading-[32px] min-h-10 md:min-h-16">
                        {category.title}
                      </h3>
                    </div>
                    <Link
                      href={`/random?category=${category.slug}`}
                      className="tuimu-btn items-center flex font-bold justify-center mx-auto mt-auto max-w-full w-[130px] md:w-[200px] h-9 md:h-10 rounded-lg text-[12px] md:text-[18px] text-black gap-1.5 relative z-10"
                    >
                      <i className="fa-solid fa-dice text-[11px] md:text-[15px]" />
                      QUAY - {spinPrice.toLocaleString("vi-VN")}đ
                    </Link>
                  </article>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
    </>
  );
}
