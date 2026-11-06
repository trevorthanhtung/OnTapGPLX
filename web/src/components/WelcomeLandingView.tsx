import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WelcomeLandingViewProps {
  onStartExperience: () => void;
}

export const WelcomeLandingView: React.FC<WelcomeLandingViewProps> = ({ onStartExperience }) => {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installTab, setInstallTab] = useState<'ios' | 'android' | 'pc'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | 'cookie' | null>(null);

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

  // Prevent screen and background scrolling on Welcome Landing View
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

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden overscroll-none bg-slate-50 text-slate-900 flex flex-col justify-between select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
      {/* Top balance spacer */}
      <div aria-hidden="true" className="h-2 sm:h-6 landscape-mobile:h-1 shrink-0" />

      {/* Centered Main Container */}
      <main className="w-full max-w-md landscape-mobile:max-w-2xl mx-auto px-5 landscape-mobile:px-6 my-auto py-4 landscape-mobile:py-1.5 flex flex-col items-center">
        {/* App Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 landscape-mobile:w-11 landscape-mobile:h-11 rounded-2xl landscape-mobile:rounded-xl bg-white border border-slate-200 p-2 landscape-mobile:p-1.5 shadow-xs flex items-center justify-center mb-4 landscape-mobile:mb-1.5">
          <img
            src="/logo.jpg"
            alt="OnTap GPLX Logo"
            className="w-full h-full object-contain rounded-xl landscape-mobile:rounded-lg"
          />
        </div>

        {/* Header Text */}
        <div className="text-center mb-6 landscape-mobile:mb-2.5 space-y-1 landscape-mobile:space-y-0.5">
          <div className="text-2xl sm:text-3xl landscape-mobile:text-lg font-black text-slate-900 tracking-tight">
            OnTap <span className="text-amber-500">GPLX</span>
          </div>
          <div className="text-xs landscape-mobile:text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Ôn thi giấy phép lái xe 2026
          </div>
        </div>

        {/* Action Cards */}
        <div className="w-full space-y-3 landscape-mobile:space-y-0 landscape-mobile:grid landscape-mobile:grid-cols-2 landscape-mobile:gap-3 mb-5 landscape-mobile:mb-2">
          {/* Card: Trải nghiệm ngay */}
          <button
            type="button"
            onClick={onStartExperience}
            className="w-full text-left bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-2xl landscape-mobile:rounded-xl p-5 landscape-mobile:p-3.5 transition-all duration-150 cursor-pointer shadow-xs block"
          >
            <div className="space-y-1 landscape-mobile:space-y-0.5">
              <div className="text-base sm:text-lg landscape-mobile:text-sm font-bold tracking-tight text-white">
                Trải nghiệm ngay
              </div>
              <p className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-300 leading-snug font-normal">
                Ôn tập 600 câu lý thuyết phân hạng và 120 tình huống mô phỏng trắc nghiệm.
              </p>
            </div>
          </button>

          {/* Card: Hướng dẫn cài đặt */}
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="w-full text-left bg-white hover:bg-slate-50/90 active:bg-slate-100 text-slate-900 rounded-2xl landscape-mobile:rounded-xl p-5 landscape-mobile:p-3.5 border border-slate-200 hover:border-slate-300 shadow-xs transition-all duration-150 cursor-pointer block"
          >
            <div className="space-y-1 landscape-mobile:space-y-0.5">
              <div className="text-base sm:text-lg landscape-mobile:text-sm font-bold text-slate-900 tracking-tight">
                Hướng dẫn cài đặt ứng dụng
              </div>
              <p className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-500 leading-relaxed font-normal">
                Cài OnTap GPLX vào màn hình chính điện thoại hoặc máy tính để mở nhanh và thuận tiện hơn.
              </p>
            </div>
          </button>
        </div>

        {/* Terms, Privacy & Cookie Agreement Text */}
        <div className="w-full text-center px-1">
          <p className="text-[11px] sm:text-xs landscape-mobile:text-[10px] text-slate-500 leading-relaxed max-w-sm landscape-mobile:max-w-xl mx-auto font-normal">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <button
              type="button"
              onClick={() => setPolicyModal('terms')}
              className="text-slate-800 font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Điều khoản Sử dụng
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => setPolicyModal('privacy')}
              className="text-slate-800 font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Chính sách Quyền riêng tư
            </button>{' '}
            và{' '}
            <button
              type="button"
              onClick={() => setPolicyModal('cookie')}
              className="text-slate-800 font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Chính sách Cookie
            </button>{' '}
            của chúng tôi.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 landscape-mobile:py-1.5 px-4 text-center shrink-0">
        <div className="flex flex-col landscape-mobile:flex-row items-center justify-center gap-0.5 landscape-mobile:gap-2">
          <p className="text-xs landscape-mobile:text-[10px] text-slate-500">
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
          <span className="hidden landscape-mobile:inline text-slate-300">•</span>
          <span className="text-[11px] landscape-mobile:text-[10px] text-slate-400 font-mono">
            Phiên bản 1.1.0
          </span>
        </div>
      </footer>

      {/* Policy Modal (Terms / Privacy / Cookie) */}
      {policyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 landscape-mobile:p-2 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-slate-900/40 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150"
          onClick={() => setPolicyModal(null)}
        >
          <div
            className="bg-white text-slate-900 w-full max-w-md landscape-mobile:max-w-xl rounded-2xl p-5 sm:p-6 landscape-mobile:p-3.5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] landscape-mobile:max-h-[92vh] animate-in zoom-in-95 duration-150 touch-auto"
            onClick={(e) => e.stopPropagation()}
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
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className="bg-white w-full max-w-md landscape-mobile:max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] landscape-mobile:max-h-[92vh] animate-in zoom-in-95 duration-150 touch-auto"
            onClick={(e) => e.stopPropagation()}
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
