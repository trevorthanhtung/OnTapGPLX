export interface TipIllustration {
  url: string;
  caption?: string;
}

export interface ExamTip {
  id: string;
  tipNumber: number;
  chapter: number;        // 1 -> 7 (Lý thuyết 600 câu), 8 (120 Mô phỏng)
  title: string;
  questionRange?: string; // Câu hỏi áp dụng trong bộ 600 câu
  isFatal?: boolean;
  rule: string;
  detail: string[];
  note?: string;
  example?: string;
  illustrations?: TipIllustration[];
}

export interface BookPage {
  title: string;
  image: string;
}

export interface TipChapter {
  id: number;
  title: string;
  name: string;
  range: string;
  bookPages?: BookPage[];
}

export interface BookSpread {
  id: number;
  pageTitle: string;
  chapterTitle: string;
  image: string;
  tipsCovered: string;
}

export const BOOK_SPREADS: BookSpread[] = [
  {
    id: 1,
    pageTitle: 'Trang 1',
    chapterTitle: 'Chương 1: Khái niệm & Quy tắc',
    image: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_01_KhaiNiem_QuyTac.jpg',
    tipsCovered: 'Mẹo 1 - 4: Đầu & cuối câu, từ khóa, hành vi cấm'
  },
  {
    id: 2,
    pageTitle: 'Trang 2 - 3',
    chapterTitle: 'Chương 1 & 2: Quy tắc & Nghiệp vụ vận tải',
    image: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_02_03_QuyTac_CSGT.jpg',
    tipsCovered: 'Mẹo 5 - 11: Đáp án dài, CSGT giơ tay, cụm từ nhanh, 3 CẢ'
  },
  {
    id: 3,
    pageTitle: 'Trang 4 - 5',
    chapterTitle: 'Chương 1 & 4: Tốc độ & Kỹ thuật',
    image: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_04_05_TocDo_DoTuoi.jpg',
    tipsCovered: 'Mẹo 12 - 19: Giảm tốc độ, độ tuổi, trong/ngoài KDC, kỹ thuật lái'
  },
  {
    id: 4,
    pageTitle: 'Trang 6 - 7',
    chapterTitle: 'Chương 4 & 5: Cấu tạo & Thứ tự xe',
    image: '/SachMeo/Chuong_4_KyThuatLaiXe/Trang_06_XuLyTinhHuong.jpg',
    tipsCovered: 'Mẹo 20 - 21: Cấu tạo sửa chữa ô tô, Thứ tự xe nhỏ đến lớn'
  },
  {
    id: 5,
    pageTitle: 'Trang 8 - 9',
    chapterTitle: 'Chương 6: Biển báo cấm & Tốc độ',
    image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_08_09_BienCam_TocDo.jpg',
    tipsCovered: 'Mẹo 22 - 29: Móc/kéo, cấm xe tải, ngày chẵn lẻ, tốc độ 50/60'
  },
  {
    id: 6,
    pageTitle: 'Trang 10 - 11',
    chapterTitle: 'Chương 6: Biển phụ & Biển nguy hiểm',
    image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_10_11_BienPhu_BienNguyHiem.jpg',
    tipsCovered: 'Mẹo 30 - 36: Biển 7t, chiều dài khoảng cách, 15 biển nguy hiểm'
  },
  {
    id: 7,
    pageTitle: 'Trang 12 - 13',
    chapterTitle: 'Chương 6: Dốc chữ V & Cấm vượt',
    image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_12_13_DocChuV_CamVuot.jpg',
    tipsCovered: 'Mẹo 37 - 40: Dốc 10%/9%, sạt lở/lún, nhóm biển cấm vượt'
  },
  {
    id: 8,
    pageTitle: 'Trang 14 - 15',
    chapterTitle: 'Chương 6: Tốc độ làn đường & Cầu vượt',
    image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_14_15_TocDoLanDuong_CauVuot.jpg',
    tipsCovered: 'Mẹo 41 - 47: Biển 14m, cầu vượt liên thông, biển ZONE, bóng đèn'
  },
  {
    id: 9,
    pageTitle: 'Trang 16 - 17',
    chapterTitle: 'Chương 7: Vạch kẻ đường & Sa hình',
    image: '/SachMeo/Chuong_7_SaHinh/Trang_16_17_5NguyenTacSaHinh.jpg',
    tipsCovered: 'Mẹo 48 - 53: Vạch kẻ đường, 5 nguyên tắc sa hình, xe công an'
  },
  {
    id: 10,
    pageTitle: 'Trang 18 - 19',
    chapterTitle: 'Chương 7: Sa hình xe ưu tiên & Đua xe',
    image: '/SachMeo/Chuong_7_SaHinh/Trang_18_19_SaHinhXeUuTien_DuaXe.jpg',
    tipsCovered: 'Mẹo 54 - 60: 6 đèn mũi tên đỏ, xe đi trước, mẹo đua xe'
  },
  {
    id: 11,
    pageTitle: 'Trang 20',
    chapterTitle: 'Chương 7: Sa hình nâng cao & Biển hiệu lệnh',
    image: '/SachMeo/Chuong_7_SaHinh/Trang_20_DenXe_XeKeoXe.jpg',
    tipsCovered: 'Mẹo 61 - 63: Đèn xe tải, xe đạp, xe kéo xe + Biển hiệu lệnh'
  },
  {
    id: 12,
    pageTitle: 'Bìa trong',
    chapterTitle: 'Bảng tra cứu Biển báo cấm & Táp-lô',
    image: '/SachMeo/Chuong_6_BienBaoHieu/BiaTrong_BangTraCuuBienCam_TapLo.jpg',
    tipsCovered: '40 biển báo cấm chuẩn quy chuẩn & biểu tượng táp-lô ô tô'
  }
];

export const TIP_CHAPTERS: TipChapter[] = [
  {
    id: 1,
    title: 'Chương 1',
    name: 'Khái niệm & Quy tắc',
    range: 'Câu 1 - 166',
    bookPages: [
      { title: 'Trang 1: Khái niệm & Quy tắc', image: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_01_KhaiNiem_QuyTac.jpg' },
      { title: 'Trang 2 - 3: Quy tắc & Hiệu lệnh CSGT', image: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_02_03_QuyTac_CSGT.jpg' },
      { title: 'Trang 4: Tốc độ & Độ tuổi', image: '/SachMeo/Chuong_1_KhaiNiem_QuyTac/Trang_04_05_TocDo_DoTuoi.jpg' }
    ]
  },
  {
    id: 2,
    title: 'Chương 2',
    name: 'Nghiệp vụ vận tải',
    range: 'Câu 167 - 192',
    bookPages: [
      { title: 'Trang 2 - 3: Nghiệp vụ vận tải', image: '/SachMeo/Chuong_2_NghiepVuVanTai/Trang_02_03_NghiepVuVanTai.jpg' }
    ]
  },
  {
    id: 3,
    title: 'Chương 3',
    name: 'Văn hóa & Đạo đức lái xe',
    range: 'Câu 193 - 213',
    bookPages: [
      { title: 'Trang 3: Văn hóa giao thông', image: '/SachMeo/Chuong_3_VanHoa_DaoDuc/Trang_03_VanHoaGiaoThong.jpg' }
    ]
  },
  {
    id: 4,
    title: 'Chương 4',
    name: 'Kỹ thuật lái xe',
    range: 'Câu 214 - 269',
    bookPages: [
      { title: 'Trang 5: Kỹ thuật lái xe', image: '/SachMeo/Chuong_4_KyThuatLaiXe/Trang_05_KyThuatLaiXe.jpg' },
      { title: 'Trang 6: Xử lý tình huống', image: '/SachMeo/Chuong_4_KyThuatLaiXe/Trang_06_XuLyTinhHuong.jpg' }
    ]
  },
  {
    id: 5,
    title: 'Chương 5',
    name: 'Cấu tạo & Sửa chữa',
    range: 'Câu 270 - 304',
    bookPages: [
      { title: 'Trang 7: Cấu tạo xe & Thứ tự xe lớn nhỏ', image: '/SachMeo/Chuong_5_CauTao_SuaChua/Trang_07_CauTaoXe_ThuTuXe.jpg' }
    ]
  },
  {
    id: 6,
    title: 'Chương 6',
    name: 'Biển báo đường bộ',
    range: 'Câu 305 - 486',
    bookPages: [
      { title: 'Trang 8 - 9: Biển cấm & Tốc độ', image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_08_09_BienCam_TocDo.jpg' },
      { title: 'Trang 10 - 11: Biển phụ & Biển nguy hiểm', image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_10_11_BienPhu_BienNguyHiem.jpg' },
      { title: 'Trang 12 - 13: Biển báo nguy hiểm & Cấm vượt', image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_12_13_DocChuV_CamVuot.jpg' },
      { title: 'Trang 14 - 15: Tốc độ làn đường & Cầu vượt', image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_14_15_TocDoLanDuong_CauVuot.jpg' },
      { title: 'Bảng tổng hợp Biển báo cấm & Táp-lô', image: '/SachMeo/Chuong_6_BienBaoHieu/BiaTrong_BangTraCuuBienCam_TapLo.jpg' },
      { title: 'Bảng tổng hợp Biển hiệu lệnh & Chỉ dẫn', image: '/SachMeo/Chuong_6_BienBaoHieu/Trang_20_BienHieuLenh.jpg' }
    ]
  },
  {
    id: 7,
    title: 'Chương 7',
    name: 'Giải các thế sa hình',
    range: 'Câu 487 - 600',
    bookPages: [
      { title: 'Trang 16 - 17: Vạch kẻ đường & 5 nguyên tắc sa hình', image: '/SachMeo/Chuong_7_SaHinh/Trang_16_17_5NguyenTacSaHinh.jpg' },
      { title: 'Trang 18 - 19: Sa hình xe ưu tiên & Đua xe', image: '/SachMeo/Chuong_7_SaHinh/Trang_18_19_SaHinhXeUuTien_DuaXe.jpg' },
      { title: 'Trang 20: Sa hình đèn xe & Xe kéo xe', image: '/SachMeo/Chuong_7_SaHinh/Trang_20_DenXe_XeKeoXe.jpg' }
    ]
  },
  {
    id: 8,
    title: 'Mô phỏng',
    name: '120 tình huống mô phỏng',
    range: 'Tình huống 1 - 120',
    bookPages: [
      { title: 'Trang 19: Sa hình mô phỏng phản xạ', image: '/SachMeo/Chuong_7_SaHinh/Trang_18_19_SaHinhXeUuTien_DuaXe.jpg' }
    ]
  }
];

export const EXAM_TIPS: ExamTip[] = [
  // ==========================================
  // CHƯƠNG 1: KHÁI NIỆM & QUY TẮC (Câu 1 - 166)
  // ==========================================
  {
    id: 'tip-1',
    tipNumber: 1,
    chapter: 1,
    title: 'Từ khóa đầu câu và cuối câu hỏi',
    questionRange: 'Câu: 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 14, 15, 16',
    rule: 'Khổ - Thô sơ - Cao tốc chọn 1 | Phần - Làn - Dải - Vạch - Cơ giới - Dừng - Đỗ chọn 2.',
    detail: [
      'Đầu câu có cụm từ "Khổ", "Thô sơ", "Đường cao tốc" => Chọn đáp án 1 (Câu: 3, 9, 16).',
      'Đầu câu có "Phần", "Làn", "Dải", "Vạch", "Cơ giới", "Dừng xe", "Đỗ xe" => Chọn đáp án 2 (Câu: 1, 2, 4, 5, 8, 14, 15).',
      'Giữa câu hỏi có từ "gồm" => Chọn đáp án cuối cùng (Câu: 10, 11, 12).'
    ]
  },
  {
    id: 'tip-2',
    tipNumber: 2,
    chapter: 1,
    title: 'Ráp cụm từ câu hỏi với đáp án',
    questionRange: 'Câu: 6, 7, 18, 21, 26, 33',
    rule: 'Đối chiếu từ khóa trên đề bài với từ khóa tương ứng ở đáp án.',
    detail: [
      'Đề có "Người điều khiển phương tiện" => Đáp án chọn "Người điều khiển xe cơ giới" (Câu: 6).',
      'Đề có "Người lái xe" => Đáp án chọn "Là người điều khiển xe cơ giới" (Câu: 7).',
      'Đề có "Theo chức năng phục vụ" => Chọn đáp án nào có dòng chữ dài nhất (Câu: 18).',
      'Đề có "Tổ chức đua xe được phép" => Chọn đáp án có "Cơ quan có thẩm quyền" (Câu: 21).',
      'Đề có "Theo luật phòng chống tác hại rượu bia" => Chọn "Người điều khiển xe" (Câu: 26).',
      'Đề hỏi "Có bao nhiêu nhóm biển báo hiệu đường bộ" => Chọn đáp án "5 nhóm" (Câu: 33).'
    ]
  },
  {
    id: 'tip-3',
    tipNumber: 3,
    chapter: 1,
    title: 'Hành vi bị nghiêm cấm, không được phép',
    questionRange: 'Câu: 19, 29, 32, 52, 53, 64, 65',
    isFatal: true,
    rule: 'Thấy hành vi nguy hiểm, cấm đoán tuyệt đối ở câu hỏi -> Chọn phương án không được phép.',
    detail: [
      'Rải vật sắc nhọn trên đường (Câu: 19).',
      'Cải tạo trái phép cố ý hệ thống xe (Câu: 29).',
      'Lạng lách đánh võng trên đường (Câu: 32).',
      'Đi xe dàn hàng ngang, buông cả 2 tay khi lái xe máy (Câu: 64, 65).',
      'Sử dụng điện thoại di động khi đang điều khiển phương tiện (Câu: 52).',
      'Vượt xe trên cầu hẹp 1 làn xe (Câu: 53).',
      'Đi song song cùng chiều xe khác, sử dụng ô dù khi đi xe mô tô.'
    ]
  },
  {
    id: 'tip-4',
    tipNumber: 4,
    chapter: 1,
    title: 'Câu hỏi có cụm từ "Hành vi"',
    questionRange: 'Câu: 20, 22, 23, 25, 27, 28, 30, 197',
    rule: 'Đầu câu hỏi có từ "Hành vi" => Chọn đáp án cuối cùng.',
    detail: [
      'Áp dụng cho chuỗi các câu hỏi liên quan đến hành vi đạo đức, ứng xử khi lái xe.',
      'Đọc thấy chữ "Hành vi..." ở đầu câu => Chọn luôn đáp án nằm ở vị trí cuối cùng.'
    ],
    note: 'Lưu ý: Ngoại lệ duy nhất là Câu 19 chọn đáp án 2.'
  },
  {
    id: 'tip-5',
    tipNumber: 5,
    chapter: 1,
    title: 'Đáp án nhiều hàng, nhiều chữ nhất',
    questionRange: 'Câu: 14, 15, 16, 17, 40, 78, 84, 94, 103, 114, 179, 195, 209, 210, 214, 248, 249',
    rule: 'Đáp án có từ 5 hàng trở lên (dài vượt trội) => Thường là đáp án đúng.',
    detail: [
      'So sánh độ dài giữa các phương án trả lời 1 - 2 - 3 - 4.',
      'Đáp án nào được giải thích cặn kẽ, dài nhất (từ 5 dòng chữ trở lên) thì ưu tiên chọn.'
    ],
    note: 'Không áp dụng cho các câu hỏi mà đáp án có chữ "Cả ý 1 và ý 2", và trừ câu 168 (Vận chuyển hành khách bằng xe ô tô chọn đáp án 1 - nơi quy định).'
  },
  {
    id: 'tip-6',
    tipNumber: 6,
    chapter: 1,
    title: 'Mẹo chọn đáp án "Cả ý 1 và ý 2" (hoặc Cả 4 ý)',
    questionRange: 'Câu: 27, 35, 56, 58, 66, 70, 88, 95, 102, 107, 117, 132, 138, 139, 165, 169, 173, 174, 175, 177, 194, 202, 205, 220, 251, 257, 258, 261, 262, 263, 267, 294',
    rule: 'Đáp án cuối cùng có "Cả ý 1 và ý 2" (hoặc Cả ý 2 và ý 3) => Chọn ngay.',
    detail: [
      'Khoảng 90% câu hỏi lý thuyết có đáp án gộp "Cả ý..." đều là đáp án chính xác.',
      'Nếu phân vân giữa 2 đáp án đúng, hãy kiểm tra đáp án gộp ở cuối.'
    ],
    note: 'Ngoại trừ 4 câu không chọn "Cả": Câu 5 (Vạch kẻ đường chọn 2), Câu 123 (Người đủ 16 tuổi chọn 2), Câu 170 (Trong hoạt động vận tải khách chọn 3), Câu 204 (Ngọn lửa, khói chọn 1).'
  },
  {
    id: 'tip-7',
    tipNumber: 7,
    chapter: 1,
    title: 'Hiệu lệnh của Cảnh sát giao thông (CSGT)',
    questionRange: 'Câu: 36, 37, 528, 529',
    rule: 'CSGT giang 2 tay chọn 4 | CSGT giơ 1 tay chọn 3.',
    detail: [
      'CSGT đứng trên bục giang 2 tay (hoặc 1 tay ngang) => Chọn ngay đáp án 4 (Câu: 36).',
      'Ý nghĩa: Người tham gia giao thông ở phía trước và sau dừng lại; phía bên phải và bên trái được đi.',
      'CSGT giơ 1 tay thẳng đứng hướng lên trời => Chọn ngay đáp án 3.',
      'Ý nghĩa: Tất cả các hướng đều phải dừng lại (trừ xe đã ở trong giao lộ).'
    ],
    illustrations: [
      { url: '/questions/036.webp', caption: 'CSGT giang 2 tay => Chọn đáp án 4' },
      { url: '/questions/037.webp', caption: 'CSGT giơ 1 tay => Chọn đáp án 3' }
    ]
  },
  {
    id: 'tip-8',
    tipNumber: 8,
    chapter: 1,
    title: 'Các cụm từ chọn nhanh đáp án đúng',
    questionRange: 'Câu: 24, 31, 42, 47, 60, 61, 63, 67, 73, 74, 86, 98, 104, 106, 171, 172, 197, 212, 213, 214, 221, 222, 223, 224, 237, 243, 252',
    rule: 'Thấy các cụm từ chuẩn mực này xuất hiện trong đáp án => Chọn ngay.',
    detail: [
      '"Thanh nối cứng" (Câu: 104, 106) => Chọn luôn.',
      '"Bị nghiêm cấm" (Câu: 24, 31, 197) => Chọn luôn.',
      '"Không quá 4 giờ, 10 giờ, 0.25 mét, 20 mét" (Câu: 60, 61, 171, 172) => Chọn luôn.',
      '"Về số thấp", "Về số 1" (Câu: 212, 213, 214, 223, 224, 237, 243, 252) => Chọn luôn.',
      'Đáp án có từ "Không được phép", "Không được..." => Ưu tiên chọn.'
    ]
  },
  {
    id: 'tip-9',
    tipNumber: 9,
    chapter: 1,
    title: 'Mẹo "Cơ quan có thẩm quyền" (UBND)',
    questionRange: 'Câu: 34, 84, 85, 210, 215, 246, 249, 256',
    rule: 'Đầu đáp án có từ "Cơ quan có thẩm quyền" hoặc "Ủy ban nhân dân" => Chọn đáp án dài nhất.',
    detail: [
      'Áp dụng cho các câu hỏi về cấp phép đường cấm, tải trọng quá khổ, diễu hành, phân luồng giao thông.',
      'Nếu thấy 2 hoặc 3 đáp án đều có từ "Cơ quan...", chọn đáp án có nhiều chữ nhất.'
    ],
    note: 'Trừ 2 câu: Xe cảnh sát chọn đáp án 3 (Câu: 97); Người có GPLX chọn đáp án 2 (Câu: 140). Lưu ý câu 253 chọn đáp án 1 (giảm tốc độ).'
  },
  {
    id: 'tip-10',
    tipNumber: 10,
    chapter: 1,
    title: 'Mẹo các câu hỏi có đáp án 3 là "Cả"',
    questionRange: 'Câu: 143, 162, 178, 180, 219, 265, 269, 270, 271, 273',
    rule: 'Đáp án 3 có chữ "Cả..." kết hợp câu hỏi có từ "bảo đảm", "bảo dưỡng", "cháy" => Chọn đáp án 3.',
    detail: [
      'Câu hỏi chứa từ "bảo đảm" => Chọn đáp án 3.',
      'Câu hỏi chứa từ "bảo dưỡng" => Chọn đáp án 3.',
      'Câu hỏi chứa từ "cháy" => Chọn đáp án 3.'
    ],
    note: 'Ngoại trừ: Câu 136 (Người tập lái xe) chọn câu dài; Câu 274 (Dây đai an toàn) chọn đáp án "Giữ chặt".'
  },
  {
    id: 'tip-12',
    tipNumber: 12,
    chapter: 1,
    title: 'Đáp án có cụm từ "Giảm tốc độ"',
    questionRange: 'Câu: 81, 87, 90, 107, 110, 167, 198, 215, 217, 237, 240, 241, 243, 245, 253, 284',
    rule: 'Trong các đáp án, nếu chỉ có duy nhất 1 đáp án chứa "Giảm tốc độ" => Chọn ngay.',
    detail: [
      'Tư duy an toàn giao thông luôn ưu tiên hành động chủ động giảm tốc độ, nhường đường.',
      'Thấy các đáp án khác có từ "Tăng tốc độ", "Đi nhanh", "Bấm còi liên tục" => Loại trừ ngay.'
    ],
    note: 'Không áp dụng khi có 2 đáp án cùng có chữ "Giảm tốc độ" hoặc đáp án cuối có "Cả", và trừ câu 248.'
  },
  {
    id: 'tip-13',
    tipNumber: 13,
    chapter: 1,
    title: 'Câu hỏi về độ tuổi lái xe trên đáp án',
    questionRange: 'Câu: 118, 119, 120, 121, 122',
    rule: 'Nhìn vào 3 đáp án đầu (1 - 2 - 3) => Chọn đáp án có số tuổi lớn nhất.',
    detail: [
      'Ví dụ câu hỏi có các phương án 18 tuổi, 21 tuổi, 24 tuổi => Chọn số lớn nhất 24 tuổi.',
      'Quy luật: Luật quy định các mốc tuổi điều khiển phương tiện tải trọng lớn / chở nhiều người tăng dần theo từng nấc 3 năm (18, 21, 24, 27).'
    ]
  },
  {
    id: 'tip-14',
    tipNumber: 14,
    chapter: 1,
    title: 'Mẹo nhớ nhanh phân hạng Giấy phép lái xe',
    questionRange: 'Câu: 123 -> 135',
    rule: 'Đủ 16 tuổi: xe gắn máy | Hạng có số: lấy số + 1 | Hạng không số: chọn đáp án cuối.',
    detail: [
      'Đủ 16 tuổi => Xe gắn máy dưới 50cm³ (Câu: 123).',
      'Hạng có số (A1, C1, D1, D2): Lấy số đó cộng thêm 1 ra vị trí đáp án (Ví dụ: C1 => 1 + 1 = 2 -> chọn đáp án 2).',
      'Hạng không có số (A, B, C, D): Chọn đáp án cuối cùng (Câu: 126, 127, 129, 132).',
      'Hỏi hạng kèm chữ E (BE, CE, DE): Bỏ chữ E, chọn hạng tương ứng còn lại.',
      'Ngoại lệ: Câu 125 hỏi về A1 cấp trước 01/01/2025 => Chọn đáp án 1.'
    ]
  },
  {
    id: 'tip-15',
    tipNumber: 15,
    chapter: 1,
    title: 'Tốc độ trong khu vực đông dân cư',
    questionRange: 'Câu: 145 - 148',
    rule: 'Xe gắn máy: 40 km/h | Đường đôi: chọn đáp án 1 | Đường 2 chiều: có 28 chọn 2, không 28 chọn 1.',
    detail: [
      'Xe gắn máy, xe máy điện: Tối đa 40 km/h trên mọi loại đường.',
      'Đường đôi (có dải phân cách giữa): Tối đa 60 km/h => Luôn chọn đáp án 1.',
      'Đường 2 chiều (không có dải phân cách): Tối đa 50 km/h.',
      'Mẹo nhanh đường 2 chiều: Nếu đề bài có số "28" chọn đáp án 2; đề không có số "28" chọn đáp án 1.'
    ]
  },
  {
    id: 'tip-16',
    tipNumber: 16,
    chapter: 1,
    title: 'Tốc độ ngoài khu vực đông dân cư (Khẩu quyết 10 đôi - 9 chiều)',
    questionRange: 'Câu: 149 - 156',
    rule: 'Đường đôi số chủ đạo 10 | Đường hai chiều số chủ đạo 9.',
    detail: [
      'Cách làm: Lấy số chủ đạo trừ chữ số đầu tiên của vận tốc trên đề bài => Ra số thứ tự đáp án đúng.',
      'Ví dụ 1 (Đường đôi, 80 km/h): 10 - 8 = 2 => Chọn đáp án 2 (Câu: 149).',
      'Ví dụ 2 (Đường 2 chiều, 70 km/h): 9 - 7 = 2 => Chọn đáp án 2 (Câu: 154).',
      'Xe chở hàng 4 bánh có gắn động cơ => Chọn 50 km/h (Câu: 157).'
    ]
  },
  {
    id: 'tip-17',
    tipNumber: 17,
    chapter: 1,
    title: 'Khoảng cách an toàn tối thiểu trên đường cao tốc',
    questionRange: 'Câu: 158 - 162',
    rule: 'Lấy tốc độ tối đa trừ đi 30 => Chọn đáp án gần bằng hoặc bằng.',
    detail: [
      'Vận tốc 60 - 80 km/h: Lấy 80 - 30 = 50 => Chọn khoảng cách 55m.',
      'Vận tốc 80 - 100 km/h: Lấy 100 - 30 = 70 => Chọn khoảng cách 70m.',
      'Vận tốc 100 - 120 km/h: Lấy 120 - 20 = 100 => Chọn khoảng cách 100m.',
      'Dưới 60 km/h: Chủ động giữ khoảng cách phù hợp với xe chạy liền trước.'
    ]
  },

  // ==========================================
  // CHƯƠNG 2: NGHIỆP VỤ VẬN TẢI (Câu 167 - 192)
  // ==========================================
  {
    id: 'tip-201',
    tipNumber: 64,
    chapter: 2,
    title: 'Thời gian làm việc tối đa của người lái xe',
    questionRange: 'Câu: 171, 172',
    rule: 'Lái xe liên tục không quá 4 giờ | Tổng thời gian trong ngày không quá 10 giờ.',
    detail: [
      'Không được lái xe liên tục quá 4 giờ (bắt buộc phải dừng nghỉ ngơi).',
      'Tổng thời gian lái xe của 1 tài xế trong 1 ngày: Không được quá 10 giờ.',
      'Thời gian làm việc ban đêm được tính từ 22h00 đêm đến 06h00 sáng hôm sau.'
    ]
  },
  {
    id: 'tip-202',
    tipNumber: 65,
    chapter: 2,
    title: 'Quy định về hàng siêu trường, siêu trọng',
    questionRange: 'Câu: 179, 180',
    rule: 'Hàng siêu trường siêu trọng là hàng không thể tháo rời được.',
    detail: [
      'Hàng siêu trường là hàng không thể tháo rời, có kích thước vượt quá quy chuẩn đường bộ.',
      'Hàng siêu trọng là hàng không thể tháo rời, có trọng lượng vượt quá 32 tấn.',
      'Khi chở hàng siêu trường, siêu trọng phải có giấy phép lưu hành đặc biệt của cơ quan quản lý đường bộ.'
    ]
  },

  // ==========================================
  // CHƯƠNG 3: VĂN HÓA & ĐẠO ĐỨC (Câu 193 - 213)
  // ==========================================
  {
    id: 'tip-11',
    tipNumber: 11,
    chapter: 3,
    title: 'Câu hỏi về Văn hóa giao thông & Tai nạn giao thông',
    questionRange: 'Câu: 182 - 205',
    rule: 'Đề có từ "Văn hóa giao thông" hoặc "Tai nạn": Có CẢ chọn CẢ, không CẢ chọn câu dài nhất.',
    detail: [
      'Nếu trong các đáp án có "Cả ý 1 và ý 2" => Chọn ngay đáp án "Cả".',
      'Nếu không có đáp án "Cả" => Chọn đáp án nào có độ dài văn bản dài nhất.',
      'Ứng xử khi xảy ra TNGT: Bảo vệ tính mạng người bị nạn, bảo vệ hiện trường, báo cho cơ quan công an gần nhất.'
    ],
    note: 'Lưu ý: Ngoại trừ Câu 186 chọn đáp án 2 ("Giảm tốc độ chạy chậm qua vũng nước").'
  },

  // ==========================================
  // CHƯƠNG 4: KỸ THUẬT LÁI XE (Câu 214 - 269)
  // ==========================================
  {
    id: 'tip-18',
    tipNumber: 18,
    chapter: 4,
    title: 'Câu hỏi có cụm từ "Số tự động"',
    questionRange: 'Câu: 207, 237, 239, 252, 290',
    rule: 'Trong câu hỏi có cụm từ "số tự động" => Chọn ngay đáp án 1.',
    detail: [
      'Áp dụng cho các thao tác lái xe số tự động (khởi hành, dừng đỗ, điều khiển chân ga/phanh).',
      'Lái xe số tự động: Luôn dùng chân phải điều khiển cả bàn đạp ga và bàn đạp phanh; chân trái để trên sàn xe.'
    ]
  },
  {
    id: 'tip-19',
    tipNumber: 19,
    chapter: 4,
    title: 'Kỹ thuật lái xe và quy tắc an toàn',
    questionRange: 'Câu: 38 -> 260',
    isFatal: true,
    rule: 'Xuống dốc về số thấp (1, 2, L) | Đỗ xe sát lề 0.25m, cách xe khác 20m | Còi từ 5h đến 22h.',
    detail: [
      'Chấp hành: Hiệu lệnh người điều khiển giao thông (Câu: 38); Biển báo tạm thời (Câu: 39).',
      'Người lái xe => Không vượt quá tốc độ cho phép (Câu: 41); Giảm tốc độ khi xe sau xin vượt đủ an toàn (Câu: 45).',
      'Tốc độ thấp => Đi về bên phải (Câu: 43); Vượt xe => Vượt bên trái (Câu: 46).',
      'Báo hiệu còi: Chỉ được sử dụng từ 5:00 đến 22:00 (Câu: 49); ban đêm trong đô thị chỉ dùng đèn chiếu gần cốt (Câu: 51).',
      'Dừng/đỗ xe: Bánh xe sát lề đường không quá 0.25 mét (Câu: 60); đỗ cách xe khác ít nhất 20 mét (Câu: 61).',
      'Thứ tự xuống phà: Xe cơ giới, xe chuyên dùng -> Xe thô sơ -> Người đi bộ (Câu: 77).',
      'Nhường đường: Xe xuống dốc nhường xe lên dốc (Câu: 89); Đi đường không ưu tiên phải nhường xe trên đường ưu tiên (Câu: 91).',
      'Vòng xuyến: Có vòng xuyến nhường bên trái (Câu: 92); Không vòng xuyến nhường bên phải (Câu: 93).',
      'Phanh tay: Dùng lực tay phải bóp khóa hãm (Câu: 208); Khởi hành xe số sàn: Đạp ly hợp (côn) hết hành trình (Câu: 209).',
      'Quay đầu xe: Đưa đầu xe về phía nguy hiểm, đuôi xe về phía an toàn (Câu: 210); Tư thế ngồi: Ngồi thẳng lưng (Câu: 211).',
      'Gặp xe ngược chiều ban đêm: Chuyển đèn chiếu xa sang chiếu gần, không nhìn thẳng vào đèn đối diện (Câu: 225).',
      'Đường trơn trượt: Giữ đều ga, không đánh lái ngoặt, không phanh gấp (Câu: 226).',
      'Mở cửa xe: Quan sát gương, hé mở cửa, đảm bảo an toàn mới mở (Câu: 234, 256).',
      'Điều khiển tay ga xe máy: Tăng ga từ từ, giảm ga thật nhanh (Câu: 260).'
    ]
  },

  // ==========================================
  // CHƯƠNG 5: CẤU TẠO VÀ SỬA CHỮA (Câu 270 - 304)
  // ==========================================
  {
    id: 'tip-20',
    tipNumber: 20,
    chapter: 5,
    title: 'Cấu tạo và công dụng các bộ phận ô tô',
    questionRange: 'Câu: 266 -> 293',
    rule: 'Động cơ: nhiệt sang cơ | Hộp số: lùi & đổi tốc | Ly hợp: truyền/ngắt | Phanh: giảm tốc.',
    detail: [
      'Bộ phận giảm thanh: Bắt buộc phải có để giảm tiếng ồn (Câu: 266).',
      'Kính chắn gió: Bắt buộc là loại kính an toàn nhiều lớp (Câu: 268).',
      'Động cơ diesel không nổ: Nguyên nhân do nhiên liệu lẫn không khí hoặc tạp chất (Câu: 272).',
      'Dây đai an toàn: Có cơ cấu hãm tự động giữ chặt cơ thể khi có gia tốc giảm đột ngột (Câu: 274, 293).',
      'Động cơ 4 kỳ: Pít tông thực hiện 4 hành trình trong 1 chu trình làm việc (Câu: 275).',
      'Hệ thống bôi trơn: Cung cấp dầu nhờn để giảm ma sát, giảm mài mòn, làm mát chi tiết (Câu: 276).',
      'Niên hạn xe tải: Không quá 25 năm (Câu: 277); Niên hạn xe chở người trên 8 chỗ: Không quá 20 năm (Câu: 278); Xe con không có niên hạn.',
      'Công dụng động cơ: Biến nhiệt năng của nhiên liệu thành cơ năng quay trục khuỷu (Câu: 279).',
      'Hệ thống truyền lực: Truyền mô men quay từ động cơ tới các bánh xe chủ động (Câu: 280).',
      'Ly hợp (côn): Dùng để truyền hoặc ngắt truyền động từ động cơ sang hộp số (Câu: 281).',
      'Hộp số: Dùng để thay đổi mô men, thay đổi tốc độ và chiều chuyển động lùi (Câu: 282).',
      'Hệ thống lái: Dùng để thay đổi hoặc giữ nguyên hướng chuyển động của ô tô (Câu: 283).',
      'Hệ thống phanh: Dùng để giảm tốc độ, dừng hẳn xe hoặc giữ xe đứng yên trên dốc (Câu: 284).',
      'Ắc quy: Tích trữ điện năng khi máy phát hoạt động và cung cấp điện để khởi động xe (Câu: 291).',
      'Máy phát điện: Phát điện năng cung cấp cho phụ tải và nạp điện cho ắc quy (Câu: 292).'
    ]
  },

  // ==========================================
  // CHƯƠNG 6: BIỂN BÁO ĐƯỜNG BỘ (Câu 305 - 486)
  // ==========================================
  {
    id: 'tip-21',
    tipNumber: 21,
    chapter: 6,
    title: 'Quy tắc thứ bậc các loại xe trong biển báo cấm',
    questionRange: 'Câu: 302 -> 315',
    rule: 'Cấm nhỏ thì cấm lớn | Cấm lớn không cấm nhỏ.',
    detail: [
      'Thứ tự kích thước từ nhỏ đến lớn: Xe con < Xe khách < Xe tải < Máy kéo < Máy kéo kéo rơ-moóc / Container.',
      'Biển cấm xe nhỏ thì CẤM LUÔN xe lớn: Cấm ô tô con sẽ cấm luôn xe tải, xe khách và container.',
      'Biển cấm xe lớn thì KHÔNG CẤM xe nhỏ: Biển cấm xe tải thì xe con và mô tô 2 bánh vẫn đi bình thường.',
      'Xe 2 bánh và xe 4 bánh không cấm nhau: Biển cấm 2 bánh không cấm ô tô, biển cấm ô tô không cấm mô tô 2 bánh.'
    ],
    illustrations: [
      { url: '/questions/302.webp', caption: 'Câu 302: Thứ bậc cấm xe' }
    ]
  },
  {
    id: 'tip-22',
    tipNumber: 22,
    chapter: 6,
    title: 'Câu hỏi có từ "móc" hoặc "kéo" ở cuối câu',
    questionRange: 'Câu: 303, 340, 342, 343',
    rule: 'Cuối câu có từ "móc" chọn đáp án 1 & 2 | Có từ "kéo" chọn đáp án 2 & 3.',
    detail: [
      'Đọc phần cuối của câu hỏi: Nếu thấy có từ "móc" (hoặc "rơ moóc") => Chọn đáp án 1 và 2.',
      'Nếu thấy có từ "kéo" (kéo theo rơ moóc) => Chọn đáp án 2 và 3.'
    ],
    illustrations: [
      { url: '/questions/340.webp', caption: 'Câu 340: Có từ "móc" -> Chọn 1 & 2' },
      { url: '/questions/342.webp', caption: 'Câu 342: Có từ "kéo" -> Chọn 2 & 3' }
    ]
  },
  {
    id: 'tip-23',
    tipNumber: 23,
    chapter: 6,
    title: 'Biển cấm mô tô và cấm xe con đi chung',
    questionRange: 'Câu: 304, 307',
    rule: 'Thấy chữ "cấm" chọn đáp án 1 | Thấy chữ "được" chọn đáp án 3.',
    detail: [
      'Đọc đề bài: Nếu hỏi biển nào "cấm..." => Chọn đáp án 1.',
      'Nếu hỏi biển nào "được phép..." => Chọn đáp án 3 ("Cấm 1, được chọn 3").'
    ]
  },
  {
    id: 'tip-24',
    tipNumber: 24,
    chapter: 6,
    title: 'Câu hỏi cấm xe tải, xe xích lô',
    questionRange: 'Câu: 302, 310, 311, 332, 333',
    rule: 'Đề hỏi về cấm xe tải hoặc xe xích lô => Luôn chọn đáp án cuối cùng.',
    detail: [
      'Ví dụ: "Biển nào cấm xe tải?" hoặc "Gặp biển nào xe xích lô được phép đi vào?" => Chọn đáp án cuối.'
    ],
    illustrations: [
      { url: '/questions/302.webp', caption: 'Câu 302: Biển cấm xe tải' },
      { url: '/questions/332.webp', caption: 'Câu 332: Biển xe xích lô' }
    ]
  },
  {
    id: 'tip-25',
    tipNumber: 25,
    chapter: 6,
    title: 'Gặp 3 hình tròn đỏ cấm rẽ hướng, cấm quay đầu',
    questionRange: 'Câu: 317, 320',
    rule: 'Câu hỏi có chữ "và" chọn đáp án 2 | Không có chữ "và" chọn đáp án 1.',
    detail: [
      'Nhìn vào câu hỏi: "Biển nào cấm xe rẽ trái VÀ quay đầu?" (Có chữ "và") => Chọn đáp án 2.',
      'Nếu câu hỏi không có chữ "và" => Chọn đáp án 1.'
    ],
    illustrations: [
      { url: '/questions/317.webp', caption: 'Câu 317: Không có "và" -> Chọn 1' },
      { url: '/questions/320.webp', caption: 'Câu 320: Có chữ "và" -> Chọn 2' }
    ]
  },
  {
    id: 'tip-26',
    tipNumber: 26,
    chapter: 6,
    title: 'Gặp biển hình vuông xanh có 2 mũi tên móc câu',
    questionRange: 'Câu: 322, 323, 445',
    rule: 'Nếu không có chữ CẢ thì chọn đáp án 2 | Có chữ CẢ thì ưu tiên chọn CẢ.',
    detail: [
      'Áp dụng cho các biển chỉ dẫn khu vực được phép quay đầu xe, rẽ nhánh.',
      'Kiểm tra đáp án: Nếu thấy phương án "Cả 2 biển" => Chọn ngay; nếu không có thì chọn đáp án 2.'
    ]
  },
  {
    id: 'tip-27',
    tipNumber: 27,
    chapter: 6,
    title: 'Gặp biển tròn đỏ có dấu trừ gạch ngang',
    questionRange: 'Câu: 325, 326, 329',
    rule: 'Ưu tiên chọn đáp án có từ VÀ | Nếu không có từ VÀ chọn đáp án 2.',
    detail: [
      'Biển tròn đỏ có gạch ngang trắng ở giữa là biển P.102 "Cấm đi ngược chiều".',
      'Đọc các phương án: Có chữ "Biển 1 và..." => Chọn ngay; không có thì chọn đáp án 2.'
    ],
    illustrations: [
      { url: '/questions/325.webp', caption: 'Câu 325: Không có "VÀ" -> Chọn 2' },
      { url: '/questions/326.webp', caption: 'Câu 326: Có "VÀ" -> Chọn phương án có "VÀ"' }
    ]
  },
  {
    id: 'tip-28',
    tipNumber: 28,
    chapter: 6,
    title: 'Biển cấm đỗ xe ngày chẵn, ngày lẻ',
    questionRange: 'Câu: 327, 328',
    rule: 'Cuối câu hỏi ngày lẻ chọn đáp án 1 | Cuối câu hỏi ngày chẵn chọn đáp án 2.',
    detail: [
      'Biển có 1 vạch gạch trắng (I) là cấm đỗ ngày lẻ (1).',
      'Biển có 2 vạch gạch trắng (II) là cấm đỗ ngày chẵn (2).',
      'Mẹo nhanh: Đề hỏi "ngày lẻ" chọn 1; hỏi "ngày chẵn" chọn 2.'
    ],
    illustrations: [
      { url: '/questions/327.webp', caption: 'Câu 327: Ngày lẻ (1 vạch) -> Chọn 1' },
      { url: '/questions/328.webp', caption: 'Câu 328: Ngày chẵn (2 vạch) -> Chọn 2' }
    ]
  },
  {
    id: 'tip-29',
    tipNumber: 29,
    chapter: 6,
    title: 'Phân biệt biển tốc độ tối đa và tốc độ tối thiểu',
    questionRange: 'Câu: 360, 362, 364, 366',
    rule: 'Vòng tròn viền đỏ: Tốc độ tối đa | Vòng tròn nền xanh: Tốc độ tối thiểu.',
    detail: [
      'Biển P.127 (hình tròn viền đỏ, số màu đen trên nền trắng): Tốc độ tối đa cho phép.',
      'Biển R.306 (hình tròn nền xanh lam, số màu trắng): Tốc độ tối thiểu cho phép.'
    ],
    illustrations: [
      { url: '/questions/360.webp', caption: 'Biển viền đỏ 50: Tối đa' },
      { url: '/questions/362.webp', caption: 'Biển nền xanh 60: Tối thiểu' }
    ]
  },
  {
    id: 'tip-30',
    tipNumber: 30,
    chapter: 6,
    title: 'Gặp biển hình tròn tải trọng trục (7t, 10t)',
    questionRange: 'Câu: 336, 339',
    rule: 'Câu hỏi có 2 đáp án => Chọn đáp án 2 | Có 3 đáp án => Chọn đáp án 1.',
    detail: [
      'Đếm số lượng phương án trả lời trong câu hỏi có biển tròn ghi số tấn trục xe (7t):',
      'Nếu chỉ có 2 đáp án => Chọn đáp án số 2.',
      'Nếu có 3 đáp án => Chọn đáp án số 1.'
    ],
    illustrations: [
      { url: '/questions/336.webp', caption: 'Câu 336: 2 đáp án -> Chọn 2' },
      { url: '/questions/339.webp', caption: 'Câu 339: 3 đáp án -> Chọn 1' }
    ]
  },
  {
    id: 'tip-31',
    tipNumber: 31,
    chapter: 6,
    title: 'Phân biệt biển Chiều dài và Khoảng cách',
    questionRange: 'Câu: 347, 352, 353',
    rule: 'Có 2 mũi tên đứng bên cạnh số mét: Chiều dài | Không có mũi tên: Khoảng cách.',
    detail: [
      'Biển phụ có mũi tên đứng dọc hai bên (ví dụ ↑ 500m ↑) => Biểu thị chiều dài đoạn đường áp dụng hiệu lực biển.',
      'Biển phụ chỉ ghi số mét đơn thuần (ví dụ 200m) => Biểu thị khoảng cách từ nơi đặt biển đến vị trí áp dụng.'
    ],
    illustrations: [
      { url: '/questions/347.webp', caption: 'Có 2 mũi tên: Chiều dài' },
      { url: '/questions/352.webp', caption: 'Không có mũi tên: Khoảng cách' }
    ]
  },
  {
    id: 'tip-32',
    tipNumber: 32,
    chapter: 6,
    title: '3 hình tròn đỏ có biển phụ phương tiện phía dưới',
    questionRange: 'Câu: 349, 350, 351',
    rule: 'Câu hỏi có từ "hai bánh" chọn đáp án 2 | Không có từ "hai bánh" chọn đáp án 1.',
    detail: [
      'Đọc đề bài: Thấy xuất hiện từ "hai bánh" (mô tô 2 bánh) => Chọn đáp án 2.',
      'Nếu không thấy xuất hiện từ "hai bánh" => Chọn đáp án 1.'
    ],
    illustrations: [
      { url: '/questions/349.webp', caption: 'Câu 349: Biển cấm kèm biển phụ' }
    ]
  },
  {
    id: 'tip-33',
    tipNumber: 33,
    chapter: 6,
    title: 'Hình người trong 3 nhóm biển khác nhau',
    questionRange: 'Câu: 367, 368, 369',
    rule: 'Tam giác vàng: Nhường đường | Tròn đỏ: Cấm | Tròn xanh: Dành cho người đi bộ.',
    detail: [
      'Tam giác đều nền vàng viền đỏ (biển W.224): Nhường đường cho người đi bộ qua đường.',
      'Hình tròn nền trắng viền đỏ (biển P.112): Cấm người đi bộ.',
      'Hình tròn nền xanh (biển R.305): Đường dành riêng cho người đi bộ.'
    ],
    illustrations: [
      { url: '/questions/367.webp', caption: 'Tam giác vàng: Nhường đường' },
      { url: '/questions/368.webp', caption: 'Tròn đỏ: Cấm người đi bộ' },
      { url: '/questions/369.webp', caption: 'Tròn xanh: Dành cho người đi bộ' }
    ]
  },
  {
    id: 'tip-37',
    tipNumber: 37,
    chapter: 6,
    title: 'Phân biệt dốc lên và dốc xuống',
    questionRange: 'Câu: 415, 416',
    rule: 'Vẽ dốc chúc xuống chọn dốc xuống | Vẽ dốc chếch lên chọn dốc lên.',
    detail: [
      'Nhìn hình tam giác nguy hiểm có hình dốc đen kèm số %:',
      'Đọc từ trái qua phải: Nếu vệt đen đi xuống (10%) => Chọn đáp án dốc xuống.',
      'Nếu vệt đen đi lên (9%) => Chọn đáp án dốc lên.'
    ],
    illustrations: [
      { url: '/questions/415.webp', caption: '10% vẽ xuống: Dốc xuống nguy hiểm' },
      { url: '/questions/416.webp', caption: '9% vẽ lên: Dốc lên nguy hiểm' }
    ]
  },
  {
    id: 'tip-38',
    tipNumber: 38,
    chapter: 6,
    title: 'Biển báo nguy hiểm sạt lở, văng đá, lún sụt',
    questionRange: 'Câu: 421, 422, 423',
    rule: 'Xe bập bênh chọn "lún" | Đất đá từ núi rơi chọn "sạt lở" | Đá văng bánh xe chọn "rời rạc".',
    detail: [
      'Hình ô tô trên sóng nước dốc => Chọn đáp án có chữ "kết cấu yếu / lún".',
      'Hình vách núi có đất đá rơi xuống nóc xe => Chọn đáp án có chữ "sạt lở đất đá".',
      'Hình bánh xe hất đá sỏi văng ra sau => Chọn đáp án có chữ "đá sỏi rời rạc".'
    ]
  },
  {
    id: 'tip-39',
    tipNumber: 39,
    chapter: 6,
    title: 'Mẹo nhóm biển cấm vượt',
    questionRange: 'Câu: 308, 309, 310, 311, 312',
    rule: 'Hai chữ cuối: "Con vượt", "Phép vượt" chọn 2 | "Được vượt" chọn 3 | "Tải vượt" chọn cuối.',
    detail: [
      'Nhìn 2 chữ cuối cùng của câu hỏi:',
      'Kết thúc bằng "ô tô con vượt" hoặc "cho phép vượt" => Chọn đáp án 2.',
      'Kết thúc bằng "được vượt" => Chọn đáp án 3.',
      'Kết thúc bằng "xe tải vượt" => Chọn đáp án cuối cùng.'
    ]
  },
  {
    id: 'tip-48',
    tipNumber: 48,
    chapter: 6,
    title: 'Mũi tên ngoặt cong màu vàng đen',
    questionRange: 'Câu: 473, 474, 475',
    rule: 'Thấy hình mũi tên gập khúc phản quang vàng đen => Luôn chọn đáp án 2.',
    detail: [
      'Ý nghĩa: Báo hiệu vị trí đoạn đường cong cua nguy hiểm có nguy cơ lật xe.',
      'Nhớ nhanh các tình huống: Cửa chui, đường hầm, cầu hẹp, đường trơn, lề nguy hiểm, ùn tắc giao thông => Đều chọn đáp án 2.'
    ],
    illustrations: [
      { url: '/questions/473.webp', caption: 'Câu 473: Mũi tên ngoặt nguy hiểm -> Chọn 2' }
    ]
  },
  {
    id: 'tip-49',
    tipNumber: 49,
    chapter: 6,
    title: 'Phân loại vạch kẻ đường giao thông',
    questionRange: 'Câu: 477, 482',
    rule: 'Trắng phân làn cùng chiều | Vàng phân chia 2 chiều ngược nhau | Đứt được đè, liền cấm đè.',
    detail: [
      'Vạch màu TRẮNG: Phân chia các làn xe chạy cùng chiều.',
      'Vạch màu VÀNG: Phân chia 2 chiều xe chạy ngược chiều nhau (vạch tim đường).',
      'Vạch nét đứt: Được phép đè vạch chuyển làn; Vạch nét liền: Tuyệt đối cấm đè vạch.',
      'Mẹo đáp án: Vạch vàng ở giữa chọn 2; Ba vạch vàng chọn 1; Còn lại chọn đáp án cuối.'
    ],
    illustrations: [
      { url: '/questions/477.webp', caption: 'Câu 477: Vàng giữa chọn 2' },
      { url: '/questions/482.webp', caption: 'Câu 482: Ba vàng chọn 1' }
    ]
  },

  // ==========================================
  // CHƯƠNG 7: GIẢI CÁC THẾ SA HÌNH (Câu 487 - 600)
  // ==========================================
  {
    id: 'tip-50',
    tipNumber: 50,
    chapter: 7,
    title: '5 nguyên tắc vàng giải quyết mọi thế sa hình',
    questionRange: 'Câu: 487, 490, 491, 493...',
    rule: '1. Nhất lộ -> 2. Nhị ưu -> 3. Tam đường -> 4. Tứ hướng -> 5. Ngũ phải.',
    detail: [
      'Bước 1 - NHẤT LỘ (Vào giao lộ trước): Xe nào đã tiến qua vạch dừng hoặc vào trong ngã tư trước thì được đi đầu tiên, kể cả xe ưu tiên.',
      'Bước 2 - NHỊ ƯU (Xe ưu tiên): Hỏa > Sự > Công > Thương (1. Cứu hỏa > 2. Quân sự > 3. Công an > 4. Cứu thương).',
      'Bước 3 - TAM ĐƯỜNG (Đường ưu tiên): Xe nằm trên đường cắm biển "Đường ưu tiên" (hình quả trám vàng hoặc tam giác ngược) được đi trước.',
      'Bước 4 - TỨ HƯỚNG (Hướng ưu tiên): Rẽ phải đi trước -> Đi thẳng đi nhì -> Rẽ trái đi sau cùng.',
      'Bước 5 - NGŨ PHẢI (Quyền bên phải không vướng): Tại ngã tư cùng cấp, bên phải xe nào không có chướng ngại vật/không có xe thì xe đó được đi trước.'
    ],
    illustrations: [
      { url: '/questions/487.webp', caption: 'Câu 487: 5 nguyên tắc giải sa hình' }
    ]
  },
  {
    id: 'tip-51',
    tipNumber: 51,
    chapter: 7,
    title: 'Khi thấy xe Công an xuất hiện trong sa hình',
    questionRange: 'Câu: 488, 489, 498, 536, 540',
    rule: 'Xe công an nằm ở hướng nào chọn đáp án đó (Quy tắc 1 - 1 - 2 - 4).',
    detail: [
      'Quan sát vị trí xe Công an trên hình:',
      'Xe Công an đi thẳng hướng 1 => Chọn đáp án 1.',
      'Xe Công an rẽ hướng 2 => Chọn đáp án 2.',
      'Xe Công an rẽ hướng 4 => Chọn đáp án 4.'
    ],
    illustrations: [
      { url: '/questions/488.webp', caption: 'Câu 488: Công an ở ô nào chọn số đó' },
      { url: '/questions/489.webp', caption: 'Câu 489: Xe công an đi đầu tiên' }
    ]
  },
  {
    id: 'tip-52',
    tipNumber: 52,
    chapter: 7,
    title: 'Xe tải trong sa hình toàn biển cấm đỏ',
    questionRange: 'Câu: 522, 523, 524, 535, 537',
    rule: 'Xe tải đi thẳng theo hướng mũi tên nào thì chọn đáp án có hướng đó.',
    detail: [
      'Áp dụng cho các câu hỏi sa hình có biển tròn đỏ cấm rẽ kèm biển phụ xe tải.',
      'Xem xe tải được phép đi vào hướng nào => Chọn đáp án chỉ đích danh hướng đó.'
    ],
    illustrations: [
      { url: '/questions/522.webp', caption: 'Câu 522: Hướng xe tải đi thẳng' }
    ]
  },
  {
    id: 'tip-53',
    tipNumber: 53,
    chapter: 7,
    title: 'Câu hỏi xe nào phải nhường đường trong sa hình',
    questionRange: 'Câu: 491, 496, 497, 516, 576, 585, 586',
    rule: 'Ưu tiên chọn đáp án theo thứ tự: Xe khách -> Xe của bạn -> Xe con.',
    detail: [
      'Gặp câu hỏi hỏi "Xe nào phải nhường đường?":',
      'Bước 1: Tìm đáp án có chữ "Xe khách" => Chọn ngay.',
      'Bước 2: Nếu không có xe khách, tìm đáp án có cụm "Xe của bạn" => Chọn luôn.',
      'Bước 3: Nếu không có 2 xe trên => Chọn "Xe con".'
    ],
    illustrations: [
      { url: '/questions/491.webp', caption: 'Câu 491: Ưu tiên Xe khách > Xe bạn > Xe con' }
    ]
  },
  {
    id: 'tip-54',
    tipNumber: 54,
    chapter: 7,
    title: 'Sa hình có 6 đèn giao thông kèm mũi tên đỏ',
    questionRange: 'Câu: 486, 500, 503, 538, 553, 560, 561, 562, 565',
    rule: 'Có cụm từ "chỉ xe con" chọn ngay | Có mũi tên đỏ bỏ xe con | Không mũi tên tìm xe con.',
    detail: [
      'Thấy đáp án có cụm từ "chỉ xe con" => Chọn ngay không cần nhìn hình (Câu: 486).',
      'Nếu có mũi tên màu đỏ trên đèn tín hiệu => Loại bỏ đáp án có "xe con" (Câu: 503, 560, 561, 562).',
      'Nếu không có mũi tên đỏ => Tìm đáp án có chữ "xe con" để chọn (Câu: 500, 553).'
    ],
    illustrations: [
      { url: '/questions/503.webp', caption: 'Câu 503: Mũi tên đỏ -> Bỏ xe con' },
      { url: '/questions/500.webp', caption: 'Câu 500: Không mũi tên đỏ -> Tìm xe con' }
    ]
  },
  {
    id: 'tip-55',
    tipNumber: 55,
    chapter: 7,
    title: 'Câu hỏi xe nào được quyền "đi trước"',
    questionRange: 'Câu: 492, 495, 498, 501, 506, 517, 588',
    rule: 'Đề hỏi xe nào được quyền đi trước => Luôn chọn đáp án 2.',
    detail: [
      'Khoảng 90% câu hỏi sa hình hỏi xe nào được quyền đi trước đều rơi vào đáp án 2.'
    ],
    note: 'Lưu ý: Ngoại trừ 2 câu: Câu 525 và Câu 591 chọn đáp án 1.',
    illustrations: [
      { url: '/questions/525.webp', caption: 'Câu 525 (Ngoại lệ): Chọn đáp án 1' },
      { url: '/questions/591.webp', caption: 'Câu 591 (Ngoại lệ): Chọn đáp án 1' }
    ]
  },
  {
    id: 'tip-56',
    tipNumber: 56,
    chapter: 7,
    title: 'Mẹo câu hỏi xe vi phạm quy tắc giao thông (Đua xe)',
    questionRange: 'Câu: 543, 548, 554, 566',
    rule: 'Lấy số bánh của xe đi cuối cùng trừ đi 1 bánh ra số đáp án.',
    detail: [
      'Nhìn xe đi ở vị trí sau cùng trong đoàn xe:',
      'Nếu xe cuối là ô tô (4 bánh) => 4 - 1 = 3 -> Chọn đáp án 3 (Câu: 543, 548).',
      'Nếu xe cuối là mô tô (2 bánh) => 2 - 1 = 1 -> Chọn đáp án 1 (Câu: 566).',
      'Hỏi xe nào "chấp hành đúng" => Luôn chọn đáp án 2 (Câu: 554).'
    ],
    illustrations: [
      { url: '/questions/543.webp', caption: 'Câu 543: Lấy xe cuối trừ 1 bánh xe' },
      { url: '/questions/554.webp', caption: 'Câu 554: Chấp hành -> Chọn 2' }
    ]
  },
  {
    id: 'tip-57',
    tipNumber: 57,
    chapter: 7,
    title: 'Góc nhìn từ buồng lái thấy xe mô tô ở giao lộ',
    questionRange: 'Câu: 556, 567, 568, 583',
    rule: 'Mô tô ở cùng con đường chọn 2 | Mô tô ở khác con đường chọn 3.',
    detail: [
      'Góc nhìn từ trong xe của bạn nhìn ra qua kính lái:',
      'Nếu thấy xe mô tô đang ở cùng con đường với xe bạn => Chọn đáp án 2.',
      'Nếu xe mô tô đang ở nhánh đường khác đâm tới => Chọn đáp án 3.'
    ],
    illustrations: [
      { url: '/questions/556.webp', caption: 'Câu 556: Mô tô cùng con đường -> Chọn 2' },
      { url: '/questions/567.webp', caption: 'Câu 567: Mô tô khác con đường -> Chọn 3' }
    ]
  },
  {
    id: 'tip-58',
    tipNumber: 58,
    chapter: 7,
    title: 'Xe đạp hoặc mô tô ở ngã tư không biển báo',
    questionRange: 'Câu: 490, 520, 583, 593',
    rule: 'Đếm tổng số xe trong sa hình => Ra số thứ tự đáp án đúng.',
    detail: [
      'Tại ngã tư không cắm biển báo hiệu, có xe đạp hoặc mô tô:',
      'Đếm tổng số lượng phương tiện có mặt trong hình vẽ.',
      'Có 3 xe => Chọn đáp án 3; Có 4 xe => Chọn đáp án 4.'
    ]
  },
  {
    id: 'tip-59',
    tipNumber: 59,
    chapter: 7,
    title: 'Đáp án sa hình có nhiều chữ giải thích hành vi',
    questionRange: 'Câu: 544, 547, 552...',
    rule: 'Ưu tiên chọn các đáp án có từ: An toàn, Nhường đường, Giảm tốc độ.',
    detail: [
      'Thấy các đáp án mô tả phương án xử lý: "Nhường đường", "Giảm tốc độ đi sát bên phải", "Đảm bảo khoảng cách an toàn" => Luôn là đáp án đúng.'
    ]
  },
  {
    id: 'tip-60',
    tipNumber: 60,
    chapter: 7,
    title: 'Khi thấy 2 biển báo cùng cấp đi chung',
    questionRange: 'Câu: 533, 534',
    rule: 'Đáp án có từ "VÀ" thì chọn | Không có từ "VÀ" thì chọn đáp án 3.',
    detail: [
      'Khi 2 xe đều nằm ở tuyến đường cùng cấp (cùng có biển tam giác ngược hoặc cùng có biển ưu tiên):',
      'Đọc đáp án: Có phương án kết hợp "Xe ... VÀ xe ..." => Chọn ngay.',
      'Nếu không có đáp án gộp chữ "VÀ" => Chọn đáp án 3.'
    ],
    illustrations: [
      { url: '/questions/533.webp', caption: 'Câu 533: Đáp án có chữ "VÀ" -> Chọn' },
      { url: '/questions/534.webp', caption: 'Câu 534: Không có chữ "VÀ" -> Chọn 3' }
    ]
  },
  {
    id: 'tip-61',
    tipNumber: 61,
    chapter: 7,
    title: 'Dấu hiệu nhận biết nhanh qua đèn và màu xe',
    questionRange: 'Câu: 549, 552, 555, 572, 575, 581, 588, 589',
    rule: 'Thấy đèn hậu xe tải phía trước đỏ / Xe con vàng bên phải => Chọn đáp án 2.',
    detail: [
      'Thấy 2 bóng đèn sau của xe tải đi trước xe của bạn => Chọn đáp án 2 (Câu: 552, 555, 581).',
      'Thấy xe con màu vàng ở phía bên phải ngã tư => Chọn ngay đáp án 2 (Câu: 588, 589).',
      'Thấy xe tải bên trái và có ít nhất 1 biển báo trên đường => Chọn đáp án 2 (Câu: 549, 572, 575).'
    ],
    illustrations: [
      { url: '/questions/552.webp', caption: 'Câu 552: 2 bóng đèn sau xe tải -> Chọn 2' },
      { url: '/questions/588.webp', caption: 'Câu 588: Xe con vàng bên phải -> Chọn 2' }
    ]
  },
  {
    id: 'tip-62',
    tipNumber: 62,
    chapter: 7,
    title: 'Xe đạp xuất hiện trong tình huống sa hình',
    questionRange: 'Câu: 572, 574, 577, 583, 593',
    rule: 'Xe đạp đi cùng chiều chọn 2 | Xe đạp đi ngược chiều/khác hướng chọn 3.',
    detail: [
      'Gặp câu hỏi sa hình có xe đạp di chuyển:',
      'Nếu xe đạp đang đi cùng chiều với xe của bạn => Chọn đáp án 2.',
      'Nếu xe đạp đi ngược chiều hoặc rẽ từ hướng khác => Chọn đáp án 3.'
    ],
    illustrations: [
      { url: '/questions/572.webp', caption: 'Câu 572: Xe đạp cùng chiều -> Chọn 2' },
      { url: '/questions/574.webp', caption: 'Câu 574: Xe đạp ngược chiều -> Chọn 3' }
    ]
  },
  {
    id: 'tip-63',
    tipNumber: 63,
    chapter: 7,
    title: 'Tình huống xe kéo xe trong sa hình',
    questionRange: 'Câu: 510, 515, 518',
    isFatal: true,
    rule: 'Thấy ô tô kéo theo xe khác không đúng quy định => Luôn là VI PHẠM (Không đúng).',
    detail: [
      'Luật quy định xe ô tô chỉ được kéo theo 1 xe ô tô hoặc xe máy chuyên dùng khi xe này không tự chạy được và phải có thanh nối cứng.',
      'Thấy hình vẽ xe kéo xe bằng dây lụa, hoặc xe kéo thêm rơ moóc mà còn kéo xe khác => Luôn chọn đáp án "Vi phạm" hoặc "Không đúng quy tắc giao thông".'
    ],
    illustrations: [
      { url: '/questions/510.webp', caption: 'Câu 510: Xe kéo xe vi phạm' },
      { url: '/questions/515.webp', caption: 'Câu 515: Xe kéo rơ moóc vi phạm' }
    ]
  },

  // ==========================================
  // CHƯƠNG 8: 120 TÌNH HUỐNG MÔ PHỎNG
  // ==========================================
  {
    id: 'tip-70',
    tipNumber: 70,
    chapter: 8,
    title: 'Điểm căn phím Space: Đèn phanh đỏ sáng',
    questionRange: 'Tình huống: 1, 3, 5, 7, 12, 15, 28, 30, 33...',
    rule: 'Hai cụm đèn hậu của xe đi liền trước vừa lóe sáng đỏ => Bấm Space ngay.',
    detail: [
      'Đây là dạng tình huống phổ biến nhất (chiếm hơn 40% trong 120 tình huống mô phỏng).',
      'Tập trung mắt vào cụm đèn sau xe phía trước: Khoảnh khắc vừa chuyển sang màu đỏ rực rỡ => Nhấn phím Space tức khắc để lấy trọn 5 điểm.'
    ]
  },
  {
    id: 'tip-71',
    tipNumber: 71,
    chapter: 8,
    title: 'Điểm căn phím Space: Xe lấn làn vượt ẩu',
    questionRange: 'Tình huống: 2, 4, 6, 8, 10, 14, 18, 22...',
    rule: 'Bánh xe trước hoặc đầu xe ngược chiều vừa chạm đè vạch tim đường => Bấm Space.',
    detail: [
      'Khi xe đi ngược chiều bắt đầu lách ra để vượt xe khác:',
      'Canh đúng lúc bánh xe trước bên trái vừa chạm vào vạch sơn kẻ tim đường phân chia 2 chiều => Bấm Space.'
    ]
  },
  {
    id: 'tip-72',
    tipNumber: 72,
    chapter: 8,
    title: 'Điểm căn phím Space: Người đi bộ qua đường',
    questionRange: 'Tình huống: 9, 11, 13, 17, 20, 24...',
    rule: 'Chân người đi bộ vừa chạm xuống lòng đường => Bấm Space.',
    detail: [
      'Người đi bộ từ vỉa hè bước xuống hoặc bước ra từ sau xe buýt/xe tải đỗ ven đường:',
      'Khoảnh khắc chân người vừa chạm mặt đường nhựa => Bấm phím Space.'
    ]
  },
  {
    id: 'tip-73',
    tipNumber: 73,
    chapter: 8,
    title: 'Điểm căn phím Space: Xe chuyển làn trên cao tốc',
    questionRange: 'Tình huống: 34, 38, 40, 42, 50, 55...',
    rule: 'Đèn xi nhan nhấp nháy đến lần thứ 2 => Bấm Space.',
    detail: [
      'Khi xe phía trước bật xi nhan xin vượt hoặc chuyển làn:',
      'Không bấm ở lần chớp đầu tiên (dễ bị 0 điểm vì chưa vào vùng tính điểm).',
      'Chờ đèn xi nhan sáng rõ ở lần chớp thứ 2 và đầu xe hơi lệch làn => Bấm Space lấy trọn 5 điểm.'
    ]
  }
];
