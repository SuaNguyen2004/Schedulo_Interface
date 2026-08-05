import React, { useState, useEffect } from "react";
import { User } from "../types";
import {
  Calendar,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  X,
  AlertCircle,
} from "lucide-react";

interface AuthViewProps {
  mode: "sign_in" | "sign_up";
  onSuccessLogin: (user: User) => void;
  onSwitchMode: (mode: "sign_in" | "sign_up") => void;
  allUsers: User[];
}

export const AuthView: React.FC<AuthViewProps> = ({
  mode,
  onSuccessLogin,
  onSwitchMode,
  allUsers,
}) => {
  // Sign In Form State
  const [loginUsername, setLoginUsername] = useState<string>("nguyen.van.a");
  const [loginPassword, setLoginPassword] = useState<string>("123456");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up Form State
  const [regUsername, setRegUsername] = useState<string>("");
  const [regFullName, setRegFullName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
  const [regCccd, setRegCccd] = useState<string>("");
  const [regDob, setRegDob] = useState<string>("1998-05-15");
  const [regAddress, setRegAddress] = useState<string>("Hà Nội");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState<number>(59);

  useEffect(() => {
    let timer: any;
    if (showOtpModal && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimer]);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const found = allUsers.find((u) => u.username === loginUsername || u.email === loginUsername);

    if (found) {
      onSuccessLogin(found);
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!");
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!termsAccepted) {
      alert("Bạn cần đồng ý với Điều khoản dịch vụ!");
      return;
    }

    // Trigger OTP modal
    setShowOtpModal(true);
    setOtpTimer(59);
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length < 4) {
      alert("Vui lòng nhập đủ 4 chữ số mã OTP!");
      return;
    }

    // Create new CTV User
    const newUser: User = {
      id: "u_" + Date.now(),
      username: regUsername || "ctv.moi",
      fullName: regFullName || "Cộng tác viên mới",
      email: regEmail || "ctv@schedulo.com",
      phone: regPhone || "+84 900 111 222",
      cccd: regCccd || "012345678999",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "collaborator",
      status: "pending",
      registeredDate: new Date().toLocaleDateString("vi-VN"),
      phoneVerified: true,
      cccdVerified: false,
    };

    setShowOtpModal(false);
    onSuccessLogin(newUser);
  };

  const handleOtpInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp_input_${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900 flex items-center justify-center p-4 py-12">
      {/* Centered Auth Card */}
      <div
        className={`w-full ${mode === "sign_in" ? "max-w-md" : "max-w-lg"} bg-white rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 my-auto`}
      >
        {/* Schedulo Header Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-indigo-500/30 mb-3">
            <span className="material-symbols-outlined text-3xl">calendar_month</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Schedulo</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {mode === "sign_in"
              ? "Hệ thống Quản lý & Điều phối Ca làm việc"
              : "Đăng ký tài khoản Cộng tác viên Schedulo"}
          </p>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => onSwitchMode("sign_in")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "sign_in"
                ? "bg-white text-blue-700 shadow-xs font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode("sign_up")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "sign_up"
                ? "bg-white text-blue-700 shadow-xs font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đăng ký CTV
          </button>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === "sign_in" && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên đăng nhập hoặc Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="nguyen.van.a"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span className="text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>ĐĂNG NHẬP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 text-center border-t border-slate-100 text-xs text-slate-600">
              Chưa có tài khoản CTV?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("sign_up")}
                className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Đăng ký tài khoản mới ngay
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: SIGN UP */}
        {mode === "sign_up" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="nguyen.van.b"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên đầy đủ *
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Trần Văn B"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+84 988 777 666"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            {/* Identity Details */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số CCCD / CMND *
              </label>
              <input
                type="text"
                value={regCccd}
                onChange={(e) => setRegCccd(e.target.value)}
                placeholder="012345678912"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                required
              />
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Tôi đồng ý với Điều khoản và Quy định vận hành của Schedulo.</span>
            </label>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              ĐĂNG KÝ TÀI KHOẢN CTV
            </button>

            <div className="pt-2 text-center text-xs text-slate-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("sign_in")}
                className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </div>
          </form>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Xác thực mã OTP</h3>
            <p className="text-xs text-slate-500 mb-6">
              Mã xác minh 4 chữ số đã được gửi tới SĐT{" "}
              <span className="font-bold text-slate-800">{regPhone || "+84 988 777 666"}</span>
            </p>

            <div className="flex items-center justify-center space-x-3 mb-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp_input_${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(idx, e.target.value)}
                  className="w-12 h-14 border-2 border-slate-300 rounded-xl text-center font-extrabold text-xl text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              ))}
            </div>

            <div className="text-xs text-slate-500 mb-6">
              Gửi lại mã sau{" "}
              <span className="font-bold text-blue-600">
                00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}
              </span>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              XÁC NHẬN OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
