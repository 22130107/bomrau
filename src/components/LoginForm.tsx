"use client";

import { useState, useActionState } from "react";
import { loginAction, registerAction, AuthState } from "@/app/actions/auth";

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginState, loginFormAction, loginPending] = useActionState<AuthState, FormData>(
    loginAction,
    null
  );
  const [registerState, registerFormAction, registerPending] = useActionState<AuthState, FormData>(
    registerAction,
    null
  );

  const error = isLogin ? loginState?.error : registerState?.error;
  const isPending = isLogin ? loginPending : registerPending;

  return (
    <div className="w-full max-w-[420px] animate-fade-in-up">
      <div className="bg-[rgb(2,6,23)] border border-[rgb(253,230,138)] rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-[rgb(253,230,138)]">
          <button
            id="tab-login"
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 text-[16px] md:text-[18px] font-bold transition-colors ${
              isLogin
                ? "text-[rgb(251,191,36)] border-b-2 border-[rgb(251,191,36)]"
                : "text-[rgba(238,238,238,0.5)] hover:text-[rgba(238,238,238,0.8)]"
            }`}
          >
            Đăng Nhập
          </button>
          <button
            id="tab-register"
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 text-[16px] md:text-[18px] font-bold transition-colors ${
              !isLogin
                ? "text-[rgb(251,191,36)] border-b-2 border-[rgb(251,191,36)]"
                : "text-[rgba(238,238,238,0.5)] hover:text-[rgba(238,238,238,0.8)]"
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-[rgba(220,38,38,0.15)] border border-[rgb(220,38,38)] rounded-lg flex items-center gap-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[rgb(220,38,38)] shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <p className="text-[rgb(220,38,38)] text-[13px]">{error}</p>
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form action={loginFormAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="login-username" className="text-[14px] text-[rgba(238,238,238,0.7)]">
                Tên đăng nhập
              </label>
              <input
                id="login-username"
                type="text"
                name="username"
                required
                placeholder="Nhập tên đăng nhập"
                className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] md:text-[16px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.3)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="text-[14px] text-[rgba(238,238,238,0.7)]">
                Mật khẩu
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] md:text-[16px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.3)]"
              />
            </div>
            <button
              id="btn-login"
              type="submit"
              disabled={isPending}
              className="w-full py-3 mt-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-[16px] md:text-[18px] rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form action={registerFormAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-username" className="text-[14px] text-[rgba(238,238,238,0.7)]">
                Tên đăng nhập <span className="text-[rgb(220,38,38)]">*</span>
              </label>
              <input
                id="reg-username"
                type="text"
                name="username"
                required
                placeholder="Tối thiểu 3 ký tự, chỉ chữ/số/_"
                className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] md:text-[16px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.3)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-email" className="text-[14px] text-[rgba(238,238,238,0.7)]">
                Email <span className="text-[rgba(238,238,238,0.4)] text-[12px]">(tuỳ chọn)</span>
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="Nhập email (không bắt buộc)"
                className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] md:text-[16px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.3)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-password" className="text-[14px] text-[rgba(238,238,238,0.7)]">
                Mật khẩu <span className="text-[rgb(220,38,38)]">*</span>
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] md:text-[16px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.3)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-confirm" className="text-[14px] text-[rgba(238,238,238,0.7)]">
                Xác nhận mật khẩu <span className="text-[rgb(220,38,38)]">*</span>
              </label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                required
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 bg-[rgb(31,41,55)] border border-[rgb(75,85,99)] rounded-lg text-white text-[14px] md:text-[16px] outline-none focus:border-[rgb(251,191,36)] transition-colors placeholder:text-[rgba(238,238,238,0.3)]"
              />
            </div>
            <button
              id="btn-register"
              type="submit"
              disabled={isPending}
              className="w-full py-3 mt-2 bg-[rgb(202,138,4)] hover:bg-[rgb(251,191,36)] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-[16px] md:text-[18px] rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đăng ký...
                </>
              ) : (
                "Đăng Ký"
              )}
            </button>
          </form>
        )}

        {/* Session info */}
        <div className="mt-5 flex items-center gap-2 justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[rgba(238,238,238,0.4)]">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span className="text-[12px] text-[rgba(238,238,238,0.4)]">Phiên đăng nhập tự động hết hạn sau 10 phút</span>
        </div>

        <p className="text-center mt-4 text-[14px] text-[rgba(238,238,238,0.7)]">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[rgb(251,191,36)] font-semibold hover:underline"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}
