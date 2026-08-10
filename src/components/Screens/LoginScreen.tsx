import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onRequestRegister?: () => void;
  onForgotPassword?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot_email' | 'forgot_otp' | 'register_success';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('nhapemail@vienkhcn.vn');
  const [loginPassword, setLoginPassword] = useState('12345678');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regDay, setRegDay] = useState('01');
  const [regMonth, setRegMonth] = useState('01');
  const [regYear, setRegYear] = useState('1998');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regErrors, setRegErrors] = useState<{ [key: string]: string }>({});

  // Countdown timer for register success
  const [countdown, setCountdown] = useState(5);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  // Handle countdown when register_success
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'register_success') {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setMode('login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode]);

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail) {
      setLoginError('Vui lòng nhập trường này!');
      return;
    }
    if (!loginPassword) {
      setLoginError('Vui lòng nhập trường này!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onLoginSuccess(loginEmail);
    }, 600);
  };

  // Submit Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!regName) errors.regName = 'Vui lòng nhập trường này!';
    if (!regEmail) errors.regEmail = 'Vui lòng nhập trường này!';
    if (!regPhone) errors.regPhone = 'Vui lòng nhập trường này!';
    if (!regPassword) errors.regPassword = 'Vui lòng nhập trường này!';
    if (!regConfirmPassword) errors.regConfirmPassword = 'Vui lòng nhập trường này!';

    if (regEmail.toLowerCase() === 'existing@vienkhcn.vn') {
      errors.regEmail = 'Email đã có người sử dụng. Vui lòng chọn email khác!';
    }

    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      errors.regConfirmPassword = 'Mật khẩu phải trùng khớp!';
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMode('register_success');
    }, 600);
  };

  // Submit Forgot Email
  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailError('');
    if (!forgotEmail) {
      setForgotEmailError('Vui lòng nhập trường này!');
      return;
    }
    if (forgotEmail.toLowerCase() === 'notfound@vienkhcn.vn') {
      setForgotEmailError('Email không tồn tại trong hệ thống!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMode('forgot_otp');
    }, 600);
  };

  // Submit Forgot OTP
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!otpCode) {
      setOtpError('Vui lòng nhập trường này!');
      return;
    }
    if (otpCode !== '123456' && otpCode.length < 6) {
      setOtpError('Số bạn đã nhập không khớp với mã. Vui lòng thử lại!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onLoginSuccess(forgotEmail || 'nhapemail@vienkhcn.vn');
    }, 600);
  };

  return (
    <div className="bg-[#faf9fd] text-[#1a1b1e] min-h-screen flex items-center justify-center font-['Inter',sans-serif] p-4">
      <main className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] p-8 flex flex-col relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#1b365d] rounded-full flex items-center justify-center mb-3 shadow-xs">
            <span
              className="material-symbols-outlined text-white text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              assured_workload
            </span>
          </div>
          <span className="text-xs font-bold text-[#1b365d] uppercase tracking-wider text-center">
            Viện Khoa học và Công nghệ Quân sự
          </span>
          <p className="text-[11px] text-[#74777f] text-center mt-0.5">
            Hệ thống Quản lý và Điều phối Lịch trình Cộng tác viên
          </p>
        </div>

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <div>
            <h1 className="text-xl font-bold text-[#002046] text-center mb-6">
              Đăng nhập
            </h1>

            {loginError && (
              <p className="text-xs font-semibold text-[#DC2626] mb-4 text-center bg-[#ffdad6] p-2 rounded">
                {loginError}
              </p>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1a1b1e] block">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nhapemail@vienkhcn.vn"
                  disabled={isProcessing}
                  className="w-full px-3 py-2 bg-[#faf9fd] border border-[#c4c6cf] rounded text-[#1a1b1e] text-sm focus:outline-none focus:border-[#002046] h-[40px]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1a1b1e] block">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_email');
                      setForgotEmail('');
                      setForgotEmailError('');
                    }}
                    className="text-xs font-semibold text-[#002046] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isProcessing}
                    className="w-full pl-3 pr-10 py-2 bg-[#faf9fd] border border-[#c4c6cf] rounded text-[#1a1b1e] text-sm focus:outline-none focus:border-[#002046] h-[40px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#74777f] hover:text-[#002046]"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showLoginPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#1b365d] hover:bg-[#002046] text-white font-semibold text-sm py-2 px-4 rounded h-[40px] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>{isProcessing ? 'Đang xử lý...' : 'Đăng nhập'}</span>
              </button>

              <div className="text-center pt-4 border-t border-[#E2E8F0]">
                <p className="text-xs text-[#44474e]">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegErrors({});
                    }}
                    className="text-[#002046] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Tạo tài khoản mới
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <div>
            <h1 className="text-xl font-bold text-[#002046] text-center mb-5">
              Đăng ký
            </h1>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Họ và tên */}
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-3 py-2 bg-[#faf9fd] border rounded text-sm h-[38px] ${
                    regErrors.regName ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                  }`}
                />
                {regErrors.regName && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{regErrors.regName}</p>
                )}
              </div>

              {/* Ngày sinh (3 dropdowns: Ngày, Tháng, Năm) */}
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">Ngày sinh</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={regDay}
                    onChange={(e) => setRegDay(e.target.value)}
                    className="px-2 py-1.5 border border-[#c4c6cf] rounded text-xs bg-[#faf9fd] h-[38px]"
                  >
                    {Array.from({ length: 31 }, (_, i) => {
                      const d = String(i + 1).padStart(2, '0');
                      return <option key={d} value={d}>Ngày {d}</option>;
                    })}
                  </select>
                  <select
                    value={regMonth}
                    onChange={(e) => setRegMonth(e.target.value)}
                    className="px-2 py-1.5 border border-[#c4c6cf] rounded text-xs bg-[#faf9fd] h-[38px]"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const m = String(i + 1).padStart(2, '0');
                      return <option key={m} value={m}>Tháng {m}</option>;
                    })}
                  </select>
                  <select
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value)}
                    className="px-2 py-1.5 border border-[#c4c6cf] rounded text-xs bg-[#faf9fd] h-[38px]"
                  >
                    {Array.from({ length: 40 }, (_, i) => {
                      const y = String(1970 + i);
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nguyenvana@vienkhcn.vn"
                  className={`w-full px-3 py-2 bg-[#faf9fd] border rounded text-sm h-[38px] ${
                    regErrors.regEmail ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                  }`}
                />
                {regErrors.regEmail && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{regErrors.regEmail}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0987654321"
                  className={`w-full px-3 py-2 bg-[#faf9fd] border rounded text-sm h-[38px] ${
                    regErrors.regPhone ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                  }`}
                />
                {regErrors.regPhone && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{regErrors.regPhone}</p>
                )}
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-3 pr-10 py-2 bg-[#faf9fd] border rounded text-sm h-[38px] ${
                      regErrors.regPassword ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#74777f]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showRegPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {regErrors.regPassword && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{regErrors.regPassword}</p>
                )}
              </div>

              {/* Nhập lại mật khẩu */}
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">Nhập lại mật khẩu</label>
                <div className="relative">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-3 pr-10 py-2 bg-[#faf9fd] border rounded text-sm h-[38px] ${
                      regErrors.regConfirmPassword ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#74777f]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showRegConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {regErrors.regConfirmPassword && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{regErrors.regConfirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#1b365d] hover:bg-[#002046] text-white font-semibold text-sm py-2 px-4 rounded h-[40px] transition-colors mt-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Đang xử lý...' : 'Đăng ký'}
              </button>

              <div className="text-center pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#002046] text-xs font-bold hover:underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODE: REGISTER SUCCESS */}
        {mode === 'register_success' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 bg-[#c7ecc7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <p className="text-sm font-semibold text-[#1a1b1e]">
              Đang chờ admin duyệt yêu cầu. Vui lòng cập nhật email để nhận thông báo!
            </p>
            <p className="text-xs text-[#74777f]">
              Tự động chuyển đến trang đăng nhập sau {countdown} giây
            </p>
            <button
              onClick={() => setMode('login')}
              className="text-xs text-[#1b365d] font-bold hover:underline cursor-pointer"
            >
              Chuyển sang trang đăng nhập ngay
            </button>
          </div>
        )}

        {/* MODE: FORGOT EMAIL */}
        {mode === 'forgot_email' && (
          <div>
            <h1 className="text-xl font-bold text-[#002046] text-center mb-5">
              Quên mật khẩu
            </h1>

            <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">
                  Nhập email nhận mã
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nhapemail@vienkhcn.vn"
                  className={`w-full px-3 py-2 bg-[#faf9fd] border rounded text-sm h-[40px] ${
                    forgotEmailError ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                  }`}
                />
                {forgotEmailError && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{forgotEmailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#1b365d] hover:bg-[#002046] text-white font-semibold text-sm py-2 px-4 rounded h-[40px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Đang gửi...' : 'Nhận mã'}
              </button>

              <div className="text-center pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-[#44474e] hover:text-[#002046] font-semibold cursor-pointer"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODE: FORGOT OTP */}
        {mode === 'forgot_otp' && (
          <div>
            <h1 className="text-xl font-bold text-[#002046] text-center mb-2">
              Xác nhận tài khoản
            </h1>
            <p className="text-xs text-[#44474e] text-center mb-5">
              Chúng tôi đã gửi mã đến email của bạn. Hãy nhập mã đó để xác nhận tài khoản.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1a1b1e] block mb-1">
                  Nhập mã
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Nhập mã 6 chữ số (ví dụ: 123456)"
                  className={`w-full px-3 py-2 bg-[#faf9fd] border rounded text-sm h-[40px] tracking-widest text-center font-mono ${
                    otpError ? 'border-[#DC2626]' : 'border-[#c4c6cf]'
                  }`}
                />
                {otpError && (
                  <p className="text-[11px] text-[#DC2626] mt-1 font-medium">{otpError}</p>
                )}
              </div>

              {otpNotice && (
                <p className="text-[11px] text-[#002046] bg-[#f4f3f7] p-2 rounded text-center">
                  {otpNotice}
                </p>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#1b365d] hover:bg-[#002046] text-white font-semibold text-sm py-2 px-4 rounded h-[40px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Đang xác nhận...' : 'Tiếp tục'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setOtpNotice('Vui lòng đợi vài phút để nhận mã gồm 6 chữ số trước khi yêu cầu mã khác.')
                  }
                  className="text-xs text-[#002046] font-semibold hover:underline cursor-pointer"
                >
                  Không nhận được mã?
                </button>
              </div>

              <div className="text-center pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-[#44474e] hover:text-[#002046] font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginScreen;
