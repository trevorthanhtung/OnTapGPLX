import React, { useState, useEffect } from 'react';
import { X, BookOpen, Video, Zap, ArrowRight, Smartphone, Sparkles, Check } from 'lucide-react';
import { StorageService } from '../services/storage';
import type { LicenseCategory } from '../types';

interface WelcomeLandingViewProps {
  onStartExperience: () => void;
}

export const WelcomeLandingView: React.FC<WelcomeLandingViewProps> = ({ onStartExperience }) => {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installTab, setInstallTab] = useState<'ios' | 'android' | 'pc'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | 'cookie' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LicenseCategory>(() => StorageService.getCategory());

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setInstallTab('ios');
    } else if (/android/i.test(userAgent)) {
      setInstallTab('android');
    } else {
      setInstallTab('pc');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Prevent background scrolling while on Welcome Landing View
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleCategoryChange = (cat: LicenseCategory) => {
    setSelectedCategory(cat);
    StorageService.setCategory(cat);
  };

  const quickCategories: { id: LicenseCategory; label: string; desc: string }[] = [
    { id: 'B', label: 'Hạng B', desc: 'Ô tô con & tải nhẹ' },
    { id: 'A1', label: 'Hạng A1', desc: 'Xe máy ≤ 125cc' },
    { id: 'B1', label: 'Hạng B1', desc: 'Ô tô số tự động' },
    { id: 'C', label: 'Hạng C', desc: 'Xe tải nặng' },
  ];

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden overscroll-none bg-slate-50 text-slate-900 flex flex-col justify-between select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
      {/* Top Spacer / Subtle ambient header light */}
      <div className="w-full shrink-0 h-2 sm:h-4 landscape-mobile:h-1" />

      {/* Main Interactive Onboarding Card Container */}
      <main className="w-full max-w-xl landscape-mobile:max-w-3xl mx-auto px-4 sm:px-6 my-auto flex flex-col items-center">
        {/* Hero Branding Section */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6 landscape-mobile:mb-2">
          {/* Logo with Ambient Breathing Glow */}
          <div className="relative mb-3 landscape-mobile:mb-1">
            <div className="absolute -inset-2 rounded-2xl bg-linear-to-tr from-amber-400/40 to-orange-400/30 blur-lg animate-pulse" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 landscape-mobile:w-10 landscape-mobile:h-10 rounded-2xl bg-white border border-slate-200/90 p-2 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/logo.jpg"
                alt="OnTap GPLX Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Badge & Title */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quy chế Sát hạch Chuẩn 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl landscape-mobile:text-xl font-black text-slate-900 tracking-tight">
            OnTap <span className="text-amber-500">GPLX</span>
          </h1>
          <p className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-500 max-w-sm mt-1 leading-snug">
            Nền tảng ôn thi lý thuyết và mô phỏng giao thông Cục Đường bộ Việt Nam
          </p>
        </div>

        {/* 3 Core Value Pillars (Compact Cards) */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5 landscape-mobile:mb-2">
          <div className="p-3 landscape-mobile:p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-900">600 Câu hỏi</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
              Kèm mẹo ghi nhớ
            </div>
          </div>

          <div className="p-3 landscape-mobile:p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-1.5">
              <Video className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-900">120 Tình huống</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
              Trắc nghiệm 4 phần
            </div>
          </div>

          <div className="p-3 landscape-mobile:p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-900">Học Offline</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
              0% quảng cáo
            </div>
          </div>
        </div>

        {/* Quick License Selector */}
        <div className="w-full mb-4 sm:mb-5 landscape-mobile:mb-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2">
            Chọn nhanh hạng giấy phép của bạn:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-500/50'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">{cat.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {cat.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 mb-3.5 sm:mb-4 landscape-mobile:mb-2">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onStartExperience}
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer group"
          >
            <span>Bắt đầu ôn tập ngay</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary Action: Install PWA Guide */}
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Hướng dẫn cài đặt ứng dụng vào điện thoại / máy tính</span>
          </button>
        </div>

        {/* Legal Disclaimer */}
        <div className="w-full text-center px-2">
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <button
              type="button"
              onClick={() => setPolicyModal('terms')}
              className="text-slate-800 font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Điều khoản
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => setPolicyModal('privacy')}
              className="text-slate-800 font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Quyền riêng tư
            </button>{' '}
            &{' '}
            <button
              type="button"
              onClick={() => setPolicyModal('cookie')}
              className="text-slate-800 font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Cookie
            </button>
            .
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 sm:py-4 landscape-mobile:py-1 px-4 text-center shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <p className="text-xs text-slate-500">
            thực hiện bởi{' '}
            <a
              href="https://github.com/trevorthanhtung"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-800 hover:text-amber-600 underline underline-offset-2 transition-colors cursor-pointer"
              title="GitHub: trevorthanhtung (thanhtungg.)"
            >
              thanhtungg.
            </a>
          </p>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-[11px] text-slate-400 font-mono">
            Phiên bản 1.1.0
          </span>
        </div>
      </footer>

      {/* Policy Modal (Terms / Privacy / Cookie) */}
      {policyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 landscape-mobile:p-2 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-slate-900/40 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150"
        >
          <div
            className="bg-white text-slate-900 w-full max-w-md landscape-mobile:max-w-xl rounded-2xl p-5 sm:p-6 landscape-mobile:p-3.5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] landscape-mobile:max-h-[92vh] animate-in zoom-in-95 duration-150 touch-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 landscape-mobile:pb-2 border-b border-slate-100 mb-4 landscape-mobile:mb-2">
              <h3 className="font-bold text-slate-900 text-base landscape-mobile:text-sm">
                {policyModal === 'terms' && 'Điều khoản Sử dụng'}
                {policyModal === 'privacy' && 'Chính sách Quyền riêng tư'}
                {policyModal === 'cookie' && 'Chính sách Cookie'}
              </h3>
              <button
                onClick={() => setPolicyModal(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-4 landscape-mobile:space-y-2.5 pr-1 text-xs sm:text-sm landscape-mobile:text-xs text-slate-600 leading-relaxed">
              {policyModal === 'privacy' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      1. Không thu thập thông tin định danh
                    </h4>
                    <p>
                      OnTap GPLX không yêu cầu đăng ký hay đăng nhập tài khoản. Chúng tôi tuyệt đối không thu thập họ tên, email, số điện thoại, danh bạ hay vị trí địa lý của bạn.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      2. Lưu trữ hoàn toàn trên thiết bị của bạn
                    </h4>
                    <p>
                      Toàn bộ tiến độ ôn tập, danh sách câu trả lời sai, câu hỏi điểm liệt đã đánh dấu và kết quả các bài thi sát hạch thử được lưu trực tiếp trên chính thiết bị (điện thoại hoặc máy tính) của bạn, hoàn toàn không tải lên máy chủ bên ngoài.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      3. Quyền làm chủ dữ liệu của học viên
                    </h4>
                    <p>
                      Học viên có toàn quyền xóa lịch sử thi, đặt lại tiến độ học tập hoặc sao lưu dữ liệu cá nhân bất cứ lúc nào trong mục Thống kê của ứng dụng.
                    </p>
                  </div>
                </>
              )}

              {policyModal === 'terms' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      1. Mục đích học tập phi thương mại
                    </h4>
                    <p>
                      OnTap GPLX là ứng dụng học tập phi thương mại hỗ trợ học viên ôn luyện sát hạch cấp giấy phép lái xe cơ giới đường bộ, hoàn toàn miễn phí và không chèn banner quảng cáo.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      2. Dữ liệu chuẩn Cục Đường bộ Việt Nam
                    </h4>
                    <p>
                      Ngân hàng 600 câu hỏi sát hạch lý thuyết (bao gồm 60 câu hỏi về tình huống mất an toàn giao thông nghiêm trọng) và 120 tình huống mô phỏng giao thông chuẩn trắc nghiệm 4 phần theo quy chế mới được đối soát bám sát tài liệu chuẩn của Cục Đường bộ Việt Nam.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      3. Trách nhiệm của người học
                    </h4>
                    <p>
                      Ứng dụng đóng vai trò là tài liệu hỗ trợ tự học và rèn luyện kỹ năng. Thí sinh cần chủ động nắm vững Luật Trật tự, an toàn giao thông đường bộ và các quy định sát hạch chính thức do Sở Giao thông vận tải tổ chức.
                    </p>
                  </div>
                </>
              )}

              {policyModal === 'cookie' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      1. Bộ nhớ kỹ thuật thiết yếu
                    </h4>
                    <p>
                      Ứng dụng chỉ sử dụng bộ nhớ cục bộ để ghi nhớ hạng giấy phép lái xe bạn đang ôn tập (A1, A, B, C1, C...) và lưu trữ tiến độ làm bài giữa các phiên học.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      2. Tuyệt đối không có mã theo dõi
                    </h4>
                    <p>
                      OnTap GPLX cam kết không nhúng bất kỳ mã theo dõi hành vi, phân tích người dùng hay quảng cáo nào từ các bên thứ ba.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      3. Tối ưu tốc độ tải trang
                    </h4>
                    <p>
                      Hệ thống lưu tạm tài nguyên giao diện và hình ảnh trên trình duyệt nhằm giúp ứng dụng phản hồi nhanh chóng, mượt mà và tiết kiệm dữ liệu di động của bạn.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Action Button */}
            <div className="pt-4 landscape-mobile:pt-2 mt-4 landscape-mobile:mt-2 border-t border-slate-100">
              <button
                onClick={() => setPolicyModal(null)}
                className="w-full py-2.5 landscape-mobile:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install Modal */}
      {showInstallModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 landscape-mobile:p-2 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-slate-900/40 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150"
        >
          <div
            className="bg-white w-full max-w-md landscape-mobile:max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] landscape-mobile:max-h-[92vh] animate-in zoom-in-95 duration-150 touch-auto"
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 landscape-mobile:py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm">Hướng dẫn cài đặt ứng dụng</div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 landscape-mobile:p-1 gap-1">
              <button
                onClick={() => setInstallTab('ios')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  installTab === 'ios'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                iPhone / iPad
              </button>
              <button
                onClick={() => setInstallTab('android')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  installTab === 'android'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setInstallTab('pc')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  installTab === 'pc'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Máy tính
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5 landscape-mobile:p-3 text-xs text-slate-700 space-y-3 landscape-mobile:space-y-1.5 leading-relaxed overflow-y-auto">
              {installTab === 'ios' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                    <span>Mở trang web bằng trình duyệt <strong>Safari</strong> trên thiết bị.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                    <span>Nhấn biểu tượng <strong>Chia sẻ</strong> (hình ô vuông có mũi tên hướng lên) ở thanh dưới cùng.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                    <span>Chọn <strong>Thêm vào Màn hình chính</strong> (Add to Home Screen).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                    <span>Nhấn <strong>Thêm</strong> ở góc trên bên phải để hoàn tất.</span>
                  </div>
                </div>
              )}

              {installTab === 'android' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                    <span>Mở trang web bằng <strong>Google Chrome</strong> hoặc Cốc Cốc.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                    <span>Nhấn biểu tượng <strong>Menu 3 dấu chấm</strong> ở góc trên bên phải.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                    <span>Chọn <strong>Cài đặt ứng dụng</strong> hoặc <strong>Thêm vào Màn hình chính</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                    <span>Xác nhận <strong>Cài đặt</strong> để đưa biểu tượng app ra ngoài màn hình.</span>
                  </div>
                </div>
              )}

              {installTab === 'pc' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                    <span>Mở web bằng trình duyệt <strong>Google Chrome</strong> hoặc <strong>Microsoft Edge</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                    <span>Nhấn vào biểu tượng <strong>Cài đặt</strong> ở cuối thanh địa chỉ (URL).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                    <span>Chọn <strong>Cài đặt</strong> để sử dụng OnTap GPLX trong cửa sổ ứng dụng độc lập.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 landscape-mobile:py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cài đặt ngay vào máy
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
