export interface RoadTestStep {
  id: number;
  title: string;
  badge: string;
  flow: string;
  instructions: string[];
  tips: string[];
  deductions: string[];
}

export interface RoadDeductionItem {
  id: string;
  title: string;
  points: number | 'fail';
  category: 'minor' | 'fail';
  description: string;
  solution: string;
}

export interface GoldenTipItem {
  id: string;
  title: string;
  formula: string;
  content: string[];
}

export const ROAD_TEST_STEPS: RoadTestStep[] = [
  {
    id: 1,
    title: 'Bài 1: Xuất phát',
    badge: 'Xi-nhan Trái',
    flow: 'Chỉnh ghế/gương -> Thắt dây an toàn -> Hạ phanh tay -> Xi-nhan Trái -> Vào số 1',
    instructions: [
      'Nghe loa "Bắt đầu": Nhả chân côn từ từ cho xe lăn bánh.',
      'Trong 15m đầu: Đạp ga lên số 2, tiếp tục đạp ga lên số 3 trước biển 15m (với xe số sàn).',
      'Tắt xi-nhan trái: Xe qua vạch xuất phát khoảng 5m (nghe tiếng "tính toong") là gạt tắt ngay.'
    ],
    tips: [
      'Quá 30 giây không qua vạch xuất phát -> Truất quyền thi (TRƯỢT).',
      'Tắt xi-nhan quá sớm hoặc quên tắt đều bị trừ 5 điểm.'
    ],
    deductions: [
      'Không thắt dây an toàn (-5đ)',
      'Không hạ hết phanh tay (-5đ)',
      'Không bật hoặc quên tắt xi-nhan (-5đ)',
      '15m đầu không lên được số 3 (-5đ)',
      'Khởi hành xe bị rung giật hoặc chết máy (-5đ)'
    ]
  },
  {
    id: 2,
    title: 'Bài 2: Tăng số, tăng tốc độ',
    badge: 'Tăng số & Tốc độ',
    flow: 'Đệm ga lấy đà -> Đạp kịch côn -> Đẩy lên số cao hơn -> Nhả côn đệm ga',
    instructions: [
      'Nghe loa đọc "Tăng số tăng tốc độ": Bạn có cự ly 100m để hoàn thành thao tác.',
      'Nhấn đều chân ga cho xe có trớn -> đạp hết côn -> vào số cao hơn (số 2 lên 3, hoặc 3 lên 4).',
      'Nhả chân côn êm ái và tiếp tục đệm nhẹ chân ga giữ tốc độ ổn định.'
    ],
    tips: [
      'Có tới 100 mét để làm, thao tác dứt khoát nhưng không vội vàng làm giật xe.',
      'Động cơ không được gầm rú vượt quá 4.000 vòng/phút.'
    ],
    deductions: [
      'Không tăng được số theo hiệu lệnh (-5đ)',
      'Vòng tua động cơ quá 4.000 RPM (-5đ)',
      'Xe chết máy khi tăng số (-5đ)'
    ]
  },
  {
    id: 3,
    title: 'Bài 3: Giảm số, giảm tốc độ',
    badge: 'Giảm số & Tốc độ',
    flow: 'Rà nhẹ phanh hãm tốc -> Đạp kịch côn -> Về số thấp hơn -> Nhả côn từ từ',
    instructions: [
      'Nghe loa đọc "Giảm số giảm tốc độ": Bắt đầu rà nhẹ chân phanh cho xe chậm lại.',
      'Khi xe đã chậm: Đạp kịch chân côn -> gạt cần số về số thấp (số 4 về 3, hoặc 3 về 2).',
      'Từ từ nhả chân côn, quan sát phía trước và giữ xe đi đúng làn.'
    ],
    tips: [
      'Nguyên tắc: Phanh trước -> Côn sau -> Về số. Không đạp côn trước khi phanh.',
      'Thấy xe có hiện tượng rung giật: Đạp kịch côn xuống sàn ngay để tránh chết máy.'
    ],
    deductions: [
      'Không giảm được số theo hiệu lệnh (-5đ)',
      'Về số khi tốc độ còn quá cao làm xe khựng giật (-5đ)',
      'Xe chết máy do nhả côn quá nhanh (-5đ)'
    ]
  },
  {
    id: 4,
    title: 'Bài 4: Kết thúc bài thi',
    badge: 'Xi-nhan Phải',
    flow: 'Bật xi-nhan Phải -> Rà phanh tấp lề -> Về số 0 (Mo/P) -> Kéo phanh tay',
    instructions: [
      'Nghe loa đọc "Kết thúc": Bật ngay xi-nhan PHẢI và giữ nguyên xi-nhan.',
      'Quan sát gương phải, rà phanh tấp xe sát mép lề đường (cách mép lề dưới 25cm).',
      'Khi xe dừng hẳn: Giữ phanh + côn -> Về số 0 (Mo) hoặc P -> Kéo phanh tay.',
      'Ngồi yên giữ nguyên dây an toàn. Đợi loa đọc "Chúc mừng bạn đã thi ĐẠT" mới được tháo dây và mở cửa.'
    ],
    tips: [
      'Tuyệt đối KHÔNG tháo dây an toàn và KHÔNG tắt máy trước khi loa thông báo kết quả.',
      'Không được để bánh xe chèn lên vỉa hè khi dừng.'
    ],
    deductions: [
      'Không bật xi-nhan phải khi kết thúc (-5đ)',
      'Xe dừng hẳn không về số 0 / số P (-5đ)',
      'Không kéo phanh tay sau khi dừng (-5đ)',
      'Tháo dây an toàn trước khi loa báo ĐẠT (-5đ)'
    ]
  }
];

export const ROAD_DEDUCTIONS: RoadDeductionItem[] = [
  {
    id: 'd1',
    title: 'Không thắt dây an toàn khi xuất phát',
    points: 5,
    category: 'minor',
    description: 'Xe lăn bánh mà chưa cài chốt an toàn.',
    solution: 'Lên xe chỉnh ghế xong là thắt dây an toàn đầu tiên.'
  },
  {
    id: 'd2',
    title: 'Không hạ hết phanh tay trước khi chạy',
    points: 5,
    category: 'minor',
    description: 'Chưa hạ phanh tay hoặc hạ chưa hết hành trình.',
    solution: 'Nhìn đồng hồ táp-lô xem đèn (!) đỏ đã tắt hẳn chưa.'
  },
  {
    id: 'd3',
    title: 'Quên bật hoặc quên tắt xi-nhan Trái',
    points: 5,
    category: 'minor',
    description: 'Không bật khi xuất phát hoặc đi quá 5m mà không tắt.',
    solution: 'Bật trước khi chạy, qua vạch xuất phát 3-4 giây thì tắt ngay.'
  },
  {
    id: 'd4',
    title: 'Trong 15m đầu không lên được số 3',
    points: 5,
    category: 'minor',
    description: 'Không kịp tăng từ số 1 lên số 3 trong cự ly 15m (xe số sàn).',
    solution: 'Nhả côn số 1 lăn bánh -> mớm ga vào số 2 -> mớm ga vào số 3.'
  },
  {
    id: 'd5',
    title: 'Xe bị chết máy giữa đường',
    points: 5,
    category: 'minor',
    description: 'Mỗi lần xe chết máy trên đường thi bị trừ 5 điểm.',
    solution: 'Thấy xe rung bần bật: Đạp kịch chân côn xuống sàn ngay.'
  },
  {
    id: 'd6',
    title: 'Vòng tua động cơ vượt quá 4.000 RPM',
    points: 5,
    category: 'minor',
    description: 'Đạp ga quá mạnh ở số thấp làm máy gầm rú.',
    solution: 'Đệm ga nhẹ nhàng, đủ tốc độ là chủ động sang số.'
  },
  {
    id: 'd7',
    title: 'Quên bật xi-nhan Phải khi kết thúc',
    points: 5,
    category: 'minor',
    description: 'Nghe lệnh kết thúc nhưng tấp lề mà không bật xi-nhan phải.',
    solution: 'Nghe lệnh kết thúc là gạt xi-nhan phải ngay lập tức.'
  },
  {
    id: 'd8',
    title: 'Không về số 0 hoặc không kéo phanh tay',
    points: 5,
    category: 'minor',
    description: 'Xe dừng hẳn ở điểm kết thúc nhưng để nguyên số hoặc quên phanh tay.',
    solution: 'Thao tác dừng: Dừng hẳn -> Về số 0 (Mo/P) -> Kéo phanh tay.'
  },

  // Lỗi truất quyền thi (FAIL)
  {
    id: 'f1',
    title: 'Quá 30 giây không xuất phát được',
    points: 'fail',
    category: 'fail',
    description: 'Từ lúc có lệnh xuất phát, xe không qua vạch trong 30s.',
    solution: 'Bình tĩnh nhả côn từ từ, tránh luống cuống để chết máy.'
  },
  {
    id: 'f2',
    title: 'Chạy quá tốc độ tối đa cho phép',
    points: 'fail',
    category: 'fail',
    description: 'Chạy vượt quá tốc độ biển báo trên tuyến đường thi.',
    solution: 'Giữ tốc độ ổn định 25 - 35 km/h, không phóng nhanh.'
  },
  {
    id: 'f3',
    title: 'Vi phạm quy tắc giao thông nghiêm trọng',
    points: 'fail',
    category: 'fail',
    description: 'Vượt đèn đỏ, đi ngược chiều, đè vạch liền cấm vượt.',
    solution: 'Nhìn xa, tuân thủ tuyệt đối đèn giao thông và vạch kẻ đường.'
  },
  {
    id: 'f4',
    title: 'Giám khảo phải can thiệp phanh phụ hoặc tay lái',
    points: 'fail',
    category: 'fail',
    description: 'Tình huống nguy hiểm buộc giám khảo phải can thiệp.',
    solution: 'Giữ khoảng cách 15-20m với xe trước, nhường đường người đi bộ.'
  },
  {
    id: 'f5',
    title: 'Gây tai nạn giao thông',
    points: 'fail',
    category: 'fail',
    description: 'Va chạm với phương tiện khác hoặc công trình đường.',
    solution: 'Tập trung quan sát gương chiếu hậu trước khi chuyển hướng.'
  },
  {
    id: 'f6',
    title: 'Tổng điểm dưới 80 điểm',
    points: 'fail',
    category: 'fail',
    description: 'Bị trừ dồn các lỗi nhỏ khiến tổng điểm dưới 80/100.',
    solution: 'Cẩn thận với từng lỗi xi-nhan và phanh tay để không mất điểm oan.'
  }
];

export const GOLDEN_TIPS: GoldenTipItem[] = [
  {
    id: 'tip1',
    title: 'Khẩu quyết: "Trái đi - Phải đỗ"',
    formula: 'Bắt đầu xi-nhan TRÁI, Kết thúc xi-nhan PHẢI',
    content: [
      'Bắt đầu thi: Bật xi-nhan TRÁI, qua vạch 5m tắt ngay.',
      'Kết thúc thi: Bật xi-nhan PHẢI, dừng xe kéo phanh tay xong mới tắt.'
    ]
  },
  {
    id: 'tip2',
    title: 'Chống chết máy khẩn cấp',
    formula: 'Thấy xe rung bần bật -> Đạp kịch chân côn xuống sàn',
    content: [
      'Khi xe đi chậm hoặc sắp dừng, ĐẠP HẾT CÔN ngay lập tức.',
      'Về lại số 2 hoặc số 1 rồi mới từ từ nhả côn thêm ga để đi tiếp.'
    ]
  },
  {
    id: 'tip3',
    title: 'Nhịp nhả côn: "2 nhanh - 1 chậm"',
    formula: '1/2 đầu nhả nhanh -> Dừng 1s ở điểm bám -> Nhả hết đệm ga',
    content: [
      '1/2 hành trình đầu nhả nhanh (hành trình tự do).',
      'Dừng chân nhẹ 1 giây khi côn bắt đầu bám đà.',
      'Nhả hết hoàn toàn chân côn đồng thời mớm nhẹ chân ga.'
    ]
  },
  {
    id: 'tip4',
    title: 'Dải tốc độ an toàn: 25 - 35 km/h',
    formula: 'Không quá chậm (< 20 km/h), Không quá nhanh (> 40 km/h)',
    content: [
      'Chạy quá chậm xe dễ bị giật cục và khó tăng số.',
      'Chạy quá nhanh dễ mất kiểm soát khi chip phát lệnh bất ngờ.',
      'Giữ khoảng cách an toàn 15 - 20m với xe phía trước.'
    ]
  },
  {
    id: 'tip5',
    title: 'Bình tĩnh nghe loa chip',
    formula: 'Có 100m để tăng/giảm số, tuyệt đối không hoảng hốt',
    content: [
      'Loa chip đọc lệnh rất rõ ràng, nghe hết câu lệnh rồi mới thao tác.',
      'Sang số dứt khoát nhưng không giật mạnh cần số làm hóc số.',
      'Chào hỏi giám khảo lịch sự, coi giám khảo như người đồng hành.'
    ]
  }
];
