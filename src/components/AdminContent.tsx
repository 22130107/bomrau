"use client";

import { useState, useRef } from "react";

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<"stats" | "products" | "categories" | "distributors" | "users" | "orders">("stats");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", image: "", price: "", originalPrice: "", discount: "", category: "vip", remaining: "", petTim: "" });
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_CLOUD_NAME = "your-cloud-name";
  const CLOUDINARY_UPLOAD_PRESET = "your-upload-preset";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) { setNewProduct({ ...newProduct, image: data.secure_url }); setImagePreview(data.secure_url); }
      else { alert("Upload thất bại!"); }
    } catch { alert("Lỗi kết nối Cloudinary!"); }
    finally { setUploading(false); }
  };

  const products = [
    { id: 1, name: "YoneThanKiem", price: 2499000, discount: 30, sold: 4, remaining: 1, category: "VIP" },
    { id: 2, name: "YasuoLongKiem", price: 2998000, discount: 30, sold: 8, remaining: 2, category: "VIP" },
    { id: 3, name: "LeeTieuLong", price: 2998000, discount: 30, sold: 6, remaining: 4, category: "VIP" },
    { id: 4, name: "ACC #400", price: 2999000, discount: 20, sold: 12, remaining: 3, category: "Siêu Rẻ" },
    { id: 5, name: "ACC #538", price: 2999000, discount: 20, sold: 5, remaining: 7, category: "Siêu Rẻ" },
  ];

  const [categories, setCategories] = useState([
    { id: 1, name: "VIP", slug: "vip", description: "Acc giá > 2.999.000", productCount: 3, soldCount: 18 },
    { id: 2, name: "Siêu Rẻ", slug: "cheaper", description: "Acc giá < 2.999.000", productCount: 5, soldCount: 2858 },
    { id: 3, name: "Pet Tím", slug: "pet", description: "Pet Tím + Sàn Tím", productCount: 8, soldCount: 1273 },
    { id: 4, name: "Thần Thoại", slug: "legend", description: "Acc có tướng thần thoại", productCount: 12, soldCount: 45 },
  ]);

  const distributors = [
    { id: 1, name: "Bờm Râu", contact: "Nguyễn Văn A", phone: "0338180818", domain: "bomrautft.com", address: "TP.HCM", totalSupplied: 150, status: "active" },
    { id: 2, name: "TFT Store", contact: "Trần Văn B", phone: "0901234567", domain: "tftstore.vn", address: "Hà Nội", totalSupplied: 85, status: "active" },
    { id: 3, name: "ACC King", contact: "Lê Thị C", phone: "0987654321", domain: "accking.shop", address: "Đà Nẵng", totalSupplied: 42, status: "inactive" },
  ];

  const users = [
    { id: 1, username: "player01", email: "player01@gmail.com", balance: 500000, joinDate: "01/01/2026", totalPurchased: 3 },
    { id: 2, username: "gamer_pro", email: "gamerpro@gmail.com", balance: 1200000, joinDate: "15/02/2026", totalPurchased: 7 },
    { id: 3, username: "tft_lover", email: "tftlover@gmail.com", balance: 0, joinDate: "20/03/2026", totalPurchased: 1 },
    { id: 4, username: "bomrau_fan", email: "bomraufan@gmail.com", balance: 3500000, joinDate: "05/04/2026", totalPurchased: 12 },
  ];

  const orders = [
    { id: 1, user: "player01", product: "YoneThanKiem", price: 2499000, date: "15/05/2026", status: "completed" },
    { id: 2, user: "gamer_pro", product: "YasuoLongKiem", price: 2998000, date: "14/05/2026", status: "completed" },
    { id: 3, user: "bomrau_fan", product: "ACC #400", price: 2999000, date: "13/05/2026", status: "pending" },
    { id: 4, user: "tft_lover", product: "LeeTieuLong", price: 2998000, date: "12/05/2026", status: "completed" },
    { id: 5, user: "gamer_pro", product: "ACC #538", price: 2999000, date: "11/05/2026", status: "cancelled" },
  ];

  const totalRevenue = orders.filter(o => o.status === "completed").reduce((s, o) => s + o.price, 0);

  const tabs = [
    { key: "stats", label: "Thống kê" },
    { key: "products", label: "Sản phẩm" },
    { key: "categories", label: "Danh mục" },
    { key: "distributors", label: "Nhà PP" },
    { key: "users", label: "Người dùng" },
    { key: "orders", label: "Đơn hàng" },
  ] as const;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in-up">
      <h1 className="text-[rgb(251,191,36)] text-[24px] md:text-[32px] font-bold mb-6">Quản lý Admin</h1>

      {/* Tabs */}
      <div className="flex mb-6 bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl overflow-hidden">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex-1 py-3 text-[11px] md:text-[14px] font-bold transition-colors ${activeTab === t.key ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}>{t.label}</button>
        ))}
      </div>

      {/* Stats */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Doanh thu</p>
            <p className="text-[rgb(251,191,36)] text-[18px] md:text-[24px] font-bold mt-1">{totalRevenue.toLocaleString("vi-VN")}đ</p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Sản phẩm</p>
            <p className="text-[rgb(34,197,94)] text-[18px] md:text-[24px] font-bold mt-1">{products.length}</p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Người dùng</p>
            <p className="text-[rgb(59,130,246)] text-[18px] md:text-[24px] font-bold mt-1">{users.length}</p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Đơn hàng</p>
            <p className="text-[rgb(168,85,247)] text-[18px] md:text-[24px] font-bold mt-1">{orders.length}</p>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === "products" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">Sản phẩm</h3>
            <button onClick={() => setShowAddProduct(!showAddProduct)} className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors">+ Thêm mới</button>
          </div>
          {showAddProduct && (
            <div className="mb-6 p-4 md:p-6 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">Thêm sản phẩm mới</h4>
              {/* Image upload */}
              <div className="mb-4">
                <label className="text-[13px] text-[rgba(238,238,238,0.7)] mb-2 block">Ảnh sản phẩm (Cloudinary)</label>
                <div className="flex flex-col md:flex-row gap-3 items-start">
                  <div onClick={() => fileInputRef.current?.click()} className="w-full md:w-[200px] h-[120px] border-2 border-dashed border-[rgb(75,85,99)] rounded-lg flex items-center justify-center cursor-pointer hover:border-[rgb(251,191,36)] transition-colors overflow-hidden">
                    {uploading ? (
                      <div className="text-[rgb(251,191,36)] text-[13px] animate-pulse">Đang upload...</div>
                    ) : imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mx-auto text-[rgb(75,85,99)]"><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
                        <p className="text-[11px] text-[rgba(238,238,238,0.5)] mt-1">Click để upload</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <input type="text" placeholder="Hoặc dán URL ảnh" value={newProduct.image} onChange={e => { setNewProduct({...newProduct, image: e.target.value}); setImagePreview(e.target.value); }} className="flex-1 w-full px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Tên sản phẩm *</label><input type="text" placeholder="VD: YoneThanKiem" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Danh mục *</label><select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"><option value="vip">VIP</option><option value="cheaper">Siêu Rẻ</option><option value="pet">Pet Tím</option><option value="legend">Thần Thoại</option></select></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Giá bán (VNĐ) *</label><input type="number" placeholder="2499000" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Giá gốc (VNĐ) *</label><input type="number" placeholder="3570000" value={newProduct.originalPrice} onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">% Giảm giá *</label><input type="number" placeholder="30" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Số lượng còn *</label><input type="number" placeholder="5" value={newProduct.remaining} onChange={e => setNewProduct({...newProduct, remaining: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1 md:col-span-2"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Pet tím (tùy chọn)</label><input type="text" placeholder="VD: Yone Thần Kiếm" value={newProduct.petTim} onChange={e => setNewProduct({...newProduct, petTim: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { alert(`Thêm "${newProduct.name}" thành công! (Demo)`); setShowAddProduct(false); setImagePreview(""); setNewProduct({ name: "", image: "", price: "", originalPrice: "", discount: "", category: "vip", remaining: "", petTim: "" }); }} disabled={uploading} className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50">Lưu sản phẩm</button>
                <button onClick={() => { setShowAddProduct(false); setImagePreview(""); }} className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors">Hủy</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Tên</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Giá</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Giảm</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã bán</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Còn</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{p.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{p.name}</td>
                    <td className="py-3 text-white">{p.price.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-[rgb(220,38,38)] font-bold hidden md:table-cell">-{p.discount}%</td>
                    <td className="py-3 text-white">{p.sold}</td>
                    <td className="py-3 text-white">{p.remaining}</td>
                    <td className="py-3"><div className="flex gap-1"><button className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded">Sửa</button><button className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded">Xóa</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories */}
      {activeTab === "categories" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">Danh mục</h3>
            <button onClick={() => setShowAddCategory(!showAddCategory)} className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors">+ Thêm danh mục</button>
          </div>

          {showAddCategory && (
            <div className="mb-6 p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-white font-bold text-[14px] mb-3">Thêm danh mục mới</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Tên danh mục *</label><input type="text" placeholder="VD: Thần Thoại" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Slug (URL) *</label><input type="text" placeholder="VD: legend" value={newCategory.slug} onChange={e => setNewCategory({...newCategory, slug: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Mô tả</label><input type="text" placeholder="Mô tả ngắn" value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { if (!newCategory.name || !newCategory.slug) { alert("Điền tên và slug!"); return; } setCategories([...categories, { id: categories.length + 1, name: newCategory.name, slug: newCategory.slug, description: newCategory.description, productCount: 0, soldCount: 0 }]); setShowAddCategory(false); setNewCategory({ name: "", slug: "", description: "" }); }} className="px-4 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[13px] rounded-lg transition-colors">Lưu</button>
                <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[13px] rounded-lg transition-colors">Hủy</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Tên</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Slug</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Mô tả</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">SP</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã bán</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{c.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{c.name}</td>
                    <td className="py-3 text-[rgba(238,238,238,0.6)]">{c.slug}</td>
                    <td className="py-3 text-white hidden md:table-cell">{c.description}</td>
                    <td className="py-3 text-white font-bold">{c.productCount}</td>
                    <td className="py-3"><input type="number" value={c.soldCount} onChange={e => setCategories(categories.map(cat => cat.id === c.id ? {...cat, soldCount: Number(e.target.value)} : cat))} className="w-[70px] px-2 py-1 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded text-[rgb(220,38,38)] font-bold text-[13px] text-center outline-none focus:border-[rgb(251,191,36)]" /></td>
                    <td className="py-3"><div className="flex gap-1"><button className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded">Sửa</button><button onClick={() => setCategories(categories.filter(cat => cat.id !== c.id))} className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded">Xóa</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distributors */}
      {activeTab === "distributors" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">Nhà phân phối</h3>
            <button className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors">+ Thêm NPP</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Tên</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Liên hệ</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">SĐT</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Tên miền</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã cung cấp</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Trạng thái</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {distributors.map(d => (
                  <tr key={d.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{d.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{d.name}</td>
                    <td className="py-3 text-white hidden md:table-cell">{d.contact}</td>
                    <td className="py-3 text-white">{d.phone}</td>
                    <td className="py-3 hidden md:table-cell"><span className="text-[rgb(59,130,246)]">{d.domain}</span></td>
                    <td className="py-3 text-white font-bold">{d.totalSupplied} acc</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded text-[11px] font-bold ${d.status === "active" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"}`}>{d.status === "active" ? "Hoạt động" : "Ngừng"}</span></td>
                    <td className="py-3"><div className="flex gap-1"><button className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded">Sửa</button><button className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded">Xóa</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-4">Người dùng</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Username</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Email</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Số dư</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã mua</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{u.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{u.username}</td>
                    <td className="py-3 text-white hidden md:table-cell">{u.email}</td>
                    <td className="py-3 text-white">{u.balance.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-white">{u.totalPurchased}</td>
                    <td className="py-3"><div className="flex gap-1"><button className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded">Xem</button><button className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded">Khóa</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === "orders" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-4">Đơn hàng</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Người mua</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Sản phẩm</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Giá</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Ngày</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Trạng thái</th>
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{o.id}</td>
                    <td className="py-3 text-white">{o.user}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{o.product}</td>
                    <td className="py-3 text-white">{o.price.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-white hidden md:table-cell">{o.date}</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded text-[11px] font-bold ${o.status === "completed" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : o.status === "pending" ? "bg-[rgba(251,191,36,0.2)] text-[rgb(251,191,36)]" : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"}`}>{o.status === "completed" ? "Hoàn thành" : o.status === "pending" ? "Chờ xử lý" : "Đã hủy"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
