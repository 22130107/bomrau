"use client";

import { useState, useEffect } from "react";

interface NotificationItem {
  title: string;
  content: string;
  image?: string;
}

interface NewsSectionProps {
  notifications?: NotificationItem[];
}

const DEFAULT_IMAGE = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa5bc3445a8f1dc0714c6f4731e3c186496be435a.webp?generation=1779094517555150&alt=media";

export function NewsSection({ notifications = [] }: NewsSectionProps) {
  const items = notifications.length > 0 ? notifications : [
    {
      title: "Chào đón đại lễ 30/4 -1/5, giảm giá ưu đãi.",
      content: "Nhân dịp chào đón đại lễ 30/4 -1/5 web www.bomrautft.com, giảm giá đặc biệt trên tất cả tài khoản.\nAnh em lựa chọn tài khoản yêu thích và liên lạc cho Bờm Râu để được nhận ưu đãi qua\nzép lào : 0338180818 (Bờm râu).",
      image: DEFAULT_IMAGE
    },
    {
      title: "Mordekaiser Hắc Tinh đã ra mắt, vui lòng liên hệ Bờm để đặt hàng sớm nhất.",
      content: "Liên hệ ngay Zalo Bờm Râu 0338180818 để nhận tư vấn và đặt hàng sớm nhất.",
      image: DEFAULT_IMAGE
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setFade(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex] || items[0];

  return (
    <section id="thongbao" className="pt-6 md:pt-10 pb-6 md:pb-10 animate-fade-in-up">
      <div className="mx-auto w-full max-w-[1200px] px-[14px]">
        <h2 className="font-bold mb-[16px] md:mb-[32px] border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px]">
          Thông Báo
        </h2>
        <div className="flex flex-wrap mt-[32px] md:mt-[64px] gap-[16px] md:gap-[32px]">
          <ul className="flex flex-col gap-[24px] w-full">
            <li className="flex flex-wrap gap-[32px]">
              <article className="w-full">
                <div className="flex flex-col md:flex-row bg-[rgba(15,23,42,0.25)] border border-[rgba(251,191,36,0.15)] rounded-2xl overflow-hidden md:h-[224px]">
                  <figure className="overflow-hidden w-full md:w-[320px] md:h-full aspect-[320/224] md:aspect-auto shrink-0 bg-[rgb(17,24,39)]">
                    <img 
                      src={currentItem.image || DEFAULT_IMAGE} 
                      className={`block size-full object-cover transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`} 
                      alt="Thông báo" 
                    />
                  </figure>
                  <div className={`flex flex-col p-6 transition-opacity duration-300 justify-center min-w-0 flex-1 ${fade ? "opacity-100" : "opacity-0"}`}>
                    <h3 className="font-bold text-[rgb(251,191,36)] text-[18px] md:text-[24px] leading-[28px] md:leading-[38.4px] line-clamp-2">
                      {currentItem.title}
                    </h3>
                    <div className="text-[14px] md:text-[16px] mt-2 flex flex-col gap-1 text-[rgba(238,238,238,0.85)] font-sans line-clamp-4 md:line-clamp-3 overflow-hidden">
                      {currentItem.content.split("\n").map((para, i) => {
                        if (para.includes("www.bomrautft.com")) {
                          const parts = para.split("www.bomrautft.com");
                          return (
                            <p key={i}>
                              {parts[0]}
                              <span className="font-semibold text-[rgb(245,197,66)]">www.bomrautft.com</span>
                              {parts[1]}
                            </p>
                          );
                        }
                        return <p key={i}>{para}</p>;
                      })}
                    </div>
                  </div>
                </div>
              </article>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
