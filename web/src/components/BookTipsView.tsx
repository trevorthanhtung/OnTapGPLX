import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import type { SubHeaderConfig } from './Navbar';

export interface ChapterInfo {
  id: number;
  label: string;
  name: string;
  pageRange: string;
  primaryImage: string;
  imageTitle: string;
  allImages?: { url: string; title: string }[];
}

const CHAPTER_LIST: ChapterInfo[] = [
  {
    id: 1,
    label: 'Chương 1',
    name: 'Khái niệm & Quy tắc',
    pageRange: 'Trang 1 & 4',
    primaryImage: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_01_KhaiNiem_QuyTac.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 1 (Trang 1: Khái niệm & Quy tắc)',
    allImages: [
      { url: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_01_KhaiNiem_QuyTac.jpg', title: 'Trang 1: Khái niệm & Quy tắc giao thông' },
      { url: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_04_CanCanh_TocDo_GPLX.jpg', title: 'Trang 4: Tốc độ, Độ tuổi, GPLX & Cự ly' },
      { url: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_04_05_TocDo_DoTuoi.jpg', title: 'Trang 4 - 5: Toàn cảnh Tốc độ & Kỹ thuật' }
    ]
  },
  {
    id: 2,
    label: 'Chương 2',
    name: 'Nghiệp vụ vận tải',
    pageRange: 'Trang 2 & 3',
    primaryImage: '/SachMeo/Chuong_2_NghiepVuVanTai/Trang_02_03_NghiepVuVanTai.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 2 (Trang 2 - 3: Nghiệp vụ vận tải)'
  },
  {
    id: 3,
    label: 'Chương 3',
    name: 'Văn hóa & Đạo đức',
    pageRange: 'Trang 3',
    primaryImage: '/SachMeo/Chuong_3_VanHoa_DaoDuc/Trang_03_VanHoaGiaoThong.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 3 (Trang 3: Văn hóa giao thông & Tai nạn GT)'
  },
  {
    id: 4,
    label: 'Chương 4',
    name: 'Kỹ thuật lái xe',
    pageRange: 'Trang 5 & 6',
    primaryImage: '/SachMeo/Chuong_4_KyThuatLaiXe/Trang_05_KyThuatLaiXe.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 4 (Trang 5: Kỹ thuật lái xe)',
    allImages: [
      { url: '/SachMeo/Chuong_4_KyThuatLaiXe/Trang_05_KyThuatLaiXe.jpg', title: 'Trang 5: Kỹ thuật lái xe ô tô' },
      { url: '/SachMeo/Chuong_4_KyThuatLaiXe/Trang_06_XuLyTinhHuong.jpg', title: 'Trang 6: Kỹ thuật xử lý tình huống' }
    ]
  },
  {
    id: 5,
    label: 'Chương 5',
    name: 'Cấu tạo & Sửa chữa',
    pageRange: 'Trang 7',
    primaryImage: '/SachMeo/Chuong_5_CauTao_SuaChua/Trang_07_CauTaoXe_ThuTuXe.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 5 (Trang 7: Cấu tạo xe & Thứ tự xe lớn nhỏ)'
  },
  {
    id: 6,
    label: 'Chương 6',
    name: 'Biển báo đường bộ',
    pageRange: 'Trang 8 - 15',
    primaryImage: '/SachMeo/Chuong_6_BienBaoHieu/Trang_08_09_BienCam_TocDo.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 6 (Trang 8 - 9: Biển cấm & Tốc độ)',
    allImages: [
      { url: '/SachMeo/Chuong_6_BienBaoHieu/Trang_08_09_BienCam_TocDo.jpg', title: 'Trang 8 - 9: Biển cấm & Tốc độ' },
      { url: '/SachMeo/Chuong_6_BienBaoHieu/Trang_10_11_BienPhu_BienNguyHiem.jpg', title: 'Trang 10 - 11: Biển phụ & Biển nguy hiểm' },
      { url: '/SachMeo/Chuong_6_BienBaoHieu/Trang_12_13_DocChuV_CamVuot.jpg', title: 'Trang 12 - 13: Dốc chữ V & Cấm vượt' },
      { url: '/SachMeo/Chuong_6_BienBaoHieu/Trang_14_15_TocDoLanDuong_CauVuot.jpg', title: 'Trang 14 - 15: Tốc độ làn đường & Cầu vượt' },
      { url: '/SachMeo/Chuong_6_BienBaoHieu/BiaTrong_BangTraCuuBienCam_TapLo.jpg', title: 'Bìa trong: Bảng tra cứu Biển báo cấm & Táp-lô' },
      { url: '/SachMeo/Chuong_6_BienBaoHieu/Trang_20_BienHieuLenh.jpg', title: 'Trang 20: Biển hiệu lệnh & Chỉ dẫn' }
    ]
  },
  {
    id: 7,
    label: 'Chương 7',
    name: 'Giải thế sa hình',
    pageRange: 'Trang 16 - 20',
    primaryImage: '/SachMeo/Chuong_7_SaHinh/Trang_16_17_5NguyenTacSaHinh.jpg',
    imageTitle: 'Ảnh sách gốc - Chương 7 (Trang 16 - 17: 5 Nguyên tắc vàng sa hình)',
    allImages: [
      { url: '/SachMeo/Chuong_7_SaHinh/Trang_16_17_5NguyenTacSaHinh.jpg', title: 'Trang 16 - 17: 5 Nguyên tắc vàng sa hình' },
      { url: '/SachMeo/Chuong_7_SaHinh/Trang_18_19_SaHinhXeUuTien_DuaXe.jpg', title: 'Trang 18 - 19: Sa hình xe ưu tiên & Đua xe' },
      { url: '/SachMeo/Chuong_7_SaHinh/Trang_20_DenXe_XeKeoXe.jpg', title: 'Trang 20: Đèn xe tải & Xe kéo xe' }
    ]
  }
];

interface ChapterDropdownProps {
  selectedChapter: number;
  onSelectChapter: (id: number) => void;
}

const ChapterDropdown: React.FC<ChapterDropdownProps> = ({
  selectedChapter,
  onSelectChapter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const currentCh = CHAPTER_LIST.find((c) => c.id === selectedChapter) || CHAPTER_LIST[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
        title="Chuyển chương ôn tập"
      >
        <span>{currentCh.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 whitespace-nowrap">
            Chọn chương
          </div>

          <div className="max-h-[65vh] overflow-y-auto py-1">
            {CHAPTER_LIST.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectChapter(ch.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  ch.id === selectedChapter
                    ? 'bg-slate-100 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span className="font-semibold">{ch.label}:</span>{' '}
                <span className="font-normal">{ch.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export interface BookTipsViewProps {
  onBack?: () => void;
  onSubHeaderChange?: (config: SubHeaderConfig | null) => void;
}

export const BookTipsView: React.FC<BookTipsViewProps> = ({
  onBack,
  onSubHeaderChange
}) => {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSelectChapter = useCallback((chapterId: number) => {
    setSelectedChapter(chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Đồng bộ header: Không có chữ "Sách mẹo sát hạch", chuyển nút chọn chương sang góc phải header
  useEffect(() => {
    if (onSubHeaderChange && onBack) {
      onSubHeaderChange({
        title: '',
        onBack,
        rightElement: (
          <ChapterDropdown
            selectedChapter={selectedChapter}
            onSelectChapter={handleSelectChapter}
          />
        )
      });
    }
  }, [selectedChapter, onBack, onSubHeaderChange, handleSelectChapter]);

  return (
    <div className="max-w-3xl lg:max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 animate-in fade-in duration-150">

      {/* ======================================================== */}
      {/* NỘI DUNG TỪNG CHƯƠNG THEO ĐÚNG NGUYÊN BẢN TRANG SÁCH     */}
      {/* ======================================================== */}

      {/* ========================================== */}
      {/* CHƯƠNG 1: KHÁI NIỆM & QUY TẮC              */}
      {/* ========================================== */}
      {selectedChapter === 1 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Mẹo 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đầu câu và cuối câu hỏi có cụm từ
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Khổ - Thô sơ - Đường cao tốc
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5 font-mono">
                    Áp dụng: Câu 3, 9, 16
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án 1</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Phần - Làn - Dải - Vạch - Cơ giới - Dừng xe - Đỗ xe
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5 font-mono">
                    Áp dụng: Câu 1, 2, 4, 5, 8, 14, 15
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án 2</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Giữa câu hỏi có từ &quot;gồm&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5 font-mono">
                    Áp dụng: Câu 10, 11, 12
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án cuối</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mẹo 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Ráp cụm từ trên câu hỏi với đáp án
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  cauHoi: 'Người điều khiển phương tiện',
                  dapAn: 'Người điều khiển xe cơ giới',
                  cau: 'Câu 6'
                },
                {
                  cauHoi: 'Người lái xe',
                  dapAn: 'Là người điều khiển xe cơ giới',
                  cau: 'Câu 7'
                },
                {
                  cauHoi: 'Theo chức năng phục vụ',
                  dapAn: 'Đường nào dài chọn',
                  cau: 'Câu 18'
                },
                {
                  cauHoi: 'Tổ chức đua xe được phép',
                  dapAn: 'Cơ quan có thẩm quyền',
                  cau: 'Câu 21'
                },
                {
                  cauHoi: 'Theo luật phòng chống tác hại rượu bia',
                  dapAn: 'Người điều khiển xe',
                  cau: 'Câu 26'
                },
                {
                  cauHoi: 'Có bao nhiêu nhóm biển báo hiệu đường bộ',
                  dapAn: '5 nhóm',
                  cau: 'Câu 33'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">Từ khóa câu hỏi:</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      &quot;{item.cauHoi}&quot;
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5 font-mono">
                      Áp dụng: {item.cau}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[220px] justify-start font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{item.dapAn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mẹo 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Hành vi bị nghiêm cấm, không được phép
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { title: 'Rải vật sắc nhọn', cau: 'Câu 19' },
                { title: 'Sử dụng điện thoại', cau: 'Câu 52' },
                { title: 'Cải tạo trái phép cố ý', cau: 'Câu 29' },
                { title: 'Trên cầu hẹp 1 làn xe', cau: 'Câu 53' },
                { title: 'Lạng lách đánh võng', cau: 'Câu 32' },
                { title: 'Song song cùng chiều xe khác' },
                { title: 'Đi xe dàn hàng ngang' },
                { title: 'Sử dụng ô (dù)' },
                { title: 'Buông cả 2 tay', cau: 'Câu 64, 65' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between gap-2"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    {item.title}
                  </span>
                  {item.cau && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                      {item.cau}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mẹo 4 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Câu hỏi có cụm từ &quot;Hành vi&quot;
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Đầu câu hỏi có cụm từ &quot;Hành vi...&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Chọn ngay phương án cuối cùng là đáp án chính xác.
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án cuối</span>
                </div>
              </div>

              {/* Ngoại lệ câu 19 */}
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                <span className="font-semibold text-rose-600 dark:text-rose-400">Ngoại lệ duy nhất:</span> Trừ <strong>Câu 19</strong> (Hành vi rải vật sắc nhọn, chất gây trơn...) <span className="font-bold text-rose-600 dark:text-rose-400">=&gt; Chọn Đáp án 2</span>.
              </div>
            </div>
          </div>

          {/* Mẹo 12 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đáp án có cụm &quot;Giảm tốc độ&quot;
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Trong các đáp án, chỉ có duy nhất 1 đáp án chứa cụm &quot;Giảm tốc độ&quot;
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án đó</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Lưu ý:</span> Không áp dụng cho những câu có từ 2 đáp án &quot;giảm tốc độ&quot; trở lên, câu có đáp án cuối là &quot;CẢ...&quot;, và trừ Câu 248.
              </div>
            </div>
          </div>

          {/* Mẹo 13 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy tắc số tuổi trên đáp án
              </h3>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Nhìn vào ba đáp án đầu tiên (1 - 2 - 3)
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                  Luôn chọn đáp án có chứa số lớn nhất là đáp án chính xác.
                </div>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>Chọn Số Lớn Nhất</span>
              </div>
            </div>
          </div>

          {/* Mẹo 14 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy tắc Hạng giấy phép lái xe (GPLX)
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Đủ 16 tuổi',
                  rule: 'Xe gắn máy'
                },
                {
                  label: 'Hỏi A1 có ngày "01/01/2025"',
                  rule: 'Chọn Đáp án 1',
                  note: 'Ngoại lệ duy nhất',
                  isException: true
                },
                {
                  label: 'Hạng có số (A1, C1, D1, D2)',
                  rule: 'Lấy số + 1'
                },
                {
                  label: 'Hạng không có số (A, B, C, D)',
                  rule: 'Chọn Đáp án cuối'
                },
                {
                  label: 'Hạng có đuôi E (BE, CE, DE)',
                  rule: 'Bỏ chữ E => Chọn còn lại'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.label}
                    </span>
                    {item.note && (
                      <span className={`text-[11px] font-mono ${item.isException ? 'text-rose-500 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                        ({item.note})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[230px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mẹo 15 & 16 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy tắc Tốc độ tối đa
              </h3>
            </div>

            {/* Trong khu dân cư */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Trong khu vực đông dân cư
              </div>
              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Xe gắn máy
                  </span>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn 40 km/h</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Đường đôi (có dải phân cách)
                  </span>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn Đáp án 1</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 divide-y divide-slate-200/60 dark:divide-slate-700/60 overflow-hidden">
                  <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Đường 2 chiều (không dải phân cách) — Đề có số 28
                    </span>
                    <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      <span>Chọn Đáp án 2</span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Đường 2 chiều (không dải phân cách) — Đề không có 28
                    </span>
                    <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      <span>Chọn Đáp án 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ngoài khu dân cư - Khẩu quyết */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Ngoài khu vực đông dân cư
              </div>
              <div className="space-y-2 px-1">
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Khẩu Quyết Vàng: 10 Đôi — 9 Chiều
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cách tính: Lấy số chủ đạo trừ cho chữ số đầu tiên của vận tốc ghi trong đề bài.
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-1 pl-1">
                  <div>- <strong>Đường đôi:</strong> Số chủ đạo = <strong className="text-emerald-600 dark:text-emerald-400 font-bold">10</strong> (VD: 90km/h lấy 10 - 9 = 1 =&gt; Chọn Đáp án 1)</div>
                  <div>- <strong>Đường 2 chiều:</strong> Số chủ đạo = <strong className="text-emerald-600 dark:text-emerald-400 font-bold">9</strong> (VD: 80km/h lấy 9 - 8 = 1 =&gt; Chọn Đáp án 1)</div>
                  <div>- <strong>Xe chở hàng 4 bánh có gắn động cơ:</strong> Luôn là <strong className="text-emerald-600 dark:text-emerald-400 font-bold">50 km/h</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mẹo 17 & 18 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Cự ly an toàn (km ở giữa đề)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Lấy số lớn nhất trên đề bài trừ 30 rồi chọn đáp án nào bằng hoặc gần bằng nhất.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>Số lớn nhất - 30</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Câu hỏi có cụm &quot;Số tự động&quot;
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Bất cứ câu hỏi nào trong đề xuất hiện cụm từ &quot;số tự động&quot; ta chọn ngay:
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>Chọn Đáp án 1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHƯƠNG 2: NGHIỆP VỤ VẬN TẢI (TRANG 2 & TRANG 3)          */}
      {/* ======================================================== */}
      {selectedChapter === 2 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Mẹo 5 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đáp án nhiều hàng, dài chữ
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Đáp án có từ 5 hàng chữ trở lên
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Quan sát phương án có độ dài vượt trội nhất
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn đáp án dài nhất</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Vận chuyển hành khách bằng xe ô tô
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Đón, trả khách đúng nơi quy định
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án 1</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Lưu ý:</span> Không áp dụng cho câu hỏi có đáp án chứa từ &quot;CẢ...&quot; (trừ Câu 168).
              </div>
            </div>
          </div>

          {/* Mẹo 6 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đáp án cuối có &quot;4 Cả&quot; hoặc &quot;4 Ý&quot;
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Đáp án 4 bắt đầu bằng từ &quot;Cả...&quot; hoặc &quot;Ý...&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Ví dụ: Cả ý 1 và ý 2, Ý 1 và ý 3...
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án 4</span>
                </div>
              </div>

              {/* 4 ngoại lệ dạng list row chuẩn */}
              <div className="pt-1 space-y-2">
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 px-1">
                  Trừ 4 câu ngoại lệ sau (không chọn đáp án 4):
                </div>

                <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 divide-y divide-slate-200/60 dark:divide-slate-700/60 overflow-hidden">
                  {[
                    { label: 'Vạch kẻ đường', ans: 'Chọn Đáp án 2' },
                    { label: 'Người đủ 16 tuổi', ans: 'Chọn Đáp án 2' },
                    { label: 'Trong hoạt động vận tải khách', ans: 'Chọn Đáp án 3' },
                    { label: 'Ngọn lửa, khói', ans: 'Chọn Đáp án 1' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.ans}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mẹo 7 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Hiệu lệnh Cảnh sát giao thông
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Giơ 2 tay */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center text-center space-y-3">
                  <div className="w-28 h-36 bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <img
                      src="/SachMeo/csgt_gio_2_tay.webp"
                      alt="CSGT giang 2 tay"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Giang 2 tay ngang
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      Đứng trên bục giang 2 tay sang ngang
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn Đáp án 4</span>
                  </div>
                </div>

                {/* Giơ 1 tay */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center text-center space-y-3">
                  <div className="w-28 h-36 bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <img
                      src="/SachMeo/csgt_gio_1_tay.webp"
                      alt="CSGT giơ 1 tay"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Giơ 1 tay thẳng đứng
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      Giơ tay lên trời hoặc các trường hợp khác
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn Đáp án 3</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Khẩu quyết:</span> Giang 2 tay chọn 4 — Giơ 1 tay (và tất cả trường hợp còn lại) chọn 3.
              </div>
            </div>
          </div>

          {/* Mẹo 8 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Từ khóa chọn nhanh đáp án đúng
              </h3>
            </div>

            <div className="space-y-3">
              {[
                { keyword: 'Bị nghiêm cấm', desc: 'Hành vi bị pháp luật cấm tuyệt đối' },
                { keyword: 'Không được phép / Không được', desc: 'Có từ "Không được" ở đầu đáp án' },
                { keyword: 'Về số thấp, về số 1', desc: 'Kỹ thuật lái xe xuống dốc, đường trơn' },
                { keyword: 'Thanh nối cứng', desc: 'Quy chuẩn kéo xe rơ-moóc hoặc xe hỏng' },
                { keyword: 'Không quá 4 giờ - 10 giờ - 0.25m - 20m', desc: 'Thời gian lái xe & kích thước xếp hàng' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.keyword}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn đáp án đó</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mẹo 9 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đáp án bắt đầu bằng từ &quot;Quan sát&quot;
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Có từ 2 đáp án trở lên bắt đầu bằng &quot;Quan sát...&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    So sánh độ dài giữa các phương án &quot;Quan sát&quot;
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn &quot;Quan&quot; dài nhất</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Đi từ đường nhánh ra đường chính
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Nhường đường và giảm tốc độ
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Quan sát giảm tốc độ</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Lưu ý ngoại lệ:</span> Câu 253 chọn Đáp án 1; Xe cảnh sát chọn Đáp án 3; Người có GPLX chọn Đáp án 2.
              </div>
            </div>
          </div>

          {/* Mẹo 10 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đáp án 3 có &quot;Cả ý 1 và 2&quot;
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Câu hỏi có từ: &quot;Bảo đảm&quot; - &quot;Bảo dưỡng&quot; - &quot;Cháy&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Xuất hiện từ khóa an toàn/bảo quản kỹ thuật
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn Đáp án 3 Cả</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 divide-y divide-slate-200/60 dark:divide-slate-700/60 overflow-hidden">
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Người tập lái xe
                  </span>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn câu dài</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Dây đai an toàn
                  </span>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[155px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>Chọn &quot;Giữ chặt&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* ======================================================== */}
      {selectedChapter === 3 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Mẹo 11: Văn hóa giao thông & Tai nạn giao thông */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Câu hỏi &quot;Văn hóa giao thông&quot; &amp; &quot;Tai nạn&quot;
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Có đáp án chứa từ &quot;Cả...&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Đề bài hỏi về văn hoá giao thông hoặc khi xảy ra tai nạn
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn đáp án &quot;Cả&quot;</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Không có đáp án &quot;Cả...&quot;
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Quan sát và so sánh độ dài giữa các phương án trả lời
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn đáp án dài nhất</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Ngoại lệ duy nhất:</span> Trừ Câu 186 chọn Đáp án 2 có cụm từ <strong className="text-slate-800 dark:text-slate-200">&quot;Giảm tốc độ chạy chậm qua vùng nước&quot;</strong>.
              </div>
            </div>
          </div>

          {/* Mẹo: Đạo đức & Ứng xử chuẩn mực người lái xe */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Đạo đức &amp; Ứng xử chuẩn mực người lái xe
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Từ khóa cấm tuyệt đối trên đáp án
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Có cụm: &quot;Bị nghiêm cấm&quot; - &quot;Không được phép&quot; - &quot;Tuyệt đối không&quot;
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Chọn đáp án đó</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Khi xảy ra tai nạn giao thông
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Giữ nguyên hiện trường, kịp thời cứu chữa người bị nạn
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Dừng ngay phương tiện</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Đạo đức người lái xe kinh doanh vận tải
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    Luôn tôn trọng khách hàng, ứng xử văn minh, nhã nhặn
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[170px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Giúp đỡ người yếu thế</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* ======================================================== */}
      {selectedChapter === 4 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Card 1: Làn đường, Tốc độ & Vượt xe */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy tắc Làn đường, Tốc độ &amp; Vượt xe
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Hiệu lệnh người ĐKGT & Biển báo tạm thời',
                  desc: 'Khi có hiệu lệnh khác với biển báo hoặc vạch kẻ',
                  ans: 'Chấp hành trước tiên'
                },
                {
                  title: 'Không vượt quá tốc độ cho phép',
                  desc: 'Quy định tối cao về vận tốc tham gia giao thông',
                  ans: 'Tuyệt đối chấp hành'
                },
                {
                  title: 'Di chuyển với tốc độ thấp hơn',
                  desc: 'Xe chạy tốc độ thấp trên đường có nhiều làn',
                  ans: 'Đi về bên phải'
                },
                {
                  title: 'Đường một chiều có phân làn',
                  desc: 'Xe cơ giới, xe máy chuyên dùng',
                  ans: 'Đi trên làn bên trái'
                },
                {
                  title: 'Quy tắc hướng vượt xe',
                  desc: 'Chỉ vượt bên phải khi xe trước đang rẽ trái',
                  ans: 'Luôn vượt bên trái'
                },
                {
                  title: 'Báo hiệu khi muốn vượt xe',
                  desc: 'Được phép dùng trong khu đông dân cư',
                  ans: 'Báo bằng còi hoặc đèn'
                },
                {
                  title: 'Khi xe sau xin vượt đủ điều kiện an toàn',
                  desc: 'Trách nhiệm của người điều khiển xe phía trước',
                  ans: 'Giảm tốc độ, đi sát phải'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[220px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.ans}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Đèn, Còi & Dừng đỗ xe */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy chuẩn Đèn, Còi &amp; Dừng đỗ xe
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Khung giờ được phép bấm còi trong đô thị',
                  desc: 'Cấm sử dụng còi từ 22:00 đêm đến 5:00 sáng',
                  ans: 'Từ 5:00 đến 22:00'
                },
                {
                  title: 'Khu vực đông dân cư vào ban đêm',
                  desc: 'Tuyệt đối không bật đèn pha chiếu xa gây chói',
                  ans: 'Bật đèn chiếu gần (cốt)'
                },
                {
                  title: 'Dừng, đỗ xe sát mép lề đường hè phố',
                  desc: 'Khoảng cách bánh xe gần nhất đến lề đường',
                  ans: 'Không quá 0.25 mét'
                },
                {
                  title: 'Khoảng cách giữa hai xe dừng đỗ',
                  desc: 'Khoảng cách an toàn trên cùng một đoạn đường phố',
                  ans: 'Cách tối thiểu 20 mét'
                },
                {
                  title: 'Trước khi thay đổi làn đường hoặc rẽ',
                  desc: 'Quy tắc an toàn trước khi thực hiện chuyển hướng',
                  ans: 'Bật tín hiệu rẽ trước'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[220px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.ans}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Nhường đường & Vòng xuyến */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy tắc Nhường đường &amp; Vòng xuyến
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Nơi giao nhau CÓ báo hiệu vòng xuyến',
                  desc: 'Xe đã vào trong bùng binh có vòng xuyến',
                  ans: 'Nhường đường bên trái'
                },
                {
                  title: 'Nơi giao nhau KHÔNG CÓ vòng xuyến',
                  desc: 'Ngã tư bình thường không có đảo giao thông',
                  ans: 'Nhường đường bên phải'
                },
                {
                  title: 'Tránh nhau trên đường dốc hẹp',
                  desc: 'Xe đang đổ dốc gặp xe đang bò lên dốc',
                  ans: 'Nhường cho xe lên dốc'
                },
                {
                  title: 'Từ đường nhánh, đường không ưu tiên',
                  desc: 'Ra đường chính hoặc đường có biển ưu tiên',
                  ans: 'Nhường cho xe ưu tiên'
                },
                {
                  title: 'Thứ tự các phương tiện khi xuống phà',
                  desc: 'Ưu tiên phương tiện cơ giới giải tỏa bến nhanh',
                  ans: 'Xe cơ giới → Thô sơ → Người'
                },
                {
                  title: 'Xe từ đường nhánh nhập vào cao tốc',
                  desc: 'Nhập làn tại dải chuyển tốc an toàn',
                  ans: 'Phải nhường đường'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[220px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.ans}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Kỹ thuật xử lý tình huống & Niên hạn xe */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Kỹ thuật Xử lý tình huống &amp; Niên hạn xe
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Đường trơn trượt, mưa ướt, bùn lầy',
                  desc: 'Tránh hiện tượng mất lái, văng đuôi xe',
                  ans: 'Không đánh lái ngoặt, phanh gấp'
                },
                {
                  title: 'Mở cửa xe ô tô xuống xe an toàn',
                  desc: 'Quan sát gương chiếu hậu và ngoái đầu nhìn sau',
                  ans: 'Mở hé quan sát rồi mới mở đủ'
                },
                {
                  title: 'Trước khi điều chỉnh vị trí ghế lái',
                  desc: 'Tránh trượt chân đạp nhầm bàn đạp ga/phanh',
                  ans: 'Về số N(0) hoặc P (kéo phanh tay)'
                },
                {
                  title: 'Thời gian phục hồi điểm GPLX bị trừ',
                  desc: 'Điều kiện không bị trừ hết 12 điểm trong chu kỳ',
                  ans: 'Sau ít nhất 6 tháng'
                },
                {
                  title: 'Thói quen xấu gây trượt ngã xe tay ga',
                  desc: 'Nguy cơ khóa bánh trước đột ngột khi phanh gấp',
                  ans: 'Chỉ sử dụng phanh trước'
                },
                {
                  title: 'Thao tác điều khiển tay ga xe mô tô',
                  desc: 'Quy tắc tăng ga và nhả ga an toàn',
                  ans: 'Tăng từ từ, giảm thật nhanh'
                },
                {
                  title: 'Kéo xe rơ-moóc hoặc xe hỏng',
                  desc: 'Quy chuẩn kết nối phương tiện kéo',
                  ans: 'Chỉ được kéo 1 rơ-moóc'
                },
                {
                  title: 'Phương tiện cấm đi vào đường cao tốc',
                  desc: 'Tốc độ thiết kế thấp hơn 70 km/h',
                  ans: 'Xe gắn máy'
                },
                {
                  title: 'Niên hạn ô tô tải',
                  desc: 'Tính từ năm sản xuất của xe tải',
                  ans: '25 năm'
                },
                {
                  title: 'Niên hạn ô tô chở người trên 9 chỗ',
                  desc: 'Tính từ năm sản xuất của xe chở khách',
                  ans: '20 năm'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[250px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.ans}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

{/* ======================================================== */}
      {selectedChapter === 5 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Card 1: Thứ tự xe lớn - xe nhỏ */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Quy tắc Phân biệt Thứ tự xe lớn – xe nhỏ
              </h3>
            </div>

            {/* 3 Quy tắc ghi dạng danh sách phẳng, không đóng card con */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 font-semibold shrink-0">-</span>
                <span>Cấm xe nhỏ <span className="font-semibold text-slate-900 dark:text-white">→ Cấm luôn xe lớn</span></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 font-semibold shrink-0">-</span>
                <span>Cấm xe lớn <span className="font-semibold text-slate-900 dark:text-white">→ Không cấm xe nhỏ</span></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 font-semibold shrink-0">-</span>
                <span><span className="font-semibold text-slate-900 dark:text-white">Xe 2 bánh và xe 4 bánh</span> không cấm nhau</span>
              </div>
            </div>

            {/* Thứ tự xe: phẳng hoàn toàn, không card con, không badge phân cấp */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/70 space-y-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Thứ tự từ xe nhỏ đến xe lớn:
              </div>

              <div className="overflow-x-auto pb-2 -mx-1 px-1">
                <div className="flex items-center justify-between gap-2 sm:gap-4 w-full min-w-[700px]">
                  {[
                    { name: 'Xe con', src: '/SachMeo/Chuong_5_CauTao_SuaChua/P103a.svg', alt: 'Cấm xe ô tô' },
                    { name: 'Xe khách', src: '/SachMeo/Chuong_5_CauTao_SuaChua/P107a.svg', alt: 'Cấm ô tô khách' },
                    { name: 'Xe tải', src: '/SachMeo/Chuong_5_CauTao_SuaChua/P106a.svg', alt: 'Cấm ô tô tải' },
                    { name: 'Máy kéo', src: '/SachMeo/Chuong_5_CauTao_SuaChua/P109.svg', alt: 'Cấm máy kéo' },
                    { name: 'Máy kéo kéo Rơ-moóc', src: '/SachMeo/Chuong_5_CauTao_SuaChua/P108.svg', alt: 'Cấm xe kéo rơ-moóc' }
                  ].map((car, idx, arr) => (
                    <div key={car.name} className="contents">
                      <div className="flex flex-col items-center text-center space-y-2 min-w-[130px] flex-1">
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm whitespace-nowrap">
                          {car.name}
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1 bg-white rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                          <img
                            src={car.src}
                            alt={car.alt}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {idx < arr.length - 1 && (
                        <div className="shrink-0 text-slate-400 dark:text-slate-500 font-bold text-sm sm:text-base px-0.5">
                          &lt;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 px-1">
                <span>(Nhỏ nhất)</span>
                <span>(Lớn nhất)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Cấu tạo & Sửa chữa ô tô */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Cấu tạo &amp; Sửa chữa ô tô
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Bộ phận giảm thanh',
                  desc: 'Trang bị trên hệ thống ống xả xe cơ giới',
                  ans: 'Bắt buộc'
                },
                {
                  title: 'Kính chắn gió ô tô',
                  desc: 'Quy chuẩn an toàn cho kính xe cơ giới',
                  ans: 'Phải là kính an toàn'
                },
                {
                  title: 'Động cơ diesel không nổ',
                  desc: 'Nguyên nhân thường gặp ở hệ thống cung cấp nhiên liệu',
                  ans: 'Do có lẫn tạp chất'
                },
                {
                  title: 'Dây đai an toàn',
                  desc: 'Cơ cấu bảo vệ giữ chặt người ngồi khi phanh gấp/va chạm',
                  ans: 'Có cơ cấu hãm giữ chặt'
                },
                {
                  title: 'Động cơ 4 kỳ',
                  desc: 'Chu trình hoàn thành một chu kỳ làm việc của động cơ',
                  ans: 'Pít-tông 4 hành trình'
                },
                {
                  title: 'Hệ thống bôi trơn',
                  desc: 'Công dụng chính của dầu bôi trơn động cơ',
                  ans: 'Giảm ma sát, giảm mài mòn'
                },
                {
                  title: 'Công dụng của động cơ ô tô',
                  desc: 'Quá trình chuyển hóa năng lượng sinh công',
                  ans: 'Biến nhiệt năng thành cơ năng'
                },
                {
                  title: 'Hệ thống truyền lực',
                  desc: 'Nhiệm vụ truyền chuyển động từ động cơ ra các bánh xe',
                  ans: 'Truyền mô-men quay'
                },
                {
                  title: 'Ly hợp (côn)',
                  desc: 'Nhiệm vụ ngắt hoặc nối giữa động cơ và hộp số',
                  ans: 'Truyền hoặc ngắt công suất'
                },
                {
                  title: 'Hộp số ô tô',
                  desc: 'Đảm nhận thay đổi tỷ số truyền và chiều chuyển động',
                  ans: 'Đảm bảo chuyển động lùi'
                },
                {
                  title: 'Hệ thống lái',
                  desc: 'Nhiệm vụ chuyển hướng và duy trì hướng chuyển động',
                  ans: 'Thay đổi hướng chuyển động'
                },
                {
                  title: 'Hệ thống phanh',
                  desc: 'Kiểm soát giảm tốc độ và dừng đỗ an toàn',
                  ans: 'Giảm tốc độ xe'
                },
                {
                  title: 'Ắc quy ô tô',
                  desc: 'Cung cấp năng lượng điện khi động cơ chưa hoạt động',
                  ans: 'Tích trữ điện năng'
                },
                {
                  title: 'Máy phát điện',
                  desc: 'Nguồn phát điện chính khi động cơ đang hoạt động',
                  ans: 'Phát điện năng'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 sm:w-[220px] justify-start font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.ans}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

{/* ======================================================== */}
      {selectedChapter === 6 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Card 1: Biển cấm xe & Hướng rẽ (Mẹo 22 - 25) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 1: Biển Cấm Xe &amp; Hướng Rẽ
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 22 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Cuối câu hỏi có từ &quot;móc&quot; hoặc &quot;kéo&quot;
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thấy chữ &quot;móc&quot; chọn 1 và 2 | - Thấy chữ &quot;kéo&quot; chọn 2 và 3
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/342.webp" alt="Câu 342 - từ móc" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 342 (Đề có chữ &quot;móc&quot; → Chọn 1 &amp; 2)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/340.webp" alt="Câu 340 - từ kéo" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 340 (Đề có chữ &quot;kéo&quot; → Chọn 2 &amp; 3)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 23 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Biển cấm mô tô và cấm xe con đi chung
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thấy câu hỏi có từ &quot;cấm&quot; chọn đáp án 1 | - Thấy từ &quot;được&quot; chọn đáp án 3
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/304.webp" alt="Câu 304 - cấm mô tô" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 304 (Đề hỏi &quot;cấm...&quot; → Chọn Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/307.webp" alt="Câu 307 - được đi vào" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 307 (Đề hỏi &quot;được phép...&quot; → Chọn Đáp án 3)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 24 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Đề hỏi cấm xe tải, xe xích lô
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Áp dụng các câu hỏi cấm xe ô tô tải hoặc xe xích lô đi vào
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/302.webp" alt="Câu 302 - cấm xe tải" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 302 (Cấm xe tải → Chọn Đáp án 4 cuối)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/332.webp" alt="Câu 332 - xe xích lô" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 332 (Xe xích lô → Chọn Đáp án cuối)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 25 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      3 hình tròn đỏ cấm rẽ hướng &amp; cấm quay đầu
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Nhìn câu hỏi: Có từ &quot;và&quot; chọn đáp án 2; Không có từ &quot;và&quot; chọn đáp án 1
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/320.webp" alt="Câu 320 - có từ và" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 320 (Đề có chữ &quot;rẽ trái VÀ quay đầu&quot; → Chọn 2)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/317.webp" alt="Câu 317 - không có từ và" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 317 (Đề không có chữ &quot;và&quot; → Chọn 1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Biển hiệu lệnh, Chỉ dẫn & Tốc độ (Mẹo 26 - 29) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 2: Biển Hiệu Lệnh, Chỉ Dẫn &amp; Tốc Độ
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 26 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Vuông xanh có 2 mũi tên móc câu (cho phép rẽ trái, quay đầu)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Không có đáp án &quot;Cả...&quot; chọn đáp án 2; Có &quot;Cả...&quot; thì ưu tiên chọn CẢ
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/322.webp" alt="Câu 322 - rẽ trái" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 322 (Không có đáp án CẢ → Chọn Đáp án 2)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/323.webp" alt="Câu 323 - quay đầu" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 323 (Có đáp án &quot;Cả 2 biển&quot; → Chọn CẢ)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 27 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Gặp biển có dấu trừ (Cấm đi ngược chiều P.102)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Ưu tiên chọn đáp án có chữ &quot;VÀ&quot;; Không có chữ &quot;VÀ&quot; chọn đáp án 2
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/325.webp" alt="Câu 325 - cấm đi ngược chiều" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 325 (Biển 2 có dấu trừ gạch trắng → Chọn Đáp án 2)</span>
                </div>
              </div>

              {/* Mẹo 28 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Biển cấm đỗ xe ngày chẵn, ngày lẻ (P.131b, P.131c)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Cuối câu hỏi hỏi &quot;ngày lẻ&quot; chọn đáp án 1 | - Hỏi &quot;ngày chẵn&quot; chọn đáp án 2
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/327.webp" alt="Câu 327 - ngày lẻ" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 327 (Hỏi đỗ xe ngày lẻ → Chọn Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/328.webp" alt="Câu 328 - ngày chẵn" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 328 (Hỏi đỗ xe ngày chẵn → Chọn Đáp án 2)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 29 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Phân biệt Tốc độ tối đa &amp; Tốc độ tối thiểu (Tròn đỏ 50: Tối đa | Tròn xanh 60: Tối thiểu)
                </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Vòng tròn viền đỏ (50) = Tối đa | - Vòng tròn xanh (60) = Tối thiểu
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/362.webp" alt="Câu 362 - phân biệt tối đa và tối thiểu" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 362 (Biển đỏ 50: Tối đa | Biển xanh 60: Tối thiểu → Chọn Biển 2)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/360.webp" alt="Câu 360 - tốc độ tối đa đêm" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 360 (Đề hỏi tối đa ban đêm → Chọn Biển 1 có chữ &quot;ĐÊM&quot;)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Biển phụ & Nhận diện người đi bộ (Mẹo 30 - 35) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 3: Biển Phụ &amp; Nhận Diện Biển Báo
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 30 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Gặp hình tròn 7t (Hạn chế tải trọng P.115)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Trong câu hỏi: Có 2 đáp án chọn đáp án 2; Có 3 đáp án chọn đáp án 1
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/336.webp" alt="Câu 336 - biển 7t" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 336 (Biển hạn chế tải trọng xe trục 7 tấn)</span>
                </div>
              </div>

              {/* Mẹo 31 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Biển phụ Chiều dài &amp; Khoảng cách (S.501, S.502)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Có 2 mũi tên đứng hai bên = Chiều dài hiệu lực | - Không có mũi tên = Khoảng cách cự ly
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/347.webp" alt="Câu 347 - biển phụ chiều dài" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 347 (Biển phụ có 2 mũi tên đứng là Chiều dài tác dụng)</span>
                </div>
              </div>

              {/* Mẹo 32 & 33 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      3 hình người trong 3 hình dạng khác nhau
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Tam giác vàng = Nhường đường | - Tròn đỏ = Cấm | - Tròn xanh = Dành cho người đi bộ
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/367.webp" alt="Câu 367 - người đi bộ" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 367 (Nhường đường → Chọn Biển 1 tam giác vàng)</span>
                </div>
              </div>

              {/* Mẹo 35 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Biển báo có 2 người dắt tay trẻ em
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thấy trong đề thi có hình ảnh biển 2 người đi dắt tay trẻ em
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/411.webp" alt="Câu 411 - 2 người đi chung" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 411 (Có biển 2 người dắt tay trẻ em → Chọn Đáp án 2)</span>
                </div>
              </div>

              {/* Mẹo 36 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 36: Bảng 15 Biển Báo Nguy Hiểm thường gặp
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Hình tam giác vàng viền đỏ cảnh báo các tình huống nguy hiểm phía trước
                  </div>
                </div>

                <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img 
                    src="/SachMeo/Chuong_6_BienBaoHieu/Trang_10_11_BienPhu_BienNguyHiem.jpg" 
                    alt="Mẹo 36 - 15 biển báo nguy hiểm" 
                    className="max-h-56 object-contain rounded cursor-zoom-in hover:opacity-95 transition-opacity" 
                    loading="lazy" 
                    onClick={() => setPreviewImage('/SachMeo/Chuong_6_BienBaoHieu/Trang_10_11_BienPhu_BienNguyHiem.jpg')}
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Bảng nhận diện 15 biển nguy hiểm (Nhấp vào ảnh để phóng to)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Kỹ thuật quan sát dốc, cấm vượt, cầu vượt & Biển ZONE (Mẹo 37 - 47) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 4: Cấm Vượt, Dốc Chữ V, Cầu Vượt &amp; Biển ZONE
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 37 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Dốc chữ V nguy hiểm (Câu 415, 416)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Đồ thị chúc xuống bên phải = Dốc xuống nguy hiểm 10% | - Đi lên = Dốc lên 9%
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/415.webp" alt="Câu 415 - dốc xuống 10%" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 415 (Biển dốc nguy hiểm 10% chúc xuống)</span>
                </div>
              </div>

              {/* Mẹo 39 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Quy tắc Biển Cấm Vượt (Câu 308 - 312)
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Cấm xe con vượt → Cấm cả xe tải vượt | - Cấm xe tải vượt → Xe con vẫn được vượt
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/308.webp" alt="Câu 308 - cấm vượt" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 308 (Biển cấm ô tô tải vượt không cấm ô tô con)</span>
                </div>
              </div>

              {/* Mẹo 45 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Biển Cầu Vượt Liên Thông &amp; Cầu Vượt Cắt Qua
                    </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Hình chữ nhật xanh có tên địa danh = Cầu vượt liên thông | - Tròn xanh mũi tên chữ thập = Cầu vượt cắt qua
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/457.webp" alt="Câu 457 - cầu vượt liên thông" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium">Câu 457 (Biển chữ nhật có địa danh Quốc lộ là Cầu vượt liên thông)</span>
                </div>
              </div>

              {/* Mẹo 46 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Biển có chữ &quot;ZONE&quot; (Hỏi biển nào chọn đáp án đó)
                </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Câu hỏi hỏi biển nào thì chọn đáp án tương ứng
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/445.webp" alt="Câu 445 - hỏi biển 1" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 445 (Đề hỏi Biển 1 → Chọn Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/444.webp" alt="Câu 444 - đường đối ngoại" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 444 (Đề hỏi đường đối ngoại → Chọn Biển 3 AH112)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 47 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  Nhìn bóng đèn ô tô (Xe tải, xe khách có được phép đi vào không?)
                </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thấy bóng đèn phía trước: Chọn CÓ | - Không thấy bóng đèn (nhìn ngang xe): Chọn KHÔNG
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/462.webp" alt="Câu 462 - thấy bóng đèn" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 462 (Thấy bóng đèn phía trước → Chọn CÓ - Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/463.webp" alt="Câu 463 - không thấy bóng đèn" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 463 (Không thấy bóng đèn, nhìn ngang xe → Chọn KHÔNG - Đáp án 2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* ======================================================== */}
      {selectedChapter === 7 && (
        <div className="space-y-5 sm:space-y-7">
          {/* Card 1: Vạch Kẻ Đường & 5 Nguyên Tắc Sa Hình (Mẹo 48 - 50) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 1: Vạch Kẻ Đường &amp; 5 Nguyên Tắc Sa Hình Cốt Lõi
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 48 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 48: Mũi tên ngoặt cua gấp vàng đen (Biển tiêu phản quang IE.469)
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thấy mũi tên chevron ngoặt vàng đen chuẩn bị vào đường cong nguy hiểm → Chọn Đáp án 2
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                  <img src="/questions/473.webp" alt="Câu 473 - mũi tên ngoặt vàng đen" className="max-h-44 object-contain rounded" loading="lazy" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 473 (Mũi tên ngoặt vàng đen nhắc hướng rẽ đường cong nguy hiểm → Chọn Đáp án 2)</span>
                </div>
              </div>

              {/* Mẹo 49 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 49: Vạch kẻ đường (Phân làn cùng chiều &amp; Phân chia chiều ngược nhau)
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Trắng phân làn | Vàng phân chiều | Vạch đứt được đè, vạch liền cấm đè (Vàng giữa chọn 2, ba vàng chọn 1, còn lại chọn cuối)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/477.webp" alt="Câu 477 - vạch kẻ đường" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 477 (Hỏi vạch không được phép đè vạch → Vạch 2 &amp; Vạch 3: Chọn Đáp án 4)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/482.webp" alt="Câu 482 - vạch phân chiều" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 482 (Hỏi phân chia 2 chiều xe chạy ngược chiều → Vạch 1 màu vàng: Chọn Đáp án 4)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 50: 5 Nguyên tắc Sa hình */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 50: 5 NGUYÊN TẮC SA HÌNH CỐT LÕI (Xét theo thứ tự từ 1 đến 5)
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Bất kỳ bài sa hình nào cũng giải theo đúng thứ tự 5 bước bất biến dưới đây
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1">
                  <div>
                    <strong className="text-slate-900 dark:text-white">1. Vị trí xe (Vào ngã tư trước):</strong> Xe nào đã chớm hoặc vào giao lộ trước thì luôn được quyền đi trước bất kể xe ưu tiên.
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">2. Xe ưu tiên:</strong> Thứ tự quyền đi: <span className="text-red-600 dark:text-red-400 font-bold">Hỏa &gt; Quân &gt; Công &gt; Thương</span> (Cứu hỏa ➔ Quân sự ➔ Công an ➔ Cứu thương).
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">3. Biển báo ưu tiên:</strong> Xe đi trên đường có biển đường ưu tiên (hình thoi vàng, tam giác mũi tên) được đi trước; Xe gặp biển tam giác ngược W.208 phải nhường đường.
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">4. Quyền bên phải không vướng (Bên phải trống):</strong> Tại ngã tư cùng cấp, xe nào phía tay phải không có xe thì được quyền đi trước.
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">5. Hướng ưu tiên:</strong> Thứ tự: <span className="font-bold text-slate-900 dark:text-white">1. Rẽ phải ➔ 2. Đi thẳng ➔ 3. Rẽ trái</span> (Xe rẽ phải không cắt luồng đi trước, xe rẽ trái cắt qua làn xe ngược chiều phải đi sau cùng).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Xe Công An, Xe Tải Biển Đỏ & Thứ Tự Nhường Đường (Mẹo 51 - 53) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 2: Xe Công An, Xe Tải Biển Đỏ &amp; Xe Nào Phải Nhường
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 51 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 51: Khi thấy xe công an xuất hiện trong hình (Quy tắc 1-1-2-4)
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Đếm xe công an ở ô/hướng nào chọn ngay đáp án đó
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/488.webp" alt="Câu 488 - xe công an" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 488 (Xe công an đi thẳng đường ưu tiên → Chọn Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/489.webp" alt="Câu 489 - xe công an" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 489 (Xe công an rẽ ngã tư → Chọn Đáp án 4)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 52 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 52: Xe tải trong hình có biển cấm đỏ
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Xe tải đi thẳng hướng nào thì chọn đáp án đó (hoặc trừ hướng có biển cấm xe tải)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/522.webp" alt="Câu 522 - xe tải" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 522 (Xe tải bị cấm rẽ phải hướng 1 → Chọn Đáp án 2: Hướng 2 &amp; 3)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/524.webp" alt="Câu 524 - xe tải" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 524 (Hướng 2 có biển cấm xe tải → Chọn Đáp án 2: Hướng 1, 3, 4)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 53 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 53: Xe nào phải nhường đường
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thứ tự ưu tiên chọn đáp án: Xe khách ▶ Xe bạn ▶ Xe con
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/491.webp" alt="Câu 491 - vòng xuyến" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 491 (Trong vòng xuyến: Xe tải bên trái đã vào trước → Xe con phải nhường - Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/576.webp" alt="Câu 576 - chướng ngại vật" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 576 (Phía trước có chướng ngại vật → Xe của bạn phải nhường - Đáp án 2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Đèn Tín Hiệu, Xe Đi Trước & Mẹo Đua Xe (Mẹo 54 - 56) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 3: Đèn Tín Hiệu, Xe Đi Trước &amp; Mẹo Đua Xe
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 54 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 54: 6 đèn tín hiệu giao thông có mũi tên đỏ
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Đáp án có cụm &quot;chỉ xe con&quot; chọn ngay | Có mũi tên đỏ =&gt; Bỏ xe con | Không có mũi tên đỏ =&gt; Tìm xe con chọn
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/486.webp" alt="Câu 486 - 6 đèn tín hiệu" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 486 (Hỏi xe chấp hành đúng tín hiệu → Chọn Đáp án 2: Chỉ xe con)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/503.webp" alt="Câu 503 - xe vi phạm" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 503 (Hỏi xe vi phạm tín hiệu đèn → Bỏ xe con → Chọn Đáp án 1: Xe khách, xe tải, mô tô)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 55 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 55: Câu hỏi xe nào &quot;đi trước&quot; (Luôn chọn 2, trừ 2 câu ngoại lệ)
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Đề hỏi xe nào được đi trước: Luôn chọn Đáp án 2 | Ngoại lệ: Trừ câu 525 và 591 chọn Đáp án 1
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/525.webp" alt="Câu 525 - xe đi trước" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 525 (Ngoại lệ: Xe mô tô trên đường ưu tiên rẽ vào đường ưu tiên → Chọn Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/591.webp" alt="Câu 591 - xe đi trước" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 591 (Ngoại lệ: Xe tải đi thẳng giao lộ → Chọn Đáp án 1)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 56 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 56: Mẹo đua xe &amp; Xe vi phạm làn đường
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Vi phạm: Lấy số bánh xe của xe cuối cùng trừ 1 bánh =&gt; Chọn đáp án | Chấp hành =&gt; Chọn Đáp án 2
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/543.webp" alt="Câu 543 - mẹo đua xe" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 543 (Xe cuối là xe con (E) 4 bánh: 4 - 1 = 3, chọn xe E &amp; C → Chọn Đáp án 1)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/554.webp" alt="Câu 554 - chấp hành đúng" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 554 (Hỏi xe chấp hành đúng quy tắc giao thông → Chọn Đáp án 2: Xe A, C, E, G)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Cabin, Biển Cùng Cấp, Xe Đạp & Xe Kéo Xe (Mẹo 57 - 63) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Nhóm 4: Góc Nhìn Cabin, 2 Biển Cùng Cấp, Xe Đạp &amp; Xe Kéo Xe
              </h3>
            </div>

            <div className="space-y-4">
              {/* Mẹo 57 & 60 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 57 &amp; 60: Góc nhìn Cabin thấy xe mô tô &amp; 2 biển cùng cấp đi chung
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Mô tô cùng con đường chọn 2; Mô tô khác đường chọn 3 | 2 biển cùng cấp: Đáp án có từ &quot;và&quot; thì chọn, không có &quot;và&quot; chọn 3
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/556.webp" alt="Câu 556 - mô tô cùng đường" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 556 (Nơi có vạch người đi bộ: Xe của bạn không được vượt → Chọn Đáp án 2)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/534.webp" alt="Câu 534 - 2 biển cùng cấp" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 534 (2 biển cùng cấp: Có đáp án &quot;Xe khách VÀ xe tải&quot; → Chọn Đáp án 1)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 61 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 61: Nhìn hình chọn đáp án (Góc nhìn lái xe cabin)
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Thấy 2 bóng đèn sau xe tải, xe con vàng bên phải, hoặc xe tải bên trái có biển báo → Chọn ngay Đáp án 2
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/588.webp" alt="Câu 588 - xe bạn đi trước" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 588 (Xe của bạn trên đường ưu tiên biển hình thoi → Chọn Đáp án 2)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/549.webp" alt="Câu 549 - nhường xe tải" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 549 (Trước mặt có biển W.208 giao nhau đường ưu tiên: Nhường xe tải → Chọn Đáp án 2)</span>
                  </div>
                </div>
              </div>

              {/* Mẹo 62 & 63 */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Mẹo 62 &amp; 63: Xe đạp xuất hiện &amp; Xe kéo xe
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    - Xe đạp đi cùng chiều chọn 2, khác chiều chọn 3 | Thấy xe kéo xe: Luôn là Vi phạm, Không đúng
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/574.webp" alt="Câu 574 - xe đạp" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 574 (Trước mặt có biển STOP: Nhường xe đạp và xe khách → Chọn Đáp án 3)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
                    <img src="/questions/510.webp" alt="Câu 510 - xe kéo xe" className="max-h-40 sm:max-h-44 object-contain rounded" loading="lazy" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 font-medium text-center">Câu 510 (Xe tải kéo mô tô 3 bánh vào đường cấm kéo moóc → Chọn KHÔNG ĐÚNG - Đáp án 2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal phóng to ảnh */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[92vh] flex flex-col items-center">
            <img
              src={previewImage}
              alt="Phóng to bảng tra cứu"
              className="max-w-full max-h-[86vh] object-contain rounded-xl shadow-2xl bg-white dark:bg-slate-900"
            />
            <span className="text-white/80 text-xs mt-2.5 font-medium bg-black/40 px-3 py-1 rounded-full">
              Nhấp vào bất kỳ đâu để đóng
            </span>
          </div>
        </div>
      )}


    </div>
  );
};

