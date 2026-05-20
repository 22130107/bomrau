export function NewsSection() {
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
                <div className="flex flex-col md:flex-row bg-[rgba(15,23,42,0.25)]">
                  <figure className="overflow-hidden w-full md:w-xs aspect-[16/9] shrink-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa5bc3445a8f1dc0714c6f4731e3c186496be435a.webp?generation=1779094517555150&alt=media" className="block size-full object-cover" alt="Chào đón đại lễ 30/4 - 1/5" />
                  </figure>
                  <div className="flex flex-col p-4">
                    <h3 className="font-bold text-[rgb(251,191,36)] text-[18px] md:text-[24px] leading-[28px] md:leading-[38.4px]">
                      Chào đón đại lễ 30/4 -1/5, giảm giá ưu đãi.
                    </h3>
                    <p className="text-[14px] md:text-[16px] mt-2">
                      Nhân dịp chào đón đại lễ 30/4 -1/5 web <span className="font-semibold text-[rgb(245,197,66)]">www.bomrautft.com</span>, giảm giá đặc biệt trên tất cả tài khoản.
                    </p>
                    <p className="text-[14px] md:text-[16px]">Anh em lựa chọn tài khoản yêu thích và liên lạc cho Bờm Râu để được nhận ưu đãi qua</p>
                    <p className="text-[14px] md:text-[16px]">zép lào : 0338180818 (Bờm râu).</p>
                    <h3 className="font-bold text-[rgb(251,191,36)] text-[18px] md:text-[24px] leading-[28px] md:leading-[38.4px] mt-2">
                      Mordekaiser Hắc Tinh đã ra mắt, vui lòng liên hệ Bờm để đặt hàng sớm nhất.
                    </h3>
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
