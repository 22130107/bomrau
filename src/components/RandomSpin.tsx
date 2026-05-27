"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { spinAction } from "@/app/actions/random-spin";

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
  balance: number;
  spinProducts: SpinProduct[];
}

export function RandomSpin({ isLoggedIn, balance, spinProducts }: RandomSpinProps) {
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
    const res = await spinAction();

    if (res.error) {
      setError(res.error);
      setPhase("error");
      setProgress(100);
      return;
    }

    setResult(res as any);
    setPhase("result");
    setProgress(100);
  };

  const SPIN_COST = 10000;
  const canSpin = isLoggedIn && balance >= SPIN_COST;

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
          <span className="text-[rgb(251,191,36)] text-[20px] md:text-[22px] font-bold tracking-wide">{balance.toLocaleString("vi-VN")}<span className="text-[15px] md:text-[16px]">đ</span></span>
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
              Chi phí: <span className="text-[rgb(251,191,36)] font-bold">{SPIN_COST.toLocaleString("vi-VN")}đ</span> / lượt
            </p>
            {!isLoggedIn && (
              <Link href="/login" className="text-[rgb(59,130,246)] text-[14px] font-semibold hover:underline">
                Đăng nhập để quay
              </Link>
            )}
            {isLoggedIn && !canSpin && (
              <p className="text-[rgb(220,38,38)] text-[13px]">
                Số dư không đủ. Vui lòng nạp thêm tiền.
              </p>
            )}
          </div>
        )}

        {phase === "spinning" && (
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[rgb(251,191,36)] relative bg-[rgb(17,24,39)]">
            {spinProduct && spinProduct.image_url ? (
              <img
                src={spinProduct.image_url}
                alt={spinProduct.title}
                className="w-full h-full object-contain p-4 md:p-8 animate-pulse"
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
              <img
                src={result.product.image_url}
                alt={result.product.title}
                className="w-full h-full object-cover"
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
           QUAY RANDOM - {SPIN_COST.toLocaleString("vi-VN")}đ
        </button>
      )}


    </div>
  );
}
