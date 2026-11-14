import React, { useEffect } from 'react';
import type { SubHeaderConfig } from './Navbar';

export interface LawGuideViewProps {
  onBack: () => void;
  onSubHeaderChange?: (config: SubHeaderConfig | null) => void;
}

export const LawGuideView: React.FC<LawGuideViewProps> = ({
  onBack,
  onSubHeaderChange
}) => {
  useEffect(() => {
    onSubHeaderChange?.({
      title: 'Quy chế sát hạch & Phân hạng mới',
      onBack
    });
    return () => {
      onSubHeaderChange?.(null);
    };
  }, [onBack, onSubHeaderChange]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6 animate-in fade-in duration-150 select-text min-w-0 overflow-x-hidden">
      {/* 1. Lộ trình 3 mốc thời gian */}
      <div className="space-y-3 min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Lộ trình thay đổi quy chế
        </h2>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs overflow-hidden">
          {/* Mốc 1 */}
          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Từ 01/01/2025: Chuẩn hóa phân hạng GPLX
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Luật Trật tự, an toàn giao thông đường bộ 2024 có hiệu lực. Hạng B1 tự động và B2 cũ được gộp thành hạng B (ô tô đến 8 chỗ, tải đến 3.500 kg). Hạng A1 cấp cho xe đến 125cc (hoặc điện đến 11 kW); xe trên 125cc thi hạng A. Bằng lái đã cấp trước 2025 giữ nguyên giá trị sử dụng đến hết hạn ghi trên thẻ.
            </p>
          </div>

          {/* Mốc 2 */}
          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Từ 01/07/2026: Bãi bỏ bài thi 120 mô phỏng
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Chính thức bỏ bài thi mô phỏng trên máy tính khi sát hạch cấp bằng lái ô tô (theo Nghị định 94/2026/NĐ-CP). Quy trình thi còn 3 phần tuần tự: <em>Lý thuyết → Sa hình → Đường trường</em>. Thí sinh thi trước ngày 01/07/2026 vẫn thi đủ 120 tình huống theo quy định hiện hành.
            </p>
          </div>

          {/* Mốc 3 */}
          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Từ năm 2027: Đổi mới đề thi lý thuyết & Đường trường 5 km
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Theo Thông tư 108/2026/TT-BCA: Từ 01/01/2027 bắt buộc quét định danh VNeID/CCCD gắn chip khi vào thi. Từ 01/03/2027 áp dụng cấu trúc đề thi mới (hạng B tăng lên 50 câu, hạng A tăng lên 40 câu) và nâng cự ly sát hạch thực hành đường trường lên tối thiểu 5 km với 12 bài thực tế.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Bảng đối chiếu cấu trúc đề thi lý thuyết */}
      <div className="space-y-3 min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Cấu trúc đề thi lý thuyết (Hiện tại vs Từ 01/03/2027)
        </h2>

        <div className="w-full max-w-full min-w-0 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[480px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3.5 font-semibold whitespace-nowrap">Hạng GPLX</th>
                  <th className="p-3.5 font-semibold whitespace-nowrap">Hiện tại (Đến 02/2027)</th>
                  <th className="p-3.5 font-semibold whitespace-nowrap">Từ 01/03/2027</th>
                  <th className="p-3.5 font-semibold whitespace-nowrap">Điểm liệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">A1, A</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">25 câu / 19 phút (Đạt ≥ 21)</td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">40 câu / 27 phút (Đạt ≥ 36)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">Sai 1 câu trượt</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">B (B1, B2 cũ)</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">35 câu / 22 phút (Đạt ≥ 32)</td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">50 câu / 33 phút (Đạt ≥ 45)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">Sai 1 câu trượt</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">C1</td>
                  <td className="p-3.5 text-slate-400 dark:text-slate-500">—</td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">60 câu / 40 phút (Đạt ≥ 54)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">Sai 1 câu trượt</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">C</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">40 câu / 24 phút (Đạt ≥ 36)</td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">70 câu / 47 phút (Đạt ≥ 63)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">Sai 1 câu trượt</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">D1, D2, D</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">45 câu / 26 phút (Đạt ≥ 41)</td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">80 câu / 53 phút (Đạt ≥ 72)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">Sai 1 câu trượt</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">BE, C1E, CE...</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">45 câu / 26 phút (Đạt ≥ 41)</td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">90 câu / 60 phút (Đạt ≥ 81)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">Sai 1 câu trượt</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
            * Cả hai giai đoạn đều áp dụng quy định: Làm sai bất kỳ câu hỏi nào trong bộ 60 câu điểm liệt sẽ bị tính trượt ngay.
          </div>
        </div>
      </div>

      {/* 3. Bảng đối chiếu phân hạng bằng */}
      <div className="space-y-3 min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bảng đối chiếu phân hạng GPLX (Từ 01/01/2025)
        </h2>

        <div className="w-full max-w-full min-w-0 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[460px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3.5 font-semibold whitespace-nowrap">Hạng</th>
                  <th className="p-3.5 font-semibold">Quy định mới</th>
                  <th className="p-3.5 font-semibold whitespace-nowrap">Quy định cũ trước 2025</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">A1</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Mô tô đến 125cc hoặc điện đến 11 kW</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Mô tô 50cc – dưới 175cc</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">A</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Mô tô trên 125cc hoặc điện trên 11 kW</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Thay thế hạng A2 (trên 175cc)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">B1</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Mô tô 3 bánh và các loại xe của hạng A1</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Ô tô con số tự động</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">B</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Ô tô chở người đến 8 chỗ; tải đến 3.500 kg</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Gộp B1 tự động và B2 cũ</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">C1</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Ô tô tải từ 3.500 kg đến 7.500 kg</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Hạng mới bổ sung</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">C</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Ô tô tải trên 7.500 kg</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Tải trên 3.500 kg</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">D1 / D2 / D</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">D1 (đến 16 chỗ), D2 (đến 29 chỗ), D (trên 29 chỗ)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Thay thế hạng D và E cũ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Lưu ý cho người học */}
      <div className="space-y-3 min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Lưu ý cho người học
        </h2>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Thi trong năm 2026 có phải học mô phỏng không?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Có. Bài thi mô phỏng chỉ bãi bỏ đối với các kỳ thi từ ngày 01/07/2026. Thí sinh thi trước thời điểm này vẫn phải hoàn thành đủ 120 tình huống mô phỏng theo quy chế hiện hành.
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Nên thi trước hay sau tháng 03/2027?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Nên thi sớm trước ngày 01/03/2027. Đề thi hiện tại gồm 35 câu (hạng B) thay vì 50 câu sau này, và cự ly thi đường trường ngắn hơn, giúp giảm đáng kể áp lực khi vào phòng thi.
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Giá trị sử dụng của bằng lái cũ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tất cả giấy phép lái xe đã cấp trước ngày 01/01/2025 tiếp tục giữ nguyên giá trị sử dụng đến hết hạn ghi trên thẻ, không bắt buộc phải đổi sang hạng mới trừ khi hết hạn hoặc có nhu cầu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
