"use client";

import React, { useState, useRef, useTransition, useEffect, useMemo } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/category";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  deleteMultipleProductsAction,
  togglePinProductAction,
  ProductFormData,
} from "@/app/actions/product";
import {
  createAccountAction,
  updateAccountAction,
  deleteAccountAction,
  AccountFormData,
} from "@/app/actions/account";
// uploadImageAction kept for fallback reference (direct client upload is preferred)
// import { uploadImageAction } from "@/app/actions/cloudinary";

// Upload thẳng lên Cloudinary từ client để tránh giới hạn 1MB của Server Action
async function uploadToCloudinary(file: File): Promise<string> {
  // 1. Lấy signed params từ server
  const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) {
    const { error } = await signRes.json();
    throw new Error(error || "Không lấy được signature");
  }
  const { signature, timestamp, folder, api_key, cloud_name } =
    await signRes.json();

  // 2. Upload thẳng lên Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    { method: "POST", body: formData },
  );
  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || uploadData.error) {
    throw new Error(uploadData.error?.message || "Upload thất bại");
  }
  return uploadData.secure_url as string;
}
import {
  createNotificationAction,
  updateNotificationAction,
  deleteNotificationAction,
} from "@/app/actions/notification";
import {
  createDistributorAction,
  updateDistributorAction,
  updateDistributorFeeAction,
  toggleDistributorStatusAction,
  DistributorFormData,
} from "@/app/actions/distributor";
import {
  toggleUserLockAction,
  getUserDetailAction,
} from "@/app/actions/admin-user";
import {
  toggleCategorySpinAction,
  getSpinCostAction,
  updateSpinCostAction,
} from "@/app/actions/admin-spin";
import { AutocompleteField } from "@/components/AutocompleteField";
import {
  getAllProductOptions,
  createProductOption,
  updateProductOption,
  deleteProductOption,
  ProductOptionFull,
} from "@/app/actions/product-options";

export interface AdminNotification {
  id: number;
  title: string;
  content: string;
  image_url: string;
  is_pinned: boolean;
  is_active: boolean;
  date: string;
}

export interface MonthlyRevenue {
  month: string;
  total: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalUnsoldAccounts: number;
  totalSoldAccounts: number;
  totalOrders: number;
  monthlyRevenue: MonthlyRevenue[];
}

export interface AdminProduct {
  id: number;
  category_id: number;
  extra_categories: number[];
  title: string;
  image_url: string;
  price: number;
  original_price: number;
  discount_percent: number;
  fake_sold_count: number;
  fake_remaining_count: number;
  category_name: string;
  status: "available" | "hidden";
  is_pinned: boolean;
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
  adminFeePercent: number;
  totalCostPrice: number;
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

export interface AdminSpinCategory {
  id: number;
  name: string;
  is_spin_enabled: boolean;
  available_accounts: number;
}

export interface AdminContentProps {
  stats: AdminStats;
  initialProducts: AdminProduct[];
  initialAccounts: AdminAccount[];
  initialCategories: AdminCategory[];
  initialDistributors: AdminDistributor[];
  initialUsers: AdminUser[];
  initialOrders: AdminOrder[];
  initialNotifications: AdminNotification[];
  initialSpinCategories: AdminSpinCategory[];
  initialSpinCost: number;
}

export function AdminContent({
  stats,
  initialProducts,
  initialAccounts,
  initialCategories,
  initialDistributors,
  initialUsers,
  initialOrders,
  initialNotifications,
  initialSpinCategories,
  initialSpinCost,
}: AdminContentProps) {
  const [activeTab, setActiveTab] = useState<
    | "stats"
    | "products"
    | "accounts"
    | "categories"
    | "distributors"
    | "users"
    | "orders"
    | "notifications"
    | "options"
    | "spin"
  >("stats");

  // Trạng thái chung
  const [isPending, startTransition] = useTransition();

  // States cho Product Options
  const [allOptions, setAllOptions] = useState<ProductOptionFull[]>([]);
  const [showAddOption, setShowAddOption] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<number | null>(null);
  const [optionType, setOptionType] = useState<
    "pet_tim" | "san_tim" | "chuong"
  >("pet_tim");
  const [optionName, setOptionName] = useState("");

  useEffect(() => {
    if (activeTab === "options") {
      getAllProductOptions().then(setAllOptions);
    }
  }, [activeTab]);

  // States
  const [showRevenueChart, setShowRevenueChart] = useState(false);
  const [selectedRevenueMonth, setSelectedRevenueMonth] = useState<string | null>(null);

  // States cho Sản phẩm
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAccountInProduct, setShowAccountInProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    title: "",
    category_id: 0,
    extra_categories: [],
    image_url: "",
    price: 0,
    original_price: 0,
    discount_percent: 0,
    fake_sold_count: 0,
    fake_remaining_count: 0,
    status: "available",
    is_pinned: false,
    pet_tim: "",
    san_tim: "",
    chuong: "",
    extra_info: "",
    account_username: "",
    account_password: "",
    account_cost_price: 0,
    account_note: "",
  });

  const productFormRef = useRef<HTMLDivElement>(null);
  const accountFormRef = useRef<HTMLDivElement>(null);
  const categoryFormRef = useRef<HTMLDivElement>(null);
  const notificationFormRef = useRef<HTMLDivElement>(null);
  const distributorFormRef = useRef<HTMLDivElement>(null);

  // States cho lọc sản phẩm
  const [spinCost, setSpinCost] = useState(initialSpinCost);
  const [spinCostInput, setSpinCostInput] = useState(String(initialSpinCost));
  const [savingSpinCost, setSavingSpinCost] = useState(false);
  const [spinCategories, setSpinCategories] = useState(initialSpinCategories);

  useEffect(() => {
    setSpinCost(initialSpinCost);
    setSpinCostInput(String(initialSpinCost));
  }, [initialSpinCost]);

  useEffect(() => {
    setSpinCategories(initialSpinCategories);
  }, [initialSpinCategories]);

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState(0);
  const [productStatusFilter, setProductStatusFilter] = useState<string>("all");
  const [productAccountFilter, setProductAccountFilter] = useState<string>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());

  const availableCountByProduct = useMemo(() => {
    const map: Record<number, number> = {};
    for (const a of initialAccounts) {
      if (a.status === "available") {
        map[a.product_id] = (map[a.product_id] || 0) + 1;
      }
    }
    return map;
  }, [initialAccounts]);

  // States cho Kho (thêm account từ sản phẩm)
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [productAccountSearch, setProductAccountSearch] = useState("");
  const [productAccountStatusFilter, setProductAccountStatusFilter] = useState<string>("all");
  const [showBulkAccountInput, setShowBulkAccountInput] = useState(false);
  const [bulkAccountInput, setBulkAccountInput] = useState("");
  const [productAccountForm, setProductAccountForm] = useState({
    login_username: "",
    login_password: "",
    cost_price: 0,
    note: "",
    distributor_id: null as number | null,
  });

  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(productSearchTerm.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 0 || p.category_id === productCategoryFilter || p.extra_categories.includes(productCategoryFilter);
    const matchesStatus =
      productStatusFilter === "all" || p.status === productStatusFilter;
    const availCount = availableCountByProduct[p.id] || 0;
    const matchesAccount =
      productAccountFilter === "all" ||
      (productAccountFilter === "available" && availCount > 0) ||
      (productAccountFilter === "out" && availCount === 0);
    return matchesSearch && matchesCategory && matchesStatus && matchesAccount;
  });

  function toggleSelectProduct(id: number) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const allSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedProductIds.has(p.id));
    if (allSelected) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map((p) => p.id)));
    }
  }

  // States cho Tài khoản
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [selectedCategoryForAccount, setSelectedCategoryForAccount] =
    useState<number>(0);
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("all");
  const [accountForm, setAccountForm] = useState<AccountFormData>({
    product_id: 0,
    distributor_id: null,
    login_username: "",
    login_password: "",
    cost_price: 0,
    status: "available",
    note: "",
  });

  // States cho Danh mục (Thật)
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0,
    fake_remaining_count: 0,
    fake_sold_count: 0,
  });

  // States cho Thông báo
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [editingNotificationId, setEditingNotificationId] = useState<
    number | null
  >(null);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    content: "",
    image_url: "",
    is_pinned: false,
    is_active: true,
  });

  // States cho Nhà phân phối
  const [showAddDistributor, setShowAddDistributor] = useState(false);
  const [editingDistributorId, setEditingDistributorId] = useState<
    number | null
  >(null);
  const [distributorForm, setDistributorForm] = useState<DistributorFormData>({
    name: "",
    domain: "",
    phone: "",
    email: "",
    address: "",
    contact_info: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (showAddProduct && productFormRef.current) {
      productFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddProduct, editingProductId]);

  useEffect(() => {
    if (showAddAccount && accountFormRef.current) {
      accountFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddAccount, editingAccountId]);

  useEffect(() => {
    if (showAddCategory && categoryFormRef.current) {
      categoryFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddCategory, editingCategoryId]);

  useEffect(() => {
    if (showAddNotification && notificationFormRef.current) {
      notificationFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddNotification, editingNotificationId]);

  useEffect(() => {
    if (showAddDistributor && distributorFormRef.current) {
      distributorFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddDistributor, editingDistributorId]);

  // States cho User detail
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<{
    id: number;
    username: string;
    email: string | null;
    balance: number;
    role: string;
    is_active: boolean;
    joinDate: string;
  } | null>(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState<
    {
      id: number;
      product: string;
      amount: number;
      status: string;
      date: string;
    }[]
  >([]);

  // Cloudinary image upload states and handlers
  const [isUploadingProduct, setIsUploadingProduct] = useState(false);
  const [isUploadingCategory, setIsUploadingCategory] = useState(false);
  const [isUploadingNotification, setIsUploadingNotification] = useState(false);

  const handleNotificationImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingNotification(true);
    try {
      const url = await uploadToCloudinary(file);
      setNotificationForm((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      alert("Có lỗi xảy ra khi tải ảnh lên: " + err.message);
    } finally {
      setIsUploadingNotification(false);
    }
  };

  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProduct(true);
    try {
      const url = await uploadToCloudinary(file);
      setProductForm((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      alert("Có lỗi xảy ra khi tải ảnh lên: " + err.message);
    } finally {
      setIsUploadingProduct(false);
    }
  };

  const handleCategoryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCategory(true);
    try {
      const url = await uploadToCloudinary(file);
      setCategoryForm((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      alert("Có lỗi xảy ra khi tải ảnh lên: " + err.message);
    } finally {
      setIsUploadingCategory(false);
    }
  };

  const tabs = [
    { key: "stats", label: "Thống kê" },
    { key: "categories", label: "Danh mục" },
    { key: "products", label: "Sản phẩm" },
    { key: "accounts", label: "Kho Tài khoản" },
    { key: "distributors", label: "Nhà PP" },
    { key: "users", label: "Người dùng" },
    { key: "orders", label: "Đơn hàng" },
    { key: "notifications", label: "Thông báo" },
    { key: "spin", label: "Quay Random" },
    { key: "options", label: "Pet/San/Chuong" },
  ] as const;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in-up">
      <h1 className="text-[rgb(251,191,36)] text-[24px] md:text-[32px] font-bold mb-6">
        Quản lý Admin
      </h1>

      {/* Tabs */}
      <div className="flex mb-6 bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl overflow-hidden">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-3 text-[11px] md:text-[14px] font-bold transition-colors ${activeTab === t.key ? "bg-[rgb(202,138,4)] text-black" : "text-[rgba(238,238,238,0.7)] hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {activeTab === "stats" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowRevenueChart(!showRevenueChart)}
              className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center hover:border-[rgb(251,191,36)] transition-colors"
            >
              <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">
                Doanh thu {showRevenueChart ? "▲" : "▼"}
              </p>
              <p className="text-[rgb(251,191,36)] text-[18px] md:text-[24px] font-bold mt-1">
                {stats.totalRevenue.toLocaleString("vi-VN")}đ
              </p>
            </button>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">
              Tài khoản trong kho
            </p>
            <p className="text-[rgb(34,197,94)] text-[18px] md:text-[24px] font-bold mt-1">
              {stats.totalUnsoldAccounts}
            </p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">
              Tài khoản đã bán
            </p>
            <p className="text-[rgb(59,130,246)] text-[18px] md:text-[24px] font-bold mt-1">
              {stats.totalSoldAccounts}
            </p>
          </div>
          <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6 text-center">
            <p className="text-[rgba(238,238,238,0.6)] text-[12px] md:text-[14px]">
              Đơn hàng
            </p>
            <p className="text-[rgb(168,85,247)] text-[18px] md:text-[24px] font-bold mt-1">
              {stats.totalOrders}
            </p>
          </div>
          </div>

          {showRevenueChart && (
            <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[rgb(251,191,36)] font-bold text-[16px]">
                  Doanh thu theo tháng
                </h4>
                <button
                  onClick={() => setSelectedRevenueMonth(null)}
                  className={`px-2 py-1 text-[11px] rounded transition-colors ${
                    selectedRevenueMonth
                      ? "bg-[rgb(59,130,246)] text-white"
                      : "text-[rgba(238,238,238,0.4)]"
                  }`}
                >
                  {selectedRevenueMonth ? "Tất cả" : "12 tháng"}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {stats.monthlyRevenue.length === 0 && (
                  <p className="text-[rgba(238,238,238,0.4)] text-[13px] italic text-center py-4">
                    Chưa có dữ liệu doanh thu.
                  </p>
                )}
                {stats.monthlyRevenue
                  .filter(m => !selectedRevenueMonth || m.month === selectedRevenueMonth)
                  .map(m => {
                    const isSelected = selectedRevenueMonth === m.month;
                    const maxTotal = Math.max(...stats.monthlyRevenue.map(x => x.total), 1);
                    const pct = (m.total / maxTotal) * 100;
                    const label = new Date(m.month + "-01").toLocaleDateString("vi-VN", {
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <button
                        key={m.month}
                        onClick={() => setSelectedRevenueMonth(isSelected ? null : m.month)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-[rgba(251,191,36,0.05)] ${isSelected ? "bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.3)]" : ""}`}
                      >
                        <span className="text-[rgba(238,238,238,0.7)] text-[13px] w-[90px] shrink-0 text-left">{label}</span>
                        <div className="flex-1 h-6 bg-[rgb(17,24,39)] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[rgb(202,138,4)] to-[rgb(251,191,36)] rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, 2)}%` }} />
                        </div>
                        <span className="text-[rgb(251,191,36)] text-[13px] font-bold w-[100px] shrink-0 text-right">{m.total.toLocaleString("vi-VN")}đ</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === "products" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Quản lý Sản phẩm (Loại)
            </h3>
            <button
              onClick={() => {
                setShowAddProduct(true);
                setEditingProductId(null);
                setShowAccountInProduct(false);
                setProductForm({
                  title: "",
                  category_id: initialCategories[0]?.id || 0,
                  extra_categories: [],
                  image_url: "",
                  price: 0,
                  original_price: 0,
                  discount_percent: 0,
                  fake_sold_count: 0,
                  fake_remaining_count: 0,
                  status: "available",
                  is_pinned: false,
                  pet_tim: "",
                  san_tim: "",
                  chuong: "",
                  extra_info: "",
                  account_username: "",
                  account_password: "",
                  account_cost_price: 0,
                  account_note: "",
                });
              }}
              className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors"
            >
              + Thêm Sản phẩm
            </button>
          </div>
          {showAddProduct && (
            <div ref={productFormRef} className="mb-6 p-4 md:p-6 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">
                {editingProductId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Soraka Banana Chibi"
                    value={productForm.title}
                    onChange={(e) =>
                      setProductForm({ ...productForm, title: e.target.value })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Danh mục *
                  </label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category_id: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  >
                    <option value={0}>-- Chọn danh mục --</option>
                    {initialCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Danh mục phụ <span className="text-[rgba(238,238,238,0.3)]">(chọn thêm)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg">
                    {initialCategories
                      .filter(c => c.id !== productForm.category_id)
                      .map(c => {
                        const checked = productForm.extra_categories.includes(c.id);
                        return (
                          <label key={c.id} className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setProductForm({
                                  ...productForm,
                                  extra_categories: checked
                                    ? productForm.extra_categories.filter(id => id !== c.id)
                                    : [...productForm.extra_categories, c.id]
                                });
                              }}
                              className="w-3.5 h-3.5 accent-[rgb(251,191,36)]"
                            />
                            <span className={`text-[12px] ${checked ? "text-[rgb(251,191,36)]" : "text-[rgba(238,238,238,0.7)]"}`}>
                              {c.name}
                            </span>
                          </label>
                        );
                      })}
                    {initialCategories.filter(c => c.id !== productForm.category_id).length === 0 && (
                      <span className="text-[12px] text-[rgba(238,238,238,0.3)]">Không có danh mục khác</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 md:col-span-3 border-t border-[rgba(238,238,238,0.1)] pt-3 mt-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Ảnh sản phẩm *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="URL ảnh hoặc tải lên file..."
                      value={productForm.image_url}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image_url: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] w-full"
                    />
                    <label className="cursor-pointer px-4 py-2 bg-[rgb(55,65,81)] hover:bg-[rgb(75,85,99)] text-white text-[14px] rounded-lg border border-[rgb(75,85,99)] font-semibold transition-colors flex items-center justify-center shrink-0 w-full sm:w-auto min-w-[120px]">
                      {isUploadingProduct ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang tải...
                        </span>
                      ) : (
                        "Tải ảnh lên"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProductImageUpload}
                        disabled={isUploadingProduct}
                      />
                    </label>
                  </div>
                  {productForm.image_url && (
                    <div className="mt-2 relative w-24 h-24 border border-[rgb(75,85,99)] rounded-lg overflow-hidden bg-[rgb(17,24,39)]">
                      <img
                        src={productForm.image_url}
                        alt="Xem trước sản phẩm"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Giá gốc / Gạch ngang (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      const p = productForm.price;
                      setProductForm({
                        ...productForm,
                        original_price: v,
                        discount_percent:
                          p > 0 && v > p
                            ? Math.round((1 - p / v) * 100)
                            : productForm.discount_percent,
                      });
                    }}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Giá bán thực tế (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const d = productForm.discount_percent;
                      setProductForm({
                        ...productForm,
                        price: p,
                        original_price:
                          d > 0 && p > 0 ? Math.round(p / (1 - d / 100)) : productForm.original_price,
                        discount_percent:
                          !d && productForm.original_price > 0 && p > 0 && productForm.original_price > p
                            ? Math.round((1 - p / productForm.original_price) * 100)
                            : d,
                      });
                    }}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    % Giảm giá
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={productForm.discount_percent}
                    onChange={(e) => {
                      const d = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                      const p = productForm.price;
                      setProductForm({
                        ...productForm,
                        discount_percent: d,
                        original_price:
                          d > 0 && p > 0 ? Math.round(p / (1 - d / 100)) : productForm.original_price,
                      });
                    }}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-[rgb(251,191,36)] text-[14px] font-bold outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Đã bán{" "}
                    <span className="text-[rgba(238,238,238,0.4)]">
                      (để trống = tự động)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Tự động"
                    value={productForm.fake_sold_count || ""}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        fake_sold_count:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Còn lại{" "}
                    <span className="text-[rgba(238,238,238,0.4)]">
                      (để trống = tự động)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Tự động"
                    value={productForm.fake_remaining_count || ""}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        fake_remaining_count:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Trạng thái
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        status: e.target.value as "available" | "hidden",
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  >
                    <option value="available">Hiện</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>

                <div className="flex items-end gap-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_pinned}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          is_pinned: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[rgb(251,191,36)]"
                    />
                    <span className="text-[12px] text-[rgba(238,238,238,0.6)]">
                      Ghim lên đầu
                    </span>
                  </label>
                </div>

                {/* Extra info fields */}
                <div className="flex flex-col gap-1 md:col-span-3 border-t border-[rgba(238,238,238,0.2)] mt-2 pt-3">
                  <span className="text-[14px] text-[rgb(251,191,36)] font-bold">
                    Thông tin chi tiết in-game (Tuỳ chọn)
                  </span>
                </div>
                <AutocompleteField
                  label="Pet Tím"
                  value={productForm.pet_tim}
                  onChange={(v) =>
                    setProductForm({ ...productForm, pet_tim: v })
                  }
                  placeholder="VD: Soraka Chuối Tí Nị"
                  optionType="pet_tim"
                />
                <AutocompleteField
                  label="Sàn Tím"
                  value={productForm.san_tim}
                  onChange={(v) =>
                    setProductForm({ ...productForm, san_tim: v })
                  }
                  optionType="san_tim"
                />
                <AutocompleteField
                  label="Chưởng"
                  value={productForm.chuong}
                  onChange={(v) =>
                    setProductForm({ ...productForm, chuong: v })
                  }
                  optionType="chuong"
                />
                <div className="flex flex-col gap-1 md:col-span-3">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Extra Infor
                  </label>
                  <input
                    type="text"
                    value={productForm.extra_info || ""}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        extra_info: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>

                {/* Thêm tài khoản kèm sản phẩm */}
                <div className="flex items-center gap-2 md:col-span-3 border-t border-[rgba(238,238,238,0.2)] mt-2 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAccountInProduct}
                      onChange={(e) => {
                        setShowAccountInProduct(e.target.checked);
                        if (!e.target.checked) {
                          setProductForm({ ...productForm, account_username: "", account_password: "" });
                        }
                      }}
                      className="w-4 h-4 accent-[rgb(251,191,36)]"
                    />
                    <span className="text-[14px] text-[rgb(251,191,36)] font-bold">
                      Thêm tài khoản kèm sản phẩm
                    </span>
                  </label>
                </div>
                {showAccountInProduct && (
                  <>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tài khoản ĐN *
                  </label>
                  <input
                    type="text"
                    value={productForm.account_username || ""}
                    onChange={(e) =>
                      setProductForm({ ...productForm, account_username: e.target.value })
                    }
                    placeholder="VD: gameaccount123"
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Mật khẩu ĐN *
                  </label>
                  <input
                    type="text"
                    value={productForm.account_password || ""}
                    onChange={(e) =>
                      setProductForm({ ...productForm, account_password: e.target.value })
                    }
                    placeholder="VD: password123"
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                  </>
                )}

              </div>

              <div className="flex gap-2 mt-4">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingProductId
                        ? await updateProductAction(
                            editingProductId,
                            productForm,
                          )
                        : await createProductAction(productForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(
                          editingProductId
                            ? "Sửa thành công!"
                            : "Thêm thành công!",
                        );
                        setShowAddProduct(false);
                      }
                    });
                  }}
                  className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu sản phẩm"}
                </button>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          {/* Filter bar cho sản phẩm */}
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
            <input
              type="text"
              placeholder="🔍 Tìm tên sản phẩm..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            />
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(Number(e.target.value))}
              className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            >
              <option value={0}>Tất cả danh mục</option>
              {initialCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={productStatusFilter}
              onChange={(e) => setProductStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Đang hiện</option>
              <option value="hidden">Ẩn</option>
            </select>
            <select
              value={productAccountFilter}
              onChange={(e) => setProductAccountFilter(e.target.value)}
              className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            >
              <option value="all">Tất cả số lượng</option>
              <option value="available">Còn acc</option>
              <option value="out">Hết acc</option>
            </select>
            <span className="flex items-center text-[12px] text-[rgba(238,238,238,0.5)] whitespace-nowrap">
              {filteredProducts.length}/{initialProducts.length} sản phẩm
            </span>
            <button
              onClick={() => { setSelectionMode(!selectionMode); setSelectedProductIds(new Set()); }}
              className={`px-3 py-2 text-[12px] font-bold rounded-lg transition-colors ${
                selectionMode
                  ? "bg-[rgb(251,191,36)] text-black"
                  : "bg-[rgb(55,65,81)] text-white hover:bg-[rgb(75,85,99)]"
              }`}
            >
              {selectionMode ? "Thoát chọn" : "Chọn nhiều"}
            </button>
            {selectionMode && selectedProductIds.size > 0 && (
              <button
                disabled={isPending}
                onClick={() => {
                  if (confirm(`Xóa ${selectedProductIds.size} sản phẩm đã chọn? Toàn bộ tài khoản thuộc các sản phẩm này cũng sẽ bị xóa!`)) {
                    startTransition(async () => {
                      const res = await deleteMultipleProductsAction([...selectedProductIds]);
                      if (res.error) alert(res.error);
                      else {
                        setSelectedProductIds(new Set());
                        alert(`Đã xóa ${selectedProductIds.size} sản phẩm.`);
                      }
                    });
                  }
                }}
                className="px-3 py-2 bg-[rgb(220,38,38)] text-white text-[12px] font-bold rounded-lg hover:bg-[rgb(185,28,28)] transition-colors disabled:opacity-50"
              >
                Xóa đã chọn ({selectedProductIds.size})
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  {selectionMode && (
                    <th className="w-10 py-3">
                      <input
                        type="checkbox"
                        checked={filteredProducts.length > 0 && filteredProducts.every((p) => selectedProductIds.has(p.id))}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-[rgb(251,191,36)] cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    ID
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Tên Sản phẩm
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Giá bán
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Danh mục
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Đã bán
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    <span className="text-[rgb(251,191,36)]">Còn</span>
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Ghim
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-[rgba(238,238,238,0.5)]">
                      Không tìm thấy sản phẩm phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                  <React.Fragment key={p.id}>
                  <tr
                    className="border-b border-[rgb(55,65,81)] cursor-pointer"
                    onClick={() => {
                      setExpandedProductId(
                        expandedProductId === p.id ? null : p.id,
                      );
                      setProductAccountSearch("");
                      setProductAccountStatusFilter("all");
                      setShowBulkAccountInput(false);
                      setBulkAccountInput("");
                      setProductAccountForm({
                        login_username: "",
                        login_password: "",
                        cost_price: 0,
                        note: "",
                        distributor_id: null,
                      });
                    }}
                  >
                    {selectionMode && (
                      <td className="py-3">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.has(p.id)}
                          onChange={() => toggleSelectProduct(p.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 accent-[rgb(251,191,36)] cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="py-3 text-white">#{p.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {p.title}
                    </td>
                    <td className="py-3 text-white">
                      {p.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-white">{p.category_name}</span>
                      {p.extra_categories.length > 0 && (
                        <span className="ml-1.5 text-[11px] text-[rgba(238,238,238,0.4)]">
                          +{p.extra_categories.length}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-[rgb(220,38,38)] font-bold">
                      {p.fake_sold_count}
                    </td>
                    <td className="py-3 text-[rgb(34,197,94)] font-bold">
                      {availableCountByProduct[p.id] || 0}
                    </td>
                    <td className="py-3">
                      <button
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            const res = await togglePinProductAction(p.id);
                            if (res.error) alert(res.error);
                          });
                        }}
                        className={`text-[16px] leading-none px-1.5 py-1 rounded transition-colors ${
                          p.is_pinned
                            ? "text-[rgb(251,191,36)] bg-[rgba(251,191,36,0.15)]"
                            : "text-[rgb(107,114,128)] hover:text-[rgb(156,163,175)]"
                        }`}
                        title={p.is_pinned ? "Bỏ ghim" : "Ghim lên đầu"}
                      >
                        📌
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            const newStatus = p.status === "available" ? "hidden" : "available";
                            const res = await updateProductAction(p.id, {
                              title: p.title,
                              category_id: p.category_id,
                              extra_categories: p.extra_categories,
                              image_url: p.image_url,
                              price: p.price,
                              original_price: p.original_price,
                              discount_percent: p.discount_percent,
                              fake_sold_count: p.fake_sold_count,
                              fake_remaining_count: p.fake_remaining_count,
                              status: newStatus,
                              is_pinned: p.is_pinned,
                              pet_tim: p.pet_tim || "",
                              san_tim: p.san_tim || "",
                              chuong: p.chuong || "",
                              extra_info: p.extra_info || "",
                            } as any);
                            if (res.error) alert(res.error);
                          });
                        }}
                        className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors ${
                          p.status === "available"
                            ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)] border-[rgb(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.3)]"
                            : "bg-[rgba(107,114,128,0.2)] text-[rgb(156,163,175)] border-[rgb(107,114,128,0.3)] hover:bg-[rgba(107,114,128,0.3)]"
                        }`}
                        title={p.status === "available" ? "Click để ẩn" : "Click để hiện"}
                      >
                        {p.status === "available" ? "Đang hiện" : "Ẩn"}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const prod = initialProducts.find(
                              (x) => x.id === p.id,
                            );
                            if (prod) {
                              setProductForm({
                                title: prod.title,
                                category_id: prod.category_id,
                                extra_categories: prod.extra_categories,
                                image_url: prod.image_url,
                                price: prod.price,
                                original_price: prod.original_price,
                                discount_percent: prod.discount_percent,
                                fake_sold_count: prod.fake_sold_count,
                                fake_remaining_count: prod.fake_remaining_count,
                                status: prod.status,
                                is_pinned: prod.is_pinned,
                                pet_tim: prod.pet_tim,
                                san_tim: prod.san_tim,
                                chuong: prod.chuong,
                                extra_info: prod.extra_info,
                                account_username: "",
                                account_password: "",
                                account_cost_price: 0,
                                account_note: "",
                              });
                              setEditingProductId(prod.id);
                              setShowAccountInProduct(false);
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
                            if (
                              confirm(
                                `Bạn có chắc chắn muốn xóa sản phẩm #${p.id}? Toàn bộ Kho Tài khoản thuộc SP này cũng sẽ BỊ XÓA! (Cân nhắc Đổi trạng thái sang Ẩn)`,
                              )
                            ) {
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
                  {expandedProductId === p.id && (
                    <tr>
                      <td colSpan={8} className="pt-2 pb-4">
                        <div className="bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)] p-4">
                          <h5 className="text-[rgb(251,191,36)] font-bold text-[14px] mb-3">
                            Kho tài khoản - {p.title}
                          </h5>

                          {/* Form thêm tài khoản */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] text-[rgba(238,238,238,0.6)]">Tài khoản ĐN *</label>
                              <input
                                type="text"
                                value={productAccountForm.login_username}
                                onChange={(e) =>
                                  setProductAccountForm({ ...productAccountForm, login_username: e.target.value })
                                }
                                className="px-2 py-1.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] text-[rgba(238,238,238,0.6)]">Mật khẩu ĐN *</label>
                              <input
                                type="text"
                                value={productAccountForm.login_password}
                                onChange={(e) =>
                                  setProductAccountForm({ ...productAccountForm, login_password: e.target.value })
                                }
                                className="px-2 py-1.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] text-[rgba(238,238,238,0.6)]">NPP</label>
                              <select
                                value={productAccountForm.distributor_id ?? ""}
                                onChange={(e) =>
                                  setProductAccountForm({
                                    ...productAccountForm,
                                    distributor_id: Number(e.target.value) || null,
                                  })
                                }
                                className="px-2 py-1.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
                              >
                                <option value="">-- Không --</option>
                                {initialDistributors.filter(d => d.is_active).map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] text-[rgba(238,238,238,0.6)]">Ghi chú</label>
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={productAccountForm.note}
                                  onChange={(e) =>
                                    setProductAccountForm({ ...productAccountForm, note: e.target.value })
                                  }
                                  className="flex-1 px-2 py-1.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
                                />
                                <button
                                  disabled={isPending}
                                  onClick={() => {
                                    if (!productAccountForm.login_username || !productAccountForm.login_password) {
                                      alert("Vui lòng nhập tài khoản và mật khẩu");
                                      return;
                                    }
                                    startTransition(async () => {
                                      const res = await createAccountAction({
                                        product_id: p.id,
                                        distributor_id: productAccountForm.distributor_id,
                                        login_username: productAccountForm.login_username,
                                        login_password: productAccountForm.login_password,
                                        cost_price: 0,
                                        status: "available",
                                        note: productAccountForm.note,
                                      });
                                      if (res.error) alert(res.error);
                                      else {
                                        setProductAccountForm({
                                          login_username: "",
                                          login_password: "",
                                          cost_price: 0,
                                          note: "",
                                          distributor_id: null,
                                        });
                                      }
                                    });
                                  }}
                                  className="px-3 py-1.5 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[12px] rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                                >
                                  {isPending ? "..." : "+ Thêm"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Nhập nhiều tài khoản */}
                          <div className="mb-4">
                            <button
                              onClick={() => setShowBulkAccountInput(!showBulkAccountInput)}
                              className="text-[12px] text-[rgb(251,191,36)] font-bold hover:underline mb-2"
                            >
                              {showBulkAccountInput ? "− Thu gọn nhập hàng loạt" : "+ Nhập hàng loạt"}
                            </button>
                            {showBulkAccountInput && (
                              <div className="bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg p-3">
                                <p className="text-[11px] text-[rgba(238,238,238,0.5)] mb-2">
                                  Mỗi dòng 1 tài khoản, cách nhau bằng dấu <span className="text-[rgb(251,191,36)]">|</span>. VD: username | password
                                </p>
                                <textarea
                                  value={bulkAccountInput}
                                  onChange={(e) => setBulkAccountInput(e.target.value)}
                                  placeholder={`acc1 | pass1\nacc2 | pass2`}
                                  rows={5}
                                  className="w-full px-3 py-2 bg-[rgb(2,6,23)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)] resize-vertical font-mono"
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    disabled={isPending || !bulkAccountInput.trim()}
                                    onClick={async () => {
                                      const lines = bulkAccountInput.trim().split('\n').filter(l => l.trim());
                                      let success = 0;
                                      let errors = 0;
                                      for (const line of lines) {
                                        const parts = line.split(/[|\t]/).map(s => s.trim());
                                        const username = parts[0];
                                        const password = parts[1] || '';
                                        if (!username || !password) { errors++; continue; }
                                        const res = await createAccountAction({
                                          product_id: p.id,
                                          distributor_id: productAccountForm.distributor_id,
                                          login_username: username,
                                          login_password: password,
                                          cost_price: 0,
                                          status: "available",
                                          note: "",
                                        });
                                        if (res.error) errors++;
                                        else success++;
                                      }
                                      alert(`Thành công: ${success} tài khoản${errors ? `, Thất bại: ${errors}` : ''}`);
                                      if (success > 0) setBulkAccountInput("");
                                    }}
                                    className="px-3 py-1.5 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[12px] rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    {isPending ? "Đang nhập..." : "Nhập tất cả"}
                                  </button>
                                  <button
                                    onClick={() => setShowBulkAccountInput(false)}
                                    className="px-3 py-1.5 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white text-[12px] rounded-lg transition-colors"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Danh sách tài khoản của sản phẩm */}
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="🔍 Tìm tài khoản..."
                              value={productAccountSearch}
                              onChange={(e) => setProductAccountSearch(e.target.value)}
                              className="flex-1 px-2 py-1.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[12px] outline-none focus:border-[rgb(251,191,36)]"
                            />
                            <select
                              value={productAccountStatusFilter}
                              onChange={(e) => setProductAccountStatusFilter(e.target.value)}
                              className="px-2 py-1.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[12px] outline-none focus:border-[rgb(251,191,36)]"
                            >
                              <option value="all">Tất cả trạng thái</option>
                              <option value="available">Tồn kho</option>
                              <option value="sold">Đã giao</option>
                              <option value="hidden">Lỗi/Ẩn</option>
                            </select>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[12px]">
                              <thead>
                                <tr className="border-b border-[rgb(75,85,99)]">
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">ID</th>
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">Username</th>
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">Password</th>
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">Giá nhập</th>
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">Trạng thái</th>
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">Sửa</th>
                                  <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">Xóa</th>
                                </tr>
                              </thead>
                              <tbody>
                                {initialAccounts.filter(a =>
                                  a.product_id === p.id &&
                                  (!productAccountSearch || a.login_username.toLowerCase().includes(productAccountSearch.toLowerCase())) &&
                                  (productAccountStatusFilter === "all" || a.status === productAccountStatusFilter)
                                ).length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="py-4 text-center text-[rgba(238,238,238,0.4)] text-[12px]">
                                      Chưa có tài khoản nào trong kho phù hợp bộ lọc.
                                    </td>
                                  </tr>
                                ) : (
                                  initialAccounts.filter(a =>
                                    a.product_id === p.id &&
                                    (!productAccountSearch || a.login_username.toLowerCase().includes(productAccountSearch.toLowerCase())) &&
                                    (productAccountStatusFilter === "all" || a.status === productAccountStatusFilter)
                                  ).map((a) => (
                                    <tr key={a.id} className="border-b border-[rgb(55,65,81)]">
                                      <td className="py-2 text-white">#{a.id}</td>
                                      <td className="py-2 text-white">{a.login_username}</td>
                                      <td className="py-2 text-white">{a.login_password}</td>
                                      <td className="py-2 text-white">{a.cost_price.toLocaleString("vi-VN")}đ</td>
                                      <td className="py-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.status === "available" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : a.status === "sold" ? "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]" : "bg-[rgba(107,114,128,0.2)] text-[rgb(156,163,175)]"}`}>
                                          {a.status === "available" ? "Tồn kho" : a.status === "sold" ? "Đã giao" : "Lỗi/Ẩn"}
                                        </span>
                                      </td>
                                      <td className="py-2">
                                        <button
                                          onClick={() => {
                                            const prod = initialProducts.find(
                                              (pr) => pr.id === a.product_id,
                                            );
                                            setSelectedCategoryForAccount(
                                              prod ? prod.category_id : 0,
                                            );
                                            setAccountForm({
                                              product_id: a.product_id,
                                              distributor_id: a.distributor_id,
                                              login_username: a.login_username,
                                              login_password: a.login_password,
                                              cost_price: a.cost_price,
                                              status: a.status,
                                              note: a.note,
                                            });
                                            setEditingAccountId(a.id);
                                            setShowAddAccount(true);
                                            setActiveTab("accounts");
                                          }}
                                          className="px-2 py-0.5 bg-[rgb(59,130,246)] text-white text-[10px] rounded hover:bg-[rgb(37,99,235)] transition-colors"
                                        >
                                          Sửa
                                        </button>
                                      </td>
                                      <td className="py-2">
                                        <button
                                          disabled={isPending}
                                          onClick={() => {
                                            if (confirm(`Xóa Acc #${a.id}?`)) {
                                              startTransition(async () => {
                                                const res = await deleteAccountAction(a.id);
                                                if (res.error) alert(res.error);
                                              });
                                            }
                                          }}
                                          className="px-2 py-0.5 bg-[rgb(220,38,38)] text-white text-[10px] rounded disabled:opacity-50"
                                        >
                                          Xóa
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts */}
      {activeTab === "accounts" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Kho Tài khoản Thực tế
            </h3>
            <button
              onClick={() => {
                setShowAddAccount(true);
                setEditingAccountId(null);
                setSelectedCategoryForAccount(0);
                setAccountForm({
                  product_id: 0,
                  distributor_id: null,
                  login_username: "",
                  login_password: "",
                  cost_price: 0,
                  status: "available",
                  note: "",
                });
              }}
              className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors"
            >
              + Thêm Account
            </button>
          </div>
          {showAddAccount && (
            <div ref={accountFormRef} className="mb-6 p-4 md:p-6 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">
                {editingAccountId
                  ? "Sửa tài khoản"
                  : "Thêm tài khoản mới (Nhập kho)"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Lọc theo Danh mục
                  </label>
                  <select
                    value={selectedCategoryForAccount}
                    onChange={(e) => {
                      setSelectedCategoryForAccount(Number(e.target.value));
                      setAccountForm({ ...accountForm, product_id: 0 });
                    }}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  >
                    <option value={0}>-- Tất cả danh mục --</option>
                    {initialCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Sản phẩm *
                  </label>
                  <select
                    value={accountForm.product_id}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        product_id: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  >
                    <option value={0}>-- Chọn Sản phẩm --</option>
                    {initialProducts
                      .filter(
                        (p) =>
                          selectedCategoryForAccount === 0 ||
                          p.category_id === selectedCategoryForAccount,
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tài khoản Đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={accountForm.login_username}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        login_username: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Mật khẩu Đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={accountForm.login_password}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        login_password: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Giá nhập (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={accountForm.cost_price}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        cost_price: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Nhà phân phối <span className="text-[rgba(238,238,238,0.3)]">(NPP)</span>
                  </label>
                  <select
                    value={accountForm.distributor_id ?? ""}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        distributor_id: Number(e.target.value) || null,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  >
                    <option value="">-- Không có NPP --</option>
                    {initialDistributors.filter(d => d.is_active).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 md:col-span-3">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Ghi chú (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nick này có thông tin Pet Tím..."
                    value={accountForm.note}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, note: e.target.value })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingAccountId
                        ? await updateAccountAction(
                            editingAccountId,
                            accountForm,
                          )
                        : await createAccountAction(accountForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(
                          editingAccountId
                            ? "Sửa thành công!"
                            : "Nhập kho thành công!",
                        );
                        setShowAddAccount(false);
                      }
                    });
                  }}
                  className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu tài khoản"}
                </button>
                <button
                  onClick={() => setShowAddAccount(false)}
                  className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
            <input
              type="text"
              placeholder="🔍 Tìm tài khoản theo username..."
              value={accountSearchTerm}
              onChange={(e) => setAccountSearchTerm(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            />
            <select
              value={selectedCategoryForAccount}
              onChange={(e) => {
                setSelectedCategoryForAccount(Number(e.target.value));
              }}
              className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            >
              <option value={0}>Tất cả danh mục</option>
              {initialCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={accountStatusFilter}
              onChange={(e) => setAccountStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Tồn kho</option>
              <option value="sold">Đã giao</option>
              <option value="hidden">Lỗi/Ẩn</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    ID Acc
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Thuộc SP
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialAccounts
                  .filter(a => {
                    if (selectedCategoryForAccount !== 0) {
                      const prod = initialProducts.find(p => p.id === a.product_id);
                      if (!prod || prod.category_id !== selectedCategoryForAccount) return false;
                    }
                    if (accountStatusFilter !== "all" && a.status !== accountStatusFilter) return false;
                    if (accountSearchTerm && !a.login_username.toLowerCase().includes(accountSearchTerm.toLowerCase())) return false;
                    return true;
                  })
                  .map((a) => (
                  <tr key={a.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{a.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {a.product_title}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          a.status === "available"
                            ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]"
                            : a.status === "sold"
                              ? "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"
                              : "bg-[rgba(107,114,128,0.2)] text-[rgb(156,163,175)]"
                        }`}
                      >
                        {a.status === "available"
                          ? "Tồn kho"
                          : a.status === "sold"
                            ? "Đã giao"
                            : "Lỗi/Ẩn"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const acc = initialAccounts.find(
                              (x) => x.id === a.id,
                            );
                            if (acc) {
                              const prod = initialProducts.find(
                                (p) => p.id === acc.product_id,
                              );
                              setSelectedCategoryForAccount(
                                prod ? prod.category_id : 0,
                              );
                              setAccountForm({
                                product_id: acc.product_id,
                                distributor_id: acc.distributor_id,
                                login_username: acc.login_username,
                                login_password: acc.login_password,
                                cost_price: acc.cost_price,
                                status: acc.status,
                                note: acc.note,
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
                            if (
                              confirm(`Bạn có chắc chắn muốn xóa Acc #${a.id}?`)
                            ) {
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
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Danh mục
            </h3>
            <button
              onClick={() => {
                setShowAddCategory(true);
                setEditingCategoryId(null);
                setCategoryForm({
                  name: "",
                  slug: "",
                  description: "",
                  image_url: "",
                  sort_order: 0,
                  fake_remaining_count: 0,
                  fake_sold_count: 0,
                });
              }}
              className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors"
            >
              + Thêm danh mục
            </button>
          </div>

          {showAddCategory && (
            <div ref={categoryFormRef} className="mb-6 p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-white font-bold text-[14px] mb-3">
                {editingCategoryId ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
                      setCategoryForm({ ...categoryForm, name, slug });
                    }}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2 border-t border-[rgba(238,238,238,0.1)] pt-3 mt-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Ảnh danh mục
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="URL hoặc tải lên file..."
                      value={categoryForm.image_url}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          image_url: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] w-full"
                    />
                    <label className="cursor-pointer px-4 py-2 bg-[rgb(55,65,81)] hover:bg-[rgb(75,85,99)] text-white text-[14px] rounded-lg border border-[rgb(75,85,99)] font-semibold transition-colors flex items-center justify-center shrink-0 w-full sm:w-auto min-w-[120px]">
                      {isUploadingCategory ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang tải...
                        </span>
                      ) : (
                        "Tải ảnh lên"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCategoryImageUpload}
                        disabled={isUploadingCategory}
                      />
                    </label>
                  </div>
                  {categoryForm.image_url && (
                    <div className="mt-2 relative w-24 h-24 border border-[rgb(75,85,99)] rounded-lg overflow-hidden bg-[rgb(17,24,39)]">
                      <img
                        src={categoryForm.image_url}
                        alt="Xem trước danh mục"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        sort_order: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Số lượng đang bán (ảo)
                  </label>
                  <input
                    type="number"
                    value={categoryForm.fake_remaining_count}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        fake_remaining_count: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Số lượng đã bán (ảo)
                  </label>
                  <input
                    type="number"
                    value={categoryForm.fake_sold_count}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        fake_sold_count: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingCategoryId
                        ? await updateCategoryAction(
                            editingCategoryId,
                            categoryForm,
                          )
                        : await createCategoryAction(categoryForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(
                          editingCategoryId
                            ? "Sửa thành công!"
                            : "Thêm thành công!",
                        );
                        setShowAddCategory(false);
                      }
                    });
                  }}
                  className="px-4 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[13px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[13px] rounded-lg transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    ID
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Tên
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Slug
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Mô tả
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Đang bán
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Đã bán
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialCategories.map((c) => (
                  <tr key={c.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{c.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {c.name}
                    </td>
                    <td className="py-3 text-[rgba(238,238,238,0.6)]">
                      {c.slug}
                    </td>
                    <td className="py-3 text-white hidden md:table-cell">
                      {c.description}
                    </td>
                    <td className="py-3 text-white font-bold">
                      {c.productCount}
                    </td>
                    <td className="py-3 text-white font-bold">{c.soldCount}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const cat = initialCategories.find(
                              (x) => x.id === c.id,
                            );
                            if (cat) {
                              setCategoryForm({
                                name: cat.name,
                                slug: cat.slug,
                                description: cat.description,
                                image_url: cat.image_url || "",
                                sort_order: cat.sort_order || 0,
                                fake_remaining_count: cat.productCount || 0,
                                fake_sold_count: cat.soldCount || 0,
                              });
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
                            if (
                              confirm(
                                `Bạn có chắc chắn muốn xóa danh mục "${c.name}"?`,
                              )
                            ) {
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
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Nhà phân phối
            </h3>
            <button
              onClick={() => {
                setShowAddDistributor(true);
                setEditingDistributorId(null);
                setDistributorForm({
                  name: "",
                  domain: "",
                  phone: "",
                  email: "",
                  address: "",
                  contact_info: "",
                  username: "",
                  password: "",
                });
              }}
              className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors"
            >
              + Thêm NPP
            </button>
          </div>

          {showAddDistributor && (
            <div ref={distributorFormRef} className="mb-6 p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">
                {editingDistributorId ? "Sửa NPP" : "Thêm NPP mới"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tên NPP *
                  </label>
                  <input
                    type="text"
                    value={distributorForm.name}
                    onChange={(e) =>
                      setDistributorForm({
                        ...distributorForm,
                        name: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tên miền *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: tftstore.vn"
                    value={distributorForm.domain}
                    onChange={(e) =>
                      setDistributorForm({
                        ...distributorForm,
                        domain: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>

                {!editingDistributorId && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                        Tên đăng nhập *
                      </label>
                      <input
                        type="text"
                        placeholder="Tên đăng nhập cho NPP"
                        value={distributorForm.username || ""}
                        onChange={(e) =>
                          setDistributorForm({
                            ...distributorForm,
                            username: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                        Mật khẩu *
                      </label>
                      <input
                        type="password"
                        placeholder="Mật khẩu đăng nhập"
                        value={distributorForm.password || ""}
                        onChange={(e) =>
                          setDistributorForm({
                            ...distributorForm,
                            password: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                      />
                    </div>
                  </>
                )}

                {editingDistributorId && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                      Mật khẩu mới (để trống nếu không đổi)
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập nếu muốn đổi mật khẩu"
                      value={distributorForm.password || ""}
                      onChange={(e) =>
                        setDistributorForm({
                          ...distributorForm,
                          password: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    SĐT
                  </label>
                  <input
                    type="text"
                    value={distributorForm.phone || ""}
                    onChange={(e) =>
                      setDistributorForm({
                        ...distributorForm,
                        phone: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={distributorForm.email || ""}
                    onChange={(e) =>
                      setDistributorForm({
                        ...distributorForm,
                        email: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={distributorForm.address || ""}
                    onChange={(e) =>
                      setDistributorForm({
                        ...distributorForm,
                        address: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Thông tin liên hệ bổ sung
                  </label>
                  <input
                    type="text"
                    value={distributorForm.contact_info || ""}
                    onChange={(e) =>
                      setDistributorForm({
                        ...distributorForm,
                        contact_info: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingDistributorId
                        ? await updateDistributorAction(
                            editingDistributorId,
                            distributorForm,
                          )
                        : await createDistributorAction(distributorForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(
                          editingDistributorId
                            ? "Sửa thành công!"
                            : "Thêm thành công!",
                        );
                        setShowAddDistributor(false);
                      }
                    });
                  }}
                  className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu NPP"}
                </button>
                <button
                  onClick={() => setShowAddDistributor(false)}
                  className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    ID
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Tên
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    SĐT
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Tên miền
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Đã bán
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Phí %
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Doanh thu
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialDistributors.map((d) => (
                  <tr key={d.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{d.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {d.name}
                    </td>
                    <td className="py-3 text-white hidden md:table-cell">
                      {d.email}
                    </td>
                    <td className="py-3 text-white">{d.phone}</td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-[rgb(59,130,246)]">{d.domain}</span>
                    </td>
                    <td className="py-3 text-white font-bold">
                      {d.totalSupplied} acc
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={d.adminFeePercent}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0 && val <= 100) {
                              startTransition(async () => {
                                await updateDistributorFeeAction(d.id, val);
                              });
                            }
                          }}
                          className="w-14 px-1.5 py-1 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded text-white text-[13px] text-center outline-none focus:border-[rgb(251,191,36)]"
                        />
                        <span className="text-[rgba(238,238,238,0.5)] text-[12px]">%</span>
                      </div>
                    </td>
                    <td className="py-3 text-white hidden md:table-cell">
                      {(() => {
                        const fee = d.adminFeePercent / 100;
                        const revenue = d.totalCostPrice * (1 - fee);
                        return (
                          <span className="text-[rgb(34,197,94)] font-bold">
                            {revenue.toLocaleString("vi-VN")}đ
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-bold ${d.is_active ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"}`}
                      >
                        {d.is_active ? "Hoạt động" : "Ngừng"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            setDistributorForm({
                              name: d.name,
                              domain: d.domain,
                              phone: d.phone,
                              email: d.email,
                              address: "",
                              contact_info: "",
                            });
                            setEditingDistributorId(d.id);
                            setShowAddDistributor(true);
                          }}
                          className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const action = d.is_active ? "khóa" : "mở khóa";
                            if (
                              confirm(
                                `Bạn có chắc chắn muốn ${action} NPP "${d.name}"?`,
                              )
                            ) {
                              startTransition(async () => {
                                const res = await toggleDistributorStatusAction(
                                  d.id,
                                );
                                if (res.error) alert(res.error);
                              });
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          {d.is_active ? "Khóa" : "Mở"}
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

      {/* Users */}
      {activeTab === "users" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-4">
            Người dùng
          </h3>

          {/* User Detail Modal */}
          {showUserDetail && selectedUserDetail && (
            <div
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={() => setShowUserDetail(false)}
            >
              <div
                className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[rgb(251,191,36)] text-[20px] font-bold">
                    Chi tiết người dùng
                  </h4>
                  <button
                    onClick={() => setShowUserDetail(false)}
                    className="text-white hover:text-[rgb(251,191,36)] text-[20px]"
                  >
                    &times;
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-[rgb(17,24,39)] rounded-lg">
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      ID:
                    </span>
                    <p className="text-white font-bold">
                      #{selectedUserDetail.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      Username:
                    </span>
                    <p className="text-[rgb(251,191,36)] font-bold">
                      {selectedUserDetail.username}
                    </p>
                  </div>
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      Email:
                    </span>
                    <p className="text-white">
                      {selectedUserDetail.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      Số dư:
                    </span>
                    <p className="text-[rgb(34,197,94)] font-bold">
                      {selectedUserDetail.balance.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      Vai trò:
                    </span>
                    <p className="text-white">{selectedUserDetail.role}</p>
                  </div>
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      Ngày tham gia:
                    </span>
                    <p className="text-white">{selectedUserDetail.joinDate}</p>
                  </div>
                  <div>
                    <span className="text-[rgba(238,238,238,0.6)] text-[12px]">
                      Trạng thái:
                    </span>
                    <p
                      className={
                        selectedUserDetail.is_active
                          ? "text-[rgb(34,197,94)]"
                          : "text-[rgb(220,38,38)]"
                      }
                    >
                      {selectedUserDetail.is_active ? "Hoạt động" : "Đã khóa"}
                    </p>
                  </div>
                </div>
                <h5 className="text-[rgb(251,191,36)] font-bold text-[14px] mb-2">
                  Lịch sử đơn hàng ({selectedUserOrders.length})
                </h5>
                {selectedUserOrders.length === 0 ? (
                  <p className="text-[rgba(238,238,238,0.5)] italic text-[13px]">
                    Chưa có đơn hàng nào.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-[rgb(75,85,99)]">
                          <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">
                            ID
                          </th>
                          <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">
                            Sản phẩm
                          </th>
                          <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">
                            Giá
                          </th>
                          <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">
                            Ngày
                          </th>
                          <th className="text-left py-2 text-[rgba(238,238,238,0.6)]">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserOrders.map((o) => (
                          <tr
                            key={o.id}
                            className="border-b border-[rgb(55,65,81)]"
                          >
                            <td className="py-2 text-white">#{o.id}</td>
                            <td className="py-2 text-[rgb(251,191,36)]">
                              {o.product}
                            </td>
                            <td className="py-2 text-white">
                              {o.amount.toLocaleString("vi-VN")}đ
                            </td>
                            <td className="py-2 text-white">{o.date}</td>
                            <td className="py-2">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${o.status === "completed" ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : o.status === "pending" ? "bg-[rgba(251,191,36,0.2)] text-[rgb(251,191,36)]" : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"}`}
                              >
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    ID
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Username
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Số dư
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Tham gia
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Đã mua
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{u.id}</td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {u.username}
                    </td>
                    <td className="py-3 text-white hidden md:table-cell">
                      {u.email || "N/A"}
                    </td>
                    <td className="py-3 text-white">
                      {u.balance.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-3 text-white hidden md:table-cell">
                      {u.joinDate}
                    </td>
                    <td className="py-3 text-white font-bold">
                      {u.totalPurchased}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            startTransition(async () => {
                              const res = await getUserDetailAction(u.id);
                              if (res.error) alert(res.error);
                              else if (res.user && res.orders) {
                                setSelectedUserDetail(res.user);
                                setSelectedUserOrders(res.orders);
                                setShowUserDetail(true);
                              }
                            });
                          }}
                          className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Xem
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const action = "khóa";
                            if (
                              confirm(
                                `Bạn có chắc chắn muốn khóa tài khoản "${u.username}"? Người dùng này sẽ không thể đăng nhập.`,
                              )
                            ) {
                              startTransition(async () => {
                                const res = await toggleUserLockAction(u.id);
                                if (res.error) alert(res.error);
                              });
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(220,38,38)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Khóa
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

      {/* Orders */}
      {activeTab === "orders" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold mb-4">
            Đơn hàng
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    ID
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Người mua
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Sản phẩm
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Giá
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Ngày
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{o.id}</td>
                    <td className="py-3 text-[rgb(59,130,246)] font-bold">
                      {o.user}
                    </td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {o.product}
                    </td>
                    <td className="py-3 text-white">
                      {o.amount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-3 text-white hidden md:table-cell">
                      {o.date}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          o.status === "completed"
                            ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]"
                            : o.status === "pending"
                              ? "bg-[rgba(251,191,36,0.2)] text-[rgb(251,191,36)]"
                              : o.status === "refunded"
                                ? "bg-[rgba(59,130,246,0.2)] text-[rgb(59,130,246)]"
                                : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"
                        }`}
                      >
                        {o.status === "completed"
                          ? "Hoàn thành"
                          : o.status === "pending"
                            ? "Chờ xử lý"
                            : o.status === "refunded"
                              ? "Hoàn tiền"
                              : "Đã hủy"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === "notifications" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Thông báo
            </h3>
            <button
              onClick={() => {
                setShowAddNotification(true);
                setEditingNotificationId(null);
                setNotificationForm({
                  title: "",
                  content: "",
                  image_url: "",
                  is_pinned: false,
                  is_active: true,
                });
              }}
              className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors"
            >
              + Thêm Thông Báo
            </button>
          </div>

          {showAddNotification && (
            <div ref={notificationFormRef} className="mb-6 p-4 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)] animate-fade-in">
              <h4 className="text-white font-bold text-[14px] mb-3">
                {editingNotificationId ? "Sửa thông báo" : "Thêm thông báo mới"}
              </h4>
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        title: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] w-full"
                  />
                </div>

                <div className="flex flex-col gap-1 border-t border-[rgba(238,238,238,0.1)] pt-3 mt-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Ảnh thông báo
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="URL ảnh hoặc tải lên file..."
                      value={notificationForm.image_url}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          image_url: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] w-full"
                    />
                    <label className="cursor-pointer px-4 py-2 bg-[rgb(55,65,81)] hover:bg-[rgb(75,85,99)] text-white text-[14px] rounded-lg border border-[rgb(75,85,99)] font-semibold transition-colors flex items-center justify-center shrink-0 w-full sm:w-auto min-w-[120px]">
                      {isUploadingNotification ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang tải...
                        </span>
                      ) : (
                        "Tải ảnh lên"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleNotificationImageUpload}
                        disabled={isUploadingNotification}
                      />
                    </label>
                  </div>
                  {notificationForm.image_url && (
                    <div className="mt-2 relative w-24 h-24 border border-[rgb(75,85,99)] rounded-lg overflow-hidden bg-[rgb(17,24,39)]">
                      <img
                        src={notificationForm.image_url}
                        alt="Xem trước thông báo"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Nội dung (hỗ trợ xuống dòng) *
                  </label>
                  <textarea
                    rows={4}
                    value={notificationForm.content}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        content: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] w-full"
                  />
                </div>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-[14px] text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationForm.is_pinned}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          is_pinned: e.target.checked,
                        })
                      }
                      className="accent-[rgb(251,191,36)]"
                    />
                    Ghim lên đầu
                  </label>
                  <label className="flex items-center gap-2 text-[14px] text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationForm.is_active}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          is_active: e.target.checked,
                        })
                      }
                      className="accent-[rgb(251,191,36)]"
                    />
                    Hiển thị (Kích hoạt)
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = editingNotificationId
                        ? await updateNotificationAction(
                            editingNotificationId,
                            notificationForm,
                          )
                        : await createNotificationAction(notificationForm);
                      if (res.error) alert(res.error);
                      else {
                        alert(
                          editingNotificationId
                            ? "Sửa thành công!"
                            : "Thêm thành công!",
                        );
                        setShowAddNotification(false);
                      }
                    });
                  }}
                  className="px-4 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[13px] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={() => setShowAddNotification(false)}
                  className="px-4 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[13px] rounded-lg transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] w-12">
                    ID
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] w-20">
                    Ảnh
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">
                    Tiêu đề
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] hidden md:table-cell">
                    Nội dung
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] w-20">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)] w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialNotifications.map((n) => (
                  <tr key={n.id} className="border-b border-[rgb(55,65,81)]">
                    <td className="py-3 text-white">#{n.id}</td>
                    <td className="py-3">
                      {n.image_url ? (
                        <div className="w-12 h-8 border border-[rgb(75,85,99)] rounded overflow-hidden bg-[rgb(17,24,39)]">
                          <img
                            src={n.image_url}
                            alt={n.title || "Hình ảnh thông báo"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-[rgba(238,238,238,0.4)]">
                          Không có
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-[rgb(251,191,36)] font-semibold">
                      {n.is_pinned && (
                        <span className="mr-1 text-[11px] bg-red-600/30 text-red-400 px-1 py-0.5 rounded font-bold">
                          PIN
                        </span>
                      )}
                      {n.title}
                    </td>
                    <td
                      className="py-3 text-white hidden md:table-cell max-w-xs truncate"
                      title={n.content}
                    >
                      {n.content}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-bold ${n.is_active ? "bg-[rgba(34,197,94,0.2)] text-[rgb(34,197,94)]" : "bg-[rgba(220,38,38,0.2)] text-[rgb(220,38,38)]"}`}
                      >
                        {n.is_active ? "Hiện" : "Ẩn"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const notif = initialNotifications.find(
                              (x) => x.id === n.id,
                            );
                            if (notif) {
                              setNotificationForm({
                                title: notif.title,
                                content: notif.content,
                                image_url: notif.image_url || "",
                                is_pinned: notif.is_pinned,
                                is_active: notif.is_active,
                              });
                              setEditingNotificationId(notif.id);
                              setShowAddNotification(true);
                            }
                          }}
                          className="px-2 py-1 bg-[rgb(59,130,246)] text-white text-[11px] rounded disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => {
                            if (
                              confirm(
                                `Bạn có chắc chắn muốn xóa thông báo #${n.id}?`,
                              )
                            ) {
                              startTransition(async () => {
                                const res = await deleteNotificationAction(
                                  n.id,
                                );
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

      {/* Quay Random tab */}
      {activeTab === "spin" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Cấu hình Quay Random
            </h3>
          </div>
          <p className="text-[rgba(238,238,238,0.5)] text-[13px] mb-4">
            Bật/Tắt danh mục được phép quay random. Hệ thống sẽ chọn random 1 account <strong className="text-[rgb(34,197,94)]">còn hàng</strong> từ các danh mục được bật.
          </p>
          <div className="flex items-center gap-3 mb-4 p-3 bg-[rgb(17,24,39)] rounded-lg border border-[rgb(75,85,99)]">
            <span className="text-[rgba(238,238,238,0.7)] text-[13px] whitespace-nowrap">Chi phí mỗi lượt quay:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={spinCostInput}
                onChange={(e) => setSpinCostInput(e.target.value)}
                min={1000}
                max={1000000}
                step={1000}
                className="w-28 px-3 py-1.5 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[13px] outline-none focus:border-[rgb(251,191,36)]"
              />
              <span className="text-[rgba(238,238,238,0.5)] text-[13px]">đ</span>
            </div>
            <button
              disabled={savingSpinCost}
              onClick={async () => {
                const val = parseInt(spinCostInput, 10);
                if (isNaN(val) || val < 1000) { alert("Chi phí tối thiểu 1.000đ"); return; }
                if (val > 1000000) { alert("Chi phí tối đa 1.000.000đ"); return; }
                setSavingSpinCost(true);
                const res = await updateSpinCostAction(val);
                setSavingSpinCost(false);
                if (res.error) alert(res.error);
                else {
                  setSpinCost(res.cost!);
                  setSpinCostInput(String(res.cost!));
                }
              }}
              className="px-3 py-1.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black text-[12px] font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {savingSpinCost ? "Đang lưu..." : "Lưu"}
            </button>
            <span className="text-[rgba(238,238,238,0.4)] text-[11px]">
              Đang áp dụng: <strong className="text-[rgb(251,191,36)]">{spinCost.toLocaleString("vi-VN")}đ</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] md:text-[14px]">
              <thead>
                <tr className="border-b border-[rgb(75,85,99)]">
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Danh mục</th>
                  <th className="text-left py-3 text-[rgba(238,238,238,0.6)]">Acc còn trong kho</th>
                  <th className="text-center py-3 text-[rgba(238,238,238,0.6)]">Cho phép quay</th>
                </tr>
              </thead>
              <tbody>
                {spinCategories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[rgba(238,238,238,0.5)]">
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                ) : (
                  spinCategories.map((cat) => (
                    <tr key={cat.id} className="border-b border-[rgb(55,65,81)]">
                      <td className="py-3 text-white font-semibold">{cat.name}</td>
                      <td className="py-3">
                        <span className={`font-bold ${cat.available_accounts > 0 ? "text-[rgb(34,197,94)]" : "text-[rgb(220,38,38)]"}`}>
                          {cat.available_accounts}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const nextVal = !cat.is_spin_enabled;
                            setSpinCategories(prev =>
                              prev.map(c => c.id === cat.id ? { ...c, is_spin_enabled: nextVal } : c)
                            );
                            startTransition(async () => {
                              const res = await toggleCategorySpinAction(cat.id, nextVal);
                              if (res.error) {
                                alert(res.error);
                                setSpinCategories(prev =>
                                  prev.map(c => c.id === cat.id ? { ...c, is_spin_enabled: !nextVal } : c)
                                );
                              }
                            });
                          }}
                          className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${
                            cat.is_spin_enabled ? "bg-[rgb(34,197,94)]" : "bg-[rgb(75,85,99)]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              cat.is_spin_enabled ? "translate-x-[26px]" : "translate-x-[2px]"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Options */}
      {activeTab === "options" && (
        <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold">
              Danh sách Pet Tím / Sàn Đấu / Chưởng
            </h3>
            <button
              onClick={() => {
                setShowAddOption(true);
                setEditingOptionId(null);
                setOptionType("pet_tim");
                setOptionName("");
              }}
              className="px-3 md:px-4 py-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] md:text-[14px] rounded-lg transition-colors"
            >
              + Thêm
            </button>
          </div>

          {showAddOption && (
            <div className="mb-6 p-4 md:p-6 bg-[rgb(31,41,55)] rounded-lg border border-[rgb(75,85,99)]">
              <h4 className="text-[rgb(251,191,36)] font-bold text-[16px] mb-4">
                {editingOptionId ? "Sửa" : "Thêm mới"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Loại
                  </label>
                  <select
                    value={optionType}
                    onChange={(e) =>
                      setOptionType(
                        e.target.value as "pet_tim" | "san_tim" | "chuong",
                      )
                    }
                    disabled={!!editingOptionId}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)] disabled:opacity-50"
                  >
                    <option value="pet_tim">Pet Tím</option>
                    <option value="san_tim">Sàn Đấu</option>
                    <option value="chuong">Chưởng</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[rgba(238,238,238,0.6)]">
                    Tên {editingOptionId ? "mới" : ""}
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Chibi Soraka - Chuối Tí Nị"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    className="px-3 py-2 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] outline-none focus:border-[rgb(251,191,36)]"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = editingOptionId
                          ? await updateProductOption(
                              editingOptionId,
                              optionName,
                            )
                          : await createProductOption(optionType, optionName);
                        if (res.error) alert(res.error);
                        else {
                          setShowAddOption(false);
                          setAllOptions(await getAllProductOptions());
                        }
                      });
                    }}
                    className="px-5 py-2 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isPending ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    onClick={() => setShowAddOption(false)}
                    className="px-5 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors disabled:opacity-50"
                    disabled={isPending}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {(["pet_tim", "san_tim", "chuong"] as const).map((type) => {
            const items = allOptions.filter((o) => o.type === type);
            const typeLabel =
              type === "pet_tim"
                ? "Pet Tím"
                : type === "san_tim"
                  ? "Sàn Đấu"
                  : "Chưởng";
            return (
              <div key={type} className="mb-4">
                <h4 className="text-white font-bold text-[14px] mb-2 border-b border-[rgb(75,85,99)] pb-1">
                  {typeLabel} ({items.length})
                </h4>
                {items.length === 0 ? (
                  <p className="text-[rgba(238,238,238,0.5)] italic text-[13px]">
                    Chưa có dữ liệu
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((o) => (
                      <div
                        key={o.id}
                        className="group flex items-center gap-1 px-2.5 py-1 bg-[rgb(17,24,39)] border border-[rgb(75,85,99)] rounded-lg text-white text-[12px]"
                      >
                        <span>{o.name}</span>
                        <button
                          onClick={() => {
                            setEditingOptionId(o.id);
                            setOptionType(
                              o.type as "pet_tim" | "san_tim" | "chuong",
                            );
                            setOptionName(o.name);
                            setShowAddOption(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[rgb(59,130,246)] hover:text-[rgb(96,165,250)] text-[13px] ml-1 transition-opacity"
                          title="Sửa"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Xóa "${o.name}"?`)) {
                              startTransition(async () => {
                                const res = await deleteProductOption(o.id);
                                if (res.error) alert(res.error);
                                else
                                  setAllOptions(await getAllProductOptions());
                              });
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[rgb(220,38,38)] hover:text-[rgb(248,113,113)] text-[13px] transition-opacity"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
