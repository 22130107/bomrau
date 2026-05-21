"use client";

import { useState, useRef, useTransition } from "react";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/category";
import { createProductAction, updateProductAction, deleteProductAction, ProductFormData } from "@/app/actions/product";
import { createAccountAction, updateAccountAction, deleteAccountAction, AccountFormData } from "@/app/actions/account";

export interface AdminStats {
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
}

export interface AdminProduct {
  id: number;
  category_id: number;
  title: string;
  image_url: string;
  price: number;
  original_price: number;
  discount_percent: number;
  fake_sold_count: number;
  fake_remaining_count: number;
  category_name: string;
  status: "available" | "hidden";
  pet_tim?: string;
  san_tim?: string;
  chuong?: string;
  extra_info?: string;
}

export interface AdminAccount {
  id: number;
  product_id: number;
  distributor_id: number | null;
  login_username: string;
  login_password: string;
  cost_price: number;
  status: "available" | "sold" | "hidden";
  note: string;
  product_title: string;
  distributor_name: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  productCount: number;
  soldCount: number;
}

export interface AdminDistributor {
  id: number;
  name: string;
  domain: string;
  phone: string;
  email: string;
  totalSupplied: number;
  is_active: boolean;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  balance: number;
  joinDate: string;
  totalPurchased: number;
}

export interface AdminOrder {
  id: number;
  user: string;
  product: string;
  amount: number;
  date: string;
  status: "pending" | "completed" | "cancelled" | "refunded";
}

export interface AdminContentProps {
  stats: AdminStats;
  initialProducts: AdminProduct[];
  initialAccounts: AdminAccount[];
  initialCategories: AdminCategory[];
  initialDistributors: AdminDistributor[];
  initialUsers: AdminUser[];
  initialOrders: AdminOrder[];
}

export function AdminContent({
  stats,
  initialProducts,
  initialAccounts,
  initialCategories,
  initialDistributors,
  initialUsers,
  initialOrders,
}: AdminContentProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "products" | "accounts" | "categories" | "distributors" | "users" | "orders">("stats");
  
  // Trạng thái chung
  const [isPending, startTransition] = useTransition();

  // States cho Sản phẩm
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    title: "", category_id: 0, image_url: "", price: 0, original_price: 0, 
    discount_percent: 0, fake_sold_count: 0, fake_remaining_count: 0, status: "available",
    pet_tim: "", san_tim: "", chuong: "", extra_info: ""
  });

  // States cho Tài khoản
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [selectedCategoryForAccount, setSelectedCategoryForAccount] = useState<number>(0);
  const [accountForm, setAccountForm] = useState<AccountFormData>({
    product_id: 0, distributor_id: null, login_username: "", login_password: "", 
    cost_price: 0, status: "available", note: ""
  });
  
  // States cho Danh mục (Thật)
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "", image_url: "", sort_order: 0, fake_remaining_count: 0, fake_sold_count: 0 });


  const tabs = [
    { key: "stats", label: "Thống kê" },
    { key: "categories", label: "Danh mục" },
    { key: "products", label: "Sản phẩm" },
    { key: "accounts", label: "Kho Tài khoản" },
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
            <p className="text-[rgb(251,191,36)] text-[18px] md:text-[24px] font-bold mt-1">{stats.totalRevenue.toLocaleString("vi-VN")}đ</p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Sản phẩm</p>
            <p className="text-[rgb(34,197,94)] text-[18px] md:text-[24px] font-bold mt-1">{stats.totalProducts}</p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Người dùng</p>
            <p className="text-[rgb(59,130,246)] text-[18px] md:text-[24px] font-bold mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">Đơn hàng</p>
            <p className="text-[rgb(168,85,247)] text-[18px] md:text-[24px] font-bold mt-1">{stats.totalOrders}</p>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === "products" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">Quản lý Sản phẩm (Loại)</h3>
            <button onClick={() => {
              setShowAddProduct(true);
              setEditingProductId(null);
              setProductForm({ title: "", category_id: initialCategories[0]?.id || 0, image_url: "", price: 0, original_price: 0, discount_percent: 0, fake_sold_count: 0, fake_remaining_count: 0, status: "available", pet_tim: "", san_tim: "", chuong: "", extra_info: "" });
            }} className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors">+ Thêm Sản phẩm</button>
          </div>
          {showAddProduct && (
            <div className="mb-6 p-4 md:p-6 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">{editingProductId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Tên sản phẩm *</label><input type="text" placeholder="VD: Soraka Banana Chibi" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Danh mục *</label>
                  <select value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]">
                    <option value={0}>-- Chọn danh mục --</option>
                    {initialCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">URL Ảnh SP</label><input type="text" value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Giá bán thực tế (VNĐ) *</label><input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Giá gốc / Gạch ngang (VNĐ)</label><input type="number" value={productForm.original_price} onChange={e => setProductForm({...productForm, original_price: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">% Giảm giá hiển thị label</label><input type="number" value={productForm.discount_percent} onChange={e => setProductForm({...productForm, discount_percent: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>

                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Đã bán (Ảo)</label><input type="number" value={productForm.fake_sold_count} onChange={e => setProductForm({...productForm, fake_sold_count: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Còn lại (Ảo)</label><input type="number" value={productForm.fake_remaining_count} onChange={e => setProductForm({...productForm, fake_remaining_count: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>

                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Trạng thái</label>
                  <select value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value as "available"|"hidden"})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]">
                    <option value="available">Hiện</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>
                
                {/* Extra info fields */}
                <div className="flex flex-col gap-1 md:col-span-3 border-t border-[rgba(238,238,238,0.2)] mt-2 pt-3">
                  <span className="text-[14px] text-[rgb(251,191,36)] font-bold">Thông tin chi tiết in-game (Tuỳ chọn)</span>
                </div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Pet Tím</label><input type="text" placeholder="VD: Soraka Chuối Tí Nị" value={productForm.pet_tim || ""} onChange={e => setProductForm({...productForm, pet_tim: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Sàn Tím</label><input type="text" value={productForm.san_tim || ""} onChange={e => setProductForm({...productForm, san_tim: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Chưởng</label><input type="text" value={productForm.chuong || ""} onChange={e => setProductForm({...productForm, chuong: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1 md:col-span-3"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Extra Infor</label><input type="text" value={productForm.extra_info || ""} onChange={e => setProductForm({...productForm, extra_info: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingProductId 
                        ? await updateProductAction(editingProductId, productForm)
                        : await createProductAction(productForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(editingProductId ? "Sửa thành công!" : "Thêm thành công!");
                        setShowAddProduct(false);
                      }
                    });
                  }} 
                  className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu sản phẩm"}
                </button>
                <button onClick={() => setShowAddProduct(false)} className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50" disabled={isPending}>Hủy</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Tên Sản phẩm</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Giá bán</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Danh mục</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Trạng thái</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {initialProducts.map(p => (
                  <tr key={p.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{p.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{p.title}</td>
                    <td className="py-3 text-white">{p.price.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-white hidden md:table-cell">{p.category_name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                        p.status === "available" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" :
                        "bg-[rgba(107,114,128,0.2)] text-[rgb(156,163,175)]"
                      }`}>
                        {p.status === "available" ? "Đang hiện" : "Ẩn"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button 
                          disabled={isPending}
                          onClick={() => {
                            const prod = initialProducts.find(x => x.id === p.id);
                            if (prod) {
                              setProductForm({
                                title: prod.title,
                                category_id: prod.category_id,
                                image_url: prod.image_url,
                                price: prod.price,
                                original_price: prod.original_price,
                                discount_percent: prod.discount_percent,
                                fake_sold_count: prod.fake_sold_count,
                                fake_remaining_count: prod.fake_remaining_count,
                                status: prod.status,
                                pet_tim: prod.pet_tim,
                                san_tim: prod.san_tim,
                                chuong: prod.chuong,
                                extra_info: prod.extra_info,
                              });
                              setEditingProductId(prod.id);
                              setShowAddProduct(true);
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button 
                          disabled={isPending}
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm #${p.id}? Toàn bộ Kho Tài khoản thuộc SP này cũng sẽ BỊ XÓA! (Cân nhắc Đổi trạng thái sang Ẩn)`)) {
                              startTransition(async () => {
                                const res = await deleteProductAction(p.id);
                                if (res.error) alert(res.error);
                              });
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts */}
      {activeTab === "accounts" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">Kho Tài khoản Thực tế</h3>
            <button onClick={() => {
              setShowAddAccount(true);
              setEditingAccountId(null);
              setSelectedCategoryForAccount(0);
              setAccountForm({ product_id: 0, distributor_id: null, login_username: "", login_password: "", cost_price: 0, status: "available", note: "" });
            }} className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors">+ Thêm Account</button>
          </div>
          {showAddAccount && (
            <div className="mb-6 p-4 md:p-6 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">{editingAccountId ? "Sửa tài khoản" : "Thêm tài khoản mới (Nhập kho)"}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Lọc theo Danh mục</label>
                  <select value={selectedCategoryForAccount} onChange={e => {
                    setSelectedCategoryForAccount(Number(e.target.value));
                    setAccountForm({...accountForm, product_id: 0});
                  }} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]">
                    <option value={0}>-- Tất cả danh mục --</option>
                    {initialCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Sản phẩm *</label>
                  <select value={accountForm.product_id} onChange={e => setAccountForm({...accountForm, product_id: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]">
                    <option value={0}>-- Chọn Sản phẩm --</option>
                    {initialProducts.filter(p => selectedCategoryForAccount === 0 || p.category_id === selectedCategoryForAccount).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Tài khoản Đăng nhập *</label><input type="text" value={accountForm.login_username} onChange={e => setAccountForm({...accountForm, login_username: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Mật khẩu Đăng nhập *</label><input type="text" value={accountForm.login_password} onChange={e => setAccountForm({...accountForm, login_password: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Giá nhập (VNĐ)</label><input type="number" value={accountForm.cost_price} onChange={e => setAccountForm({...accountForm, cost_price: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1 md:col-span-3"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Ghi chú (Tùy chọn)</label><input type="text" placeholder="VD: Nick này có thông tin Pet Tím..." value={accountForm.note} onChange={e => setAccountForm({...accountForm, note: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingAccountId 
                        ? await updateAccountAction(editingAccountId, accountForm)
                        : await createAccountAction(accountForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(editingAccountId ? "Sửa thành công!" : "Nhập kho thành công!");
                        setShowAddAccount(false);
                      }
                    });
                  }} 
                  className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu tài khoản"}
                </button>
                <button onClick={() => setShowAddAccount(false)} className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50" disabled={isPending}>Hủy</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead><tr className="border-b border-[rgb(75,85,99)]">
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">ID Acc</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thuộc SP</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Trạng thái</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {initialAccounts.map(a => (
                  <tr key={a.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{a.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{a.product_title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                        a.status === "available" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" :
                        a.status === "sold" ? "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]" :
                        "bg-[rgba(107,114,128,0.2)] text-[rgb(156,163,175)]"
                      }`}>
                        {a.status === "available" ? "Tồn kho" : a.status === "sold" ? "Đã giao" : "Lỗi/Ẩn"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button 
                          disabled={isPending}
                          onClick={() => {
                            const acc = initialAccounts.find(x => x.id === a.id);
                            if (acc) {
                              const prod = initialProducts.find(p => p.id === acc.product_id);
                              setSelectedCategoryForAccount(prod ? prod.category_id : 0);
                              setAccountForm({
                                product_id: acc.product_id,
                                distributor_id: acc.distributor_id,
                                login_username: acc.login_username,
                                login_password: acc.login_password,
                                cost_price: acc.cost_price,
                                status: acc.status,
                                note: acc.note
                              });
                              setEditingAccountId(acc.id);
                              setShowAddAccount(true);
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button 
                          disabled={isPending}
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa Acc #${a.id}?`)) {
                              startTransition(async () => {
                                const res = await deleteAccountAction(a.id);
                                if (res.error) alert(res.error);
                              });
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
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
            <button onClick={() => {
              setShowAddCategory(true);
              setEditingCategoryId(null);
              setCategoryForm({ name: "", slug: "", description: "", image_url: "", sort_order: 0, fake_remaining_count: 0, fake_sold_count: 0 });
            }} className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors">+ Thêm danh mục</button>
          </div>

          {showAddCategory && (
            <div className="mb-6 p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-white font-bold text-[14px] mb-3">{editingCategoryId ? "Sửa danh mục" : "Thêm danh mục mới"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Tên danh mục *</label><input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Slug (URL) *</label><input type="text" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Mô tả</label><input type="text" value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Thứ tự hiển thị</label><input type="number" value={categoryForm.sort_order} onChange={e => setCategoryForm({...categoryForm, sort_order: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">URL Ảnh danh mục</label><input type="text" placeholder="https://..." value={categoryForm.image_url} onChange={e => setCategoryForm({...categoryForm, image_url: e.target.value})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Số lượng đang bán (ảo)</label><input type="number" value={categoryForm.fake_remaining_count} onChange={e => setCategoryForm({...categoryForm, fake_remaining_count: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
                <div className="flex flex-col gap-1"><label className="text-[12px] text-[rgba(238,238,238,0.6)]">Số lượng đã bán (ảo)</label><input type="number" value={categoryForm.fake_sold_count} onChange={e => setCategoryForm({...categoryForm, fake_sold_count: Number(e.target.value)})} className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]" /></div>
              </div>
              <div className="flex gap-2 mt-3">
                <button 
                  disabled={isPending}
                  onClick={() => { 
                    startTransition(async () => {
                      const res = editingCategoryId 
                        ? await updateCategoryAction(editingCategoryId, categoryForm)
                        : await createCategoryAction(categoryForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(editingCategoryId ? "Sửa thành công!" : "Thêm thành công!");
                        setShowAddCategory(false);
                      }
                    });
                  }} 
                  className="px-4 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[13px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu"}
                </button>
                <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[13px] rounded-lg transition-colors disabled:opacity-50" disabled={isPending}>Hủy</button>
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
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đang bán</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã bán</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {initialCategories.map(c => (
                  <tr key={c.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{c.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{c.name}</td>
                    <td className="py-3 text-[rgba(238,238,238,0.6)]">{c.slug}</td>
                    <td className="py-3 text-white hidden md:table-cell">{c.description}</td>
                    <td className="py-3 text-white font-bold">{c.productCount}</td>
                    <td className="py-3 text-white font-bold">{c.soldCount}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button 
                          disabled={isPending}
                          onClick={() => {
                            // Find full data from DB via initialCategories
                            const cat = initialCategories.find(x => x.id === c.id);
                            if (cat) {
                              setCategoryForm({ name: cat.name, slug: cat.slug, description: cat.description, image_url: cat.image_url || "", sort_order: cat.sort_order || 0, fake_remaining_count: cat.productCount || 0, fake_sold_count: cat.soldCount || 0 });
                              setEditingCategoryId(c.id);
                              setShowAddCategory(true);
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button 
                          disabled={isPending}
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${c.name}"?`)) {
                              startTransition(async () => {
                                const res = await deleteCategoryAction(c.id);
                                if (res.error) alert(res.error);
                              });
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
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
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Email</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">SĐT</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Tên miền</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã bán qua NPP</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Trạng thái</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {initialDistributors.map(d => (
                  <tr key={d.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{d.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{d.name}</td>
                    <td className="py-3 text-white hidden md:table-cell">{d.email}</td>
                    <td className="py-3 text-white">{d.phone}</td>
                    <td className="py-3 hidden md:table-cell"><span className="text-[rgb(59,130,246)]">{d.domain}</span></td>
                    <td className="py-3 text-white font-bold">{d.totalSupplied} acc</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded text-[11px] font-bold ${d.is_active ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"}`}>{d.is_active ? "Hoạt động" : "Ngừng"}</span></td>
                    <td className="py-3"><div className="flex gap-1"><button className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded">Sửa</button><button className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded">Khóa</button></div></td>
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
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">Tham gia</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Đã mua</th>
                <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Thao tác</th>
              </tr></thead>
              <tbody>
                {initialUsers.map(u => (
                  <tr key={u.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{u.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{u.username}</td>
                    <td className="py-3 text-white hidden md:table-cell">{u.email || "N/A"}</td>
                    <td className="py-3 text-white">{u.balance.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-white hidden md:table-cell">{u.joinDate}</td>
                    <td className="py-3 text-white font-bold">{u.totalPurchased}</td>
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
                {initialOrders.map(o => (
                  <tr key={o.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{o.id}</td>
                    <td className="py-3 text-[rgb(59,130,246)] font-bold">{o.user}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">{o.product}</td>
                    <td className="py-3 text-white">{o.amount.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-white hidden md:table-cell">{o.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                        o.status === "completed" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : 
                        o.status === "pending" ? "bg-[rgba(251,191,36,0.2)] text-[rgb(251,191,36)]" : 
                        o.status === "refunded" ? "bg-[rgba(59,130,246,0.2)] text-[rgb(59,130,246)]" : 
                        "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"
                      }`}>
                        {o.status === "completed" ? "Hoàn thành" : o.status === "pending" ? "Chờ xử lý" : o.status === "refunded" ? "Hoàn tiền" : "Đã hủy"}
                      </span>
                    </td>
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
