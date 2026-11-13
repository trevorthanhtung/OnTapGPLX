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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6 animate-in fade-in duration-150 select-text">
      {/* 1. Điểm thay đổi chính */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Điểm thay đổi chính
        </h2>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Bãi bỏ thi mô phỏng trong kỳ sát hạch chính thức
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Dự thảo quy chuẩn mới của Bộ Công an bãi bỏ bài thi 120 tình huống mô phỏng khi sát hạch cấp bằng. Nội dung này chỉ còn áp dụng trong chương trình đào tạo và thi tốt nghiệp cấp chứng chỉ nghề tại trung tâm.
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Gộp và chuẩn hóa phân hạng GPLX
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Hạng B1 số tự động và B2 cũ được gộp chung thành Hạng B. Hạng B1 mới chuyển sang cấp cho xe mô tô 3 bánh. Bổ sung hạng C1 cho ô tô tải từ 3,5 đến 7,5 tấn.
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Ngân hàng 600 câu hỏi lý thuyết
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Các trung tâm và hội đồng thi tiếp tục áp dụng trọn vẹn Bộ 600 câu hỏi lý thuyết hiện hành cho đến khi Bộ Công an công bố ngân hàng đề mới.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Bảng đối chiếu phân hạng bằng */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bảng đối chiếu phân hạng GPLX
        </h2>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3.5 font-semibold whitespace-nowrap">Hạng</th>
                  <th className="p-3.5 font-semibold">Quy định mới</th>
                  <th className="p-3.5 font-semibold whitespace-nowrap">Quy định cũ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">A1</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Mô tô đến 125cc hoặc điện đến 11 kW</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Mô tô 50cc – dưới 175cc</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">A</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Mô tô trên 125cc hoặc điện trên 11 kW</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Thay thế hạng A2 (trên 175cc)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">B1</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Mô tô 3 bánh và các loại xe của hạng A1</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Ô tô con số tự động</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">B</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Ô tô chở người đến 8 chỗ; tải đến 3.500 kg</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Gộp B1 tự động và B2 cũ</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">C1</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Ô tô tải từ 3.500 kg đến 7.500 kg</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Hạng mới bổ sung</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">C</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">Ô tô tải trên 7.500 kg</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Tải trên 3.500 kg</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">D1 / D2 / D</td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">D1 (đến 16 chỗ), D2 (đến 29 chỗ), D (trên 29 chỗ)</td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">Thay thế hạng D và E cũ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Lưu ý cho học viên */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Lưu ý cho người học
        </h2>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Kế hoạch ôn tập hiện tại
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Thí sinh chuẩn bị thi tiếp tục ôn luyện bình thường theo trọn bộ 600 câu hỏi trên ứng dụng. Toàn bộ các kỳ thi hiện tại vẫn sử dụng ngân hàng đề này.
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Giá trị sử dụng của bằng lái cũ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Các loại GPLX đã cấp trước đây vẫn giữ nguyên giá trị sử dụng theo thời hạn ghi trên thẻ, không bắt buộc phải đổi sang hạng mới trừ khi hết hạn hoặc có nhu cầu cấp đổi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
