"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { spinAction, spinCategoryAction } from "@/app/actions/random-spin";
import { getBalanceAction } from "@/app/actions/auth";
import { CldImage, cloudinaryUrl } from "@/lib/cloudinary-url";

export interface SpinProduct {
  id: number;
  title: string;
  image_url: string;
  price: number;
  original_price: number;
  discount_percent: number;
  category_name: string;
  category_slug: string;
  available_accounts: number;
}

interface RandomSpinProps {
  isLoggedIn: boolean;
  userId: number | null;
  balance: number;
  spinProducts: SpinProduct[];
  spinCost?: number;
  spinCategoryId?: number | null;
}

export function RandomSpin({ isLoggedIn, userId, balance, spinProducts, spinCost = 10000, spinCategoryId }: RandomSpinProps) {
  const [phase, setPhase] = useState<"idle" | "spinning" | "result" | "error">("idle");
  const [result, setResult] = useState<{
    category: { name: string; slug: string; image_url: string };
    product: { title: string; image_url: string };
    account: { login_username: string; login_password: string };
  } | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [spinProduct, setSpinProduct] = useState<SpinProduct | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("50000");
  const [showQR, setShowQR] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [depositNotification, setDepositNotification] = useState<{ amount: number } | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const initialBalanceRef = useRef(balance);

  // Poll balance after QR is shown to detect incoming deposit
  useEffect(() => {
    if (!showQR || !isLoggedIn) return;

    const initial = displayBalance;
    initialBalanceRef.current = initial;

    pollingRef.current = setInterval(async () => {
      const res = await getBalanceAction();
      if (res.balance !== undefined && res.balance > initialBalanceRef.current) {
        const deposited = res.balance - initialBalanceRef.current;
        setDisplayBalance(res.balance);
        setDepositNotification({ amount: deposited });
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = undefined;
        }
      }
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = undefined;
      }
    };
  }, [showQR, isLoggedIn]);
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "TPBANK";
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || "08040125109";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER || "TRINH HUU HUYNH";

  const pickRandomProduct = () => {
    if (spinProducts.length === 0) return null;
    return spinProducts[Math.floor(Math.random() * spinProducts.length)];
  };

  const handleSpin = async () => {
    if (phase === "spinning") return;

    setPhase("spinning");
    setError("");
    setProgress(0);
    setSpinProduct(pickRandomProduct());

    const totalCycles = 20 + Math.floor(Math.random() * 10);

    const animate = (cycle: number) => {
      setProgress(Math.round((cycle / totalCycles) * 100));
      setSpinProduct(pickRandomProduct());

      if (cycle >= totalCycles) {
        doSpin();
        return;
      }

      const slowdown = 1 + (cycle / totalCycles) * 2.5;
      const delay = Math.round(50 * slowdown);
      timerRef.current = setTimeout(() => animate(cycle + 1), delay);
    };

    animate(1);
  };

  const doSpin = async () => {
    const res = spinCategoryId ? await spinCategoryAction(spinCategoryId) : await spinAction();

    if (res.error) {
      setError(res.error);
      setPhase("error");
      setProgress(100);
      return;
    }

    setDisplayBalance(prev => prev - spinCost);
    setResult(res as any);
    setPhase("result");
    setProgress(100);
  };

  const canSpin = isLoggedIn && displayBalance >= spinCost;

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-[480px]">
      {isLoggedIn && phase === "idle" && (
        <div className="w-full bg-gradient-to-r from-[rgb(202,138,4,0.15)] to-[rgb(251,191,36,0.08)] border border-[rgb(251,191,36,0.3)] rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[rgb(251,191,36,0.15)] flex items-center justify-center">
              <i className="fa-solid fa-coins text-[rgb(251,191,36)] text-[16px]" />
            </div>
            <span className="text-[rgba(238,238,238,0.7)] text-[14px]">Số dư của bạn</span>
          </div>
          <span className="text-[rgb(251,191,36)] text-[20px] md:text-[22px] font-bold tracking-wide">{displayBalance.toLocaleString("vi-VN")}<span className="text-[15px] md:text-[16px]">đ</span></span>
        </div>
      )}

      {/* Deposit success notification */}
      {depositNotification && (
        <div className="w-full bg-[rgba(34,197,94,0.12)] border border-[rgb(34,197,94)] rounded-xl px-5 py-4 flex items-start gap-3 animate-fade-in-up">
          <div className="w-10 h-10 rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-[rgb(34,197,94)] text-[20px]" />
          </div>
          <div className="flex-1">
            <p className="text-white text-[14px] font-bold">Nạp tiền thành công!</p>
            <p className="text-[rgba(238,238,238,0.6)] text-[13px] mt-0.5">
              Bạn vừa được cộng <span className="text-[rgb(34,197,94)] font-bold">{depositNotification.amount.toLocaleString("vi-VN")}đ</span> vào tài khoản.
            </p>
          </div>
          <button
            onClick={() => setDepositNotification(null)}
            className="text-[rgba(238,238,238,0.3)] hover:text-white transition-colors shrink-0"
          >
            <i className="fa-solid fa-xmark text-[18px]" />
          </button>
        </div>
      )}
      <div className="w-full">
        {phase === "idle" && (
          <div className="flex flex-col items-center justify-center w-full aspect-[4/3] bg-[rgb(17,24,39)] rounded-2xl border-2 border-dashed border-[rgb(251,191,36)] gap-4">
            <i className="fa-solid fa-dice text-[56px] md:text-[72px] text-[rgb(251,191,36)]" />
            <p className="text-[rgb(251,191,36)] text-[18px] md:text-[22px] font-bold text-center px-6 leading-relaxed">
              Quay Random may mắn!
            </p>
            <p className="text-[rgba(238,238,238,0.5)] text-[14px]">
              Chi phí: <span className="text-[rgb(251,191,36)] font-bold">{spinCost.toLocaleString("vi-VN")}đ</span> / lượt
            </p>
            {!isLoggedIn && (
              <Link href="/login" className="text-[rgb(59,130,246)] text-[14px] font-semibold hover:underline">
                Đăng nhập để quay
              </Link>
            )}
            {isLoggedIn && !canSpin && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-[rgb(220,38,38)] text-[13px]">
                  Số dư không đủ. Vui lòng nạp thêm tiền.
                </p>
                <button
                  onClick={() => setShowTopup(true)}
                  className="px-4 py-1.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[12px] rounded-lg transition-colors"
                >
                  Nạp tiền ngay
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "spinning" && (
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[rgb(251,191,36)] relative bg-[rgb(17,24,39)]">
            {spinProduct && spinProduct.image_url ? (
              <CldImage
                src={cloudinaryUrl(spinProduct.image_url)}
                fill
                alt={spinProduct.title}
                className="object-contain p-4 md:p-8 animate-pulse"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="fa-solid fa-dice text-[72px] md:text-[96px] text-[rgb(251,191,36)] animate-bounce" />
              </div>
            )}
            {spinProduct && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(2,6,23,0.95)] to-transparent p-4 pt-12">
                <p className="text-white text-[13px] md:text-[15px] font-semibold text-center truncate">
                  {spinProduct.title}
                </p>
                <p className="text-[rgba(238,238,238,0.4)] text-[11px] text-center">
                  {spinProduct.category_name}
                </p>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.1)]">
              <div
                className="h-full bg-[rgb(251,191,36)] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute top-3 left-3 bg-[rgba(0,0,0,0.6)] px-3 py-1 rounded-full">
              <span className="text-[rgb(251,191,36)] text-[13px] font-bold">ĐANG QUAY...</span>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center justify-center w-full aspect-[4/3] bg-[rgb(17,24,39)] rounded-2xl border-2 border-[rgb(220,38,38)] gap-4 p-6">
            <i className="fa-solid fa-circle-exclamation text-[48px] text-[rgb(248,113,113)]" />
            <p className="text-[rgb(248,113,113)] text-[16px] font-semibold text-center">{error}</p>
            <button
              onClick={() => setPhase("idle")}
              className="px-6 py-2 bg-[rgb(75,85,99)] hover:bg-[rgb(107,114,128)] text-white font-bold text-[14px] rounded-lg transition-colors"
            >
                Quay lại
            </button>
          </div>
        )}

        {phase === "result" && result && (
          <div className="w-full rounded-2xl overflow-hidden border-2 border-[rgb(253,230,138)] animate-fade-in-up">
            <div className="w-full aspect-[4/3] relative">
              <CldImage
                src={cloudinaryUrl(result.product.image_url)}
                fill
                alt={result.product.title}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.95)] via-transparent to-transparent flex flex-col justify-end p-4 md:p-6">
                <p className="text-white text-[13px] md:text-[14px] mb-1">Chúc mừng! Bạn đã nhận:</p>
                <h3 className="font-bold text-[rgb(251,191,36)] text-[20px] md:text-[28px] leading-tight">
                  {result.product.title}
                </h3>
              </div>
            </div>
            <div className="bg-[rgb(2,6,23)] p-4 md:p-5 flex flex-col gap-3">
              <div className="bg-[rgb(15,23,42)] border border-[rgb(75,85,99)] rounded-lg p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[rgba(238,238,238,0.6)] text-[13px]">Tài khoản:</span>
                  <span className="text-white font-mono font-bold text-[14px] select-all">{result.account.login_username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgba(238,238,238,0.6)] text-[13px]">Mật khẩu:</span>
                  <span className="text-white font-mono font-bold text-[14px] select-all">{result.account.login_password}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/category/${result.category.slug}`}
                  className="flex-1 px-4 py-2.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] text-black font-bold text-[14px] text-center rounded-lg transition-colors"
                >
                    Xem thêm danh mục
                </Link>
                <button
                  onClick={() => setPhase("idle")}
                  className="px-4 py-2.5 bg-[rgb(55,65,81)] hover:bg-[rgb(75,85,99)] text-white font-bold text-[14px] rounded-lg transition-colors"
                >
                    Quay tiếp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {phase !== "spinning" && phase !== "result" && (
        <button
          onClick={handleSpin}
          disabled={!canSpin}
          className="w-full max-w-[320px] px-8 py-3.5 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-[18px] md:text-[22px] rounded-lg md:rounded-none md:clip-button transition-all duration-200"
        >
           QUAY RANDOM - {spinCost.toLocaleString("vi-VN")}đ
        </button>
      )}

      {isLoggedIn && phase === "idle" && (
        <div className="w-full">
          <button
            onClick={() => { setShowTopup(!showTopup); setShowQR(false); }}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[rgb(17,24,39)] border border-[rgb(75,85,99,0.5)] hover:border-[rgb(251,191,36,0.3)] rounded-xl transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-plus text-[rgb(34,197,94)] text-[16px]" />
              <span className="text-white text-[14px] font-semibold">Nạp tiền</span>
            </div>
            <i className={`fa-solid fa-chevron-down text-[rgba(238,238,238,0.4)] text-[12px] transition-transform ${showTopup ? "rotate-180" : ""}`} />
          </button>

          {showTopup && (
            <div className="mt-3 bg-[rgb(17,24,39)] border border-[rgb(75,85,99,0.5)] rounded-xl p-4 animate-fade-in-up">
              <p className="text-[rgba(238,238,238,0.5)] text-[12px] mb-3">Chọn số tiền muốn nạp</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[50000, 100000, 200000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setTopupAmount(String(amount)); setShowQR(false); }}
                    className={`py-2.5 rounded-lg font-bold text-[13px] transition-colors border ${
                      topupAmount === String(amount)
                        ? "bg-[rgb(202,138,4)] text-black border-[rgb(251,191,36)]"
                        : "bg-[rgb(31,41,55)] text-white border-[rgb(75,85,99)] hover:border-[rgb(251,191,36)]"
                    }`}
                  >
                    {amount.toLocaleString("vi-VN")}đ
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowQR(true)}
                className="w-full py-2.5 bg-[rgb(34,197,94)] hover:bg-[rgb(22,163,74)] text-white font-bold text-[14px] rounded-lg transition-colors mb-3"
              >
                Tạo mã QR nạp tiền
              </button>

              {showQR && (
                <div className="flex flex-col items-center gap-3 animate-fade-in-up">
                  <div className="bg-white rounded-xl p-2">
                    <img
                      src={`https://img.vietqr.io/image/${bankName}-${bankAccount}-compact.png?amount=${topupAmount}&addInfo=BOMRAU%20NAP%20${userId}`}
                      alt="VietQR"
                      className="w-[160px] h-[160px] object-contain"
                    />
                  </div>
                  <div className="w-full text-[13px]">
                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99,0.5)]">
                      <span className="text-[rgba(238,238,238,0.5)]">Ngân hàng</span>
                      <span className="text-white font-semibold">{bankName === "MB" ? "MB Bank" : bankName}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99,0.5)]">
                      <span className="text-[rgba(238,238,238,0.5)]">STK</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{bankAccount}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(bankAccount); setCopiedField("stk"); setTimeout(() => setCopiedField(""), 1500); }}
                          className="text-[rgb(251,191,36)] text-[11px] hover:underline cursor-pointer"
                        >
                          {copiedField === "stk" ? "Đã chép" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99,0.5)]">
                      <span className="text-[rgba(238,238,238,0.5)]">Chủ TK</span>
                      <span className="text-white font-semibold uppercase">{bankHolder}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[rgb(75,85,99,0.5)]">
                      <span className="text-[rgba(238,238,238,0.5)]">Số tiền</span>
                      <span className="text-[rgb(251,191,36)] font-bold">{Number(topupAmount).toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[rgba(238,238,238,0.5)]">Nội dung CK</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-extrabold bg-[rgba(251,191,36,0.15)] px-2 py-0.5 rounded text-[13px]">BOMRAU NAP {userId}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(`BOMRAU NAP ${userId}`); setCopiedField("content"); setTimeout(() => setCopiedField(""), 1500); }}
                          className="text-[rgb(251,191,36)] text-[11px] hover:underline cursor-pointer"
                        >
                          {copiedField === "content" ? "Đã chép" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[rgba(238,238,238,0.4)] text-[11px] leading-relaxed text-center">
                    Chuyển đúng nội dung trên để hệ thống tự động cộng tiền sau 1-2 phút.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
