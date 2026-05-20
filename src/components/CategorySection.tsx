import { CategoryCard } from "./CategoryCard";

const categories = [
  { image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9b3152916e263eb7af7e07db6785b880ec121e5f.jpg?generation=1779094517561521&alt=media", alt: "ACC Vip", title: "ACC Vip", price: "Acc giá > 2.999.000", sold: 88, remaining: 15, href: "/shopping?cat=vip" },
  { image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F581605553ab37bb926447a9e24d3faad22e82550.png?generation=1779094517551130&alt=media", alt: "ACC Siêu Rẻ", title: "Siêu Rẻ", price: "Acc giá < 2.999.000", sold: 2858, remaining: 107, href: "/shopping?cat=cheaper" },
  { image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F5745906b6273768d8198efc2c6098955f5a541f2.jpg?generation=1779094517546254&alt=media", alt: "ACC Pet Tím", title: "Pet Tím + Sàn Tím", sold: 1273, remaining: 12, href: "/shopping?cat=pet" },
  { image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fe522b2a53c646cc7a700b4453c6a30ed3fde9996.jpg?generation=1779094517548245&alt=media", alt: "ACC Linh Thú Mới", title: "Linh Thú Mới Ra Mắt", href: "/shopping?cat=petnew" },
  { image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fc72930369d1ac1e3be58a0f622243533548f197a.jpg?generation=1779094517506019&alt=media", alt: "Irelia Thần Thoại", title: "Irelia Thần Thoại", href: "/shopping?cat=legend" },
  { image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F4a6c0bf29837772a0648ef2f998ccc4c345edb2e.jpg?generation=1779094517545036&alt=media", alt: "Riven Ngạo Kiếm", title: "Riven Ngạo Kiếm", href: "/shopping?cat=legend" },
];

export function CategorySection() {
  return (
    <section id="danhmuc" className="pt-6 md:pt-10 pb-6 md:pb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="mx-auto w-full max-w-[1200px] px-[14px]">
        <h2 className="font-bold mb-[16px] md:mb-[32px] border-[rgb(251,191,36)] text-[rgb(251,191,36)] text-[28px] md:text-[36px] leading-[48px] md:leading-[64px] pl-4 md:pl-6 border-l-[4px]">
          Danh Mục
        </h2>
        <ul className="flex flex-wrap mt-[32px] md:mt-[64px] gap-[16px] md:gap-[32px]">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </ul>
      </div>
    </section>
  );
}
