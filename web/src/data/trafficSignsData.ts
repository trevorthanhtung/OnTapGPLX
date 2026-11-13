export interface TrafficSignItem {
  id: string;
  code: string;
  name: string;
  category: 'prohibitory' | 'mandatory' | 'warning' | 'dashboard';
  image: string;
  badge?: string;
  tip?: string;
  meaning?: string;
}

// ==========================================
// BẢNG 1: BIỂN BÁO CẤM (Theo đúng bìa trong sách mẹo)
// ==========================================
export const PROHIBITORY_SIGNS: TrafficSignItem[] = [
  {
    id: 'p127_50',
    code: 'P.127 (50)',
    name: 'Tốc độ tối đa cho phép',
    category: 'prohibitory',
    image: '/signs/p127_50.svg',
    tip: 'Biển tròn viền đỏ: Tốc độ TỐI ĐA (khác biển xanh 60: Tối thiểu)',
    meaning: 'Cấm các loại xe cơ giới chạy với tốc độ tối đa vượt quá 50 km/h.'
  },
  {
    id: 'p101',
    code: 'P.101',
    name: 'Đường cấm',
    category: 'prohibitory',
    image: '/signs/p101.svg',
    badge: 'Đường cấm',
    tip: 'Vòng tròn đỏ tâm trắng trơn: Cấm mọi phương tiện trừ xe ưu tiên',
    meaning: 'Đường cấm tất cả các loại phương tiện (cơ giới và thô sơ) đi lại cả hai hướng, trừ các xe được ưu tiên theo quy định.'
  },
  {
    id: 'p102',
    code: 'P.102',
    name: 'Cấm đi ngược chiều',
    category: 'prohibitory',
    image: '/signs/p102.svg',
    badge: 'Ngược chiều',
    tip: 'Vòng tròn đỏ có gạch ngang trắng: Cấm đi vào theo chiều đặt biển',
    meaning: 'Đường cấm tất cả các loại xe (cơ giới và thô sơ) đi vào theo chiều đặt biển, trừ các xe được ưu tiên theo quy định.'
  },
  {
    id: 'p103a',
    code: 'P.103a',
    name: 'Cấm xe ô tô',
    category: 'prohibitory',
    image: '/signs/p103a.svg',
    badge: 'Cấm ô tô',
    tip: 'Cấm ô tô con: CẤM TẤT CẢ các loại xe cơ giới 4 bánh (kể cả tải, khách, kéo)',
    meaning: 'Cấm tất cả các loại xe cơ giới kể cả mô tô 3 bánh có thùng đi qua, trừ mô tô hai bánh, xe gắn máy và các xe được ưu tiên.'
  },
  {
    id: 'p103b',
    code: 'P.103b',
    name: 'Cấm ô tô rẽ phải',
    category: 'prohibitory',
    image: '/signs/p103b.svg',
    badge: 'Cấm rẽ phải',
    tip: 'Chỉ cấm xe ô tô rẽ phải (vẫn được rẽ trái hoặc đi thẳng)',
    meaning: 'Cấm các loại xe cơ giới kể cả mô tô 3 bánh có thùng rẽ phải, trừ mô tô hai bánh, xe gắn máy và các xe được ưu tiên.'
  },
  {
    id: 'p104',
    code: 'P.104',
    name: 'Cấm xe mô tô',
    category: 'prohibitory',
    image: '/signs/p104.svg',
    badge: 'Cấm mô tô',
    tip: 'Cấm mô tô 2 bánh & 3 bánh, KHÔNG CẤM xe gắn máy & xe đạp',
    meaning: 'Cấm tất cả các loại xe mô tô đi qua, trừ các xe mô tô được ưu tiên theo quy định. Không có giá trị đối với xe gắn máy.'
  },
  {
    id: 'p105',
    code: 'P.105',
    name: 'Cấm ô tô và mô tô',
    category: 'prohibitory',
    image: '/signs/p105.svg',
    badge: 'Cấm cả hai',
    tip: 'Vẽ cả ô tô và mô tô: Cấm cả ô tô và mô tô đi vào (trừ xe gắn máy)',
    meaning: 'Cấm tất cả các loại xe cơ giới và mô tô đi qua trừ xe gắn máy và các xe được ưu tiên theo quy định.'
  },
  {
    id: 'p106a',
    code: 'P.106a',
    name: 'Cấm ô tô tải',
    category: 'prohibitory',
    image: '/signs/p106a.svg',
    badge: 'Cấm xe tải',
    tip: 'Cấm xe tải: Cấm cả máy kéo và rơ-moóc; KHÔNG CẤM ô tô con',
    meaning: 'Cấm tất cả các loại ô tô tải có khối lượng chuyên chở lớn hơn 1,5 tấn (theo QCVN 41:2019) trừ các xe ưu tiên.'
  },
  {
    id: 'p106b',
    code: 'P.106b',
    name: 'Cấm ô tô tải có khối lượng chuyên chở > 2,5t',
    category: 'prohibitory',
    image: '/signs/p106b.svg',
    badge: 'Tải > 2,5 tấn',
    tip: 'Biển có ghi trị số tấn (2,5t): Chỉ cấm xe tải có khối lượng chuyên chở vượt quá trị số ghi trên biển',
    meaning: 'Cấm tất cả các loại xe ô tô tải có khối lượng chuyên chở lớn hơn giá trị chữ số ghi trên biển (2,5 tấn).'
  },
  {
    id: 'p106c',
    code: 'P.106c',
    name: 'Cấm xe chở hàng nguy hiểm',
    category: 'prohibitory',
    image: '/signs/p106c.svg',
    badge: 'Hàng nguy hiểm',
    tip: 'Thùng xe màu cam có ngọn lửa: Cấm xe chở chất cháy nổ, độc hại',
    meaning: 'Cấm các xe chở hàng nguy hiểm (chất dễ cháy, nổ, độc hại) đi qua tuyến đường.'
  },
  {
    id: 'p107',
    code: 'P.107',
    name: 'Cấm ô tô khách & ô tô tải',
    category: 'prohibitory',
    image: '/signs/p107.svg',
    badge: 'Cấm xe khách',
    tip: 'Cấm ô tô khách và ô tô tải, KHÔNG CẤM xe buýt',
    meaning: 'Cấm xe ô tô chở khách và các loại xe tải từ 1,5 tấn trở lên đi qua trừ các xe ưu tiên và xe buýt.'
  },
  {
    id: 'p108',
    code: 'P.108',
    name: 'Cấm ô tô kéo rơ-moóc',
    category: 'prohibitory',
    image: '/signs/p108.svg',
    badge: 'Kéo rơ-moóc',
    tip: 'Cấm ô tô kéo theo rơ-moóc hoặc sơ-mi rơ-moóc',
    meaning: 'Cấm tất cả các loại xe cơ giới kéo theo rơ-moóc kể cả mô tô, máy kéo, ô tô khách kéo theo rơ-moóc đi qua.'
  },
  {
    id: 'p109',
    code: 'P.109',
    name: 'Cấm máy kéo',
    category: 'prohibitory',
    image: '/signs/p109.svg',
    badge: 'Cấm máy kéo',
    tip: 'Cấm máy kéo: Cấm cả máy kéo bánh hơi và máy kéo bánh xích',
    meaning: 'Cấm tất cả các loại máy kéo, kể cả máy kéo bánh hơi và bánh xích đi qua.'
  },
  {
    id: 'p110a',
    code: 'P.110a',
    name: 'Cấm xe đạp',
    category: 'prohibitory',
    image: '/signs/p110a.svg',
    badge: 'Cấm xe đạp',
    tip: 'Cấm xe đạp đi qua, không cấm người dắt xe đạp',
    meaning: 'Cấm tất cả các loại xe đạp đi qua. Biển không có giá trị cấm đối với người dắt xe đạp.'
  },
  {
    id: 'p111a',
    code: 'P.111a',
    name: 'Cấm xe ba bánh có động cơ',
    category: 'prohibitory',
    image: '/signs/p111a.svg',
    badge: 'Xe lam, ba gác',
    tip: 'Cấm xe lam, xe xích lô máy, xe lôi máy',
    meaning: 'Cấm tất cả các loại xe ba bánh có động cơ như xe lam, xích lô máy, xe lôi máy v.v...'
  },
  {
    id: 'p111c',
    code: 'P.111c',
    name: 'Cấm xe xích lô',
    category: 'prohibitory',
    image: '/signs/p111c.svg',
    badge: 'Cấm xích lô',
    tip: 'Chỉ cấm xe xích lô thô sơ, không cấm xích lô máy',
    meaning: 'Cấm tất cả các loại xe xích lô đi qua.'
  },
  {
    id: 'p111d',
    code: 'P.111d',
    name: 'Cấm xe xích lô máy',
    category: 'prohibitory',
    image: '/signs/p111d.svg',
    badge: 'Xích lô máy',
    tip: 'Cấm xe xích lô có gắn động cơ máy',
    meaning: 'Cấm tất cả các loại xe xích lô máy đi qua.'
  },
  {
    id: 'p113',
    code: 'P.113',
    name: 'Cấm xe súc vật kéo',
    category: 'prohibitory',
    image: '/signs/p113.svg',
    badge: 'Súc vật kéo',
    tip: 'Cấm xe do súc vật (ngựa, trâu, bò) kéo đi qua',
    meaning: 'Cấm tất cả các loại xe do súc vật kéo hoặc súc vật chở hàng cưỡi đi qua.'
  },
  {
    id: 'p115',
    code: 'P.115',
    name: 'Hạn chế trọng lượng xe',
    category: 'prohibitory',
    image: '/signs/p115.svg',
    badge: 'Tải trọng toàn bộ',
    tip: 'Cấm xe có cả tải và xe vượt quá trị số ghi trên biển',
    meaning: 'Cấm tất cả các loại xe cơ giới và thô sơ, kể cả các xe được ưu tiên có trọng lượng toàn bộ vượt quá trị số ghi trên biển.'
  },
  {
    id: 'p116',
    code: 'P.116',
    name: 'Hạn chế tải trọng trên trục xe (7t)',
    category: 'prohibitory',
    image: '/signs/p116.svg',
    badge: 'Trục xe 7t',
    tip: 'Cấm xe có tải trọng phân bổ trên một trục bánh vượt quá 7 tấn',
    meaning: 'Cấm tất cả các loại xe cơ giới và thô sơ có trọng lượng toàn bộ phân bổ trên một trục bánh xe bất kỳ vượt quá trị số ghi trên biển (7 tấn).'
  },
  {
    id: 'p117',
    code: 'P.117',
    name: 'Hạn chế chiều cao (3,5m)',
    category: 'prohibitory',
    image: '/signs/p117.svg',
    badge: 'Chiều cao 3.5m',
    tip: '2 mũi tên tam giác trên dưới: Hạn chế CHIỀU CAO (kể cả hàng hóa)',
    meaning: 'Cấm các xe cơ giới và thô sơ có chiều cao tính từ mặt đường đến điểm cao nhất của xe hoặc hàng hóa vượt quá trị số ghi trên biển.'
  },
  {
    id: 'p118',
    code: 'P.118',
    name: 'Hạn chế chiều ngang (3,2m)',
    category: 'prohibitory',
    image: '/signs/p118.svg',
    badge: 'Chiều ngang 3.2m',
    tip: '2 mũi tên tam giác 2 bên mép: Hạn chế CHIỀU RỘNG/NGANG của xe',
    meaning: 'Cấm các xe cơ giới và thô sơ có chiều ngang kể cả xe và hàng hóa vượt quá trị số ghi trên biển.'
  },
  {
    id: 'p119',
    code: 'P.119',
    name: 'Hạn chế chiều dài ô tô (9m)',
    category: 'prohibitory',
    image: '/signs/p119.svg',
    badge: 'Chiều dài 9m',
    tip: 'Vẽ xe ô tô có mũi tên 2 đầu: Hạn chế chiều dài toàn bộ thân xe (9m)',
    meaning: 'Cấm các loại xe (cơ giới và thô sơ) có chiều dài toàn bộ kể cả xe và hàng hóa lớn hơn trị số ghi trên biển (9 mét) đi qua.'
  },
  {
    id: 'p122',
    code: 'P.122',
    name: 'Dừng lại (STOP)',
    category: 'prohibitory',
    image: '/signs/p122.svg',
    badge: 'Dừng lại tuyệt đối',
    tip: 'Hình bát giác đỏ chữ STOP: KỂ CẢ XE ƯU TIÊN cũng phải dừng lại trước vạch',
    meaning: 'Buộc tất cả các loại xe cơ giới và thô sơ kể cả các xe được ưu tiên phải dừng lại trước biển hoặc trước vạch ngang đường.'
  },
  {
    id: 'p123a',
    code: 'P.123a',
    name: 'Cấm rẽ trái',
    category: 'prohibitory',
    image: '/signs/p123a.svg',
    badge: 'Cấm rẽ trái',
    tip: 'Cấm rẽ trái VẪN ĐƯỢC QUAY ĐẦU (theo quy chuẩn mới QCVN 41:2019)',
    meaning: 'Cấm rẽ trái ở những chỗ đường giao nhau. Biển không có giá trị cấm quay đầu xe.'
  },
  {
    id: 'p123b',
    code: 'P.123b',
    name: 'Cấm rẽ phải',
    category: 'prohibitory',
    image: '/signs/p123b.svg',
    badge: 'Cấm rẽ phải',
    tip: 'Cấm rẽ phải tại nơi đường giao nhau (vẫn được đi thẳng hoặc rẽ trái)',
    meaning: 'Cấm rẽ phải ở những chỗ đường giao nhau. Biển có hiệu lực đối với tất cả các loại xe.'
  },
  {
    id: 'p124a',
    code: 'P.124a',
    name: 'Cấm quay đầu xe',
    category: 'prohibitory',
    image: '/signs/p124a.svg',
    badge: 'Cấm quay đầu',
    tip: 'Mũi tên chữ U gạch chéo: Cấm quay đầu xe, VẪN ĐƯỢC RẼ TRÁI',
    meaning: 'Cấm các loại xe quay đầu xe kiểu chữ U. Biển không cấm rẽ trái.'
  },
  {
    id: 'p124c',
    code: 'P.124c',
    name: 'Cấm rẽ trái và quay đầu xe',
    category: 'prohibitory',
    image: '/signs/p124c.svg',
    badge: 'Cấm cả rẽ & quay',
    tip: 'Mũi tên chữ U kết hợp rẽ trái: Cấm cả rẽ trái lẫn quay đầu',
    meaning: 'Cấm tất cả các loại xe rẽ trái đồng thời cấm quay đầu xe.'
  },
  {
    id: 'p124d',
    code: 'P.124d',
    name: 'Cấm rẽ phải và quay đầu xe',
    category: 'prohibitory',
    image: '/signs/p124d.svg',
    badge: 'Cấm rẽ phải & quay',
    tip: 'Cấm cả rẽ phải lẫn quay đầu xe',
    meaning: 'Cấm tất cả các loại xe rẽ phải đồng thời cấm quay đầu xe.'
  },
  {
    id: 'p125',
    code: 'P.125',
    name: 'Cấm vượt',
    category: 'prohibitory',
    image: '/signs/p125.svg',
    badge: 'Cấm vượt',
    tip: 'Xe con đen vượt xe đỏ: CẤM TẤT CẢ các loại ô tô vượt nhau (kể cả xe ưu tiên)',
    meaning: 'Cấm các loại xe cơ giới vượt nhau, kể cả các xe được ưu tiên theo quy định.'
  },
  {
    id: 'p126',
    code: 'P.126',
    name: 'Cấm ô tô tải vượt',
    category: 'prohibitory',
    image: '/signs/p126.svg',
    badge: 'Cấm tải vượt',
    tip: 'Xe tải đỏ vượt xe tải đen: Chỉ cấm xe tải vượt, Ô TÔ CON VẪN ĐƯỢC VƯỢT',
    meaning: 'Cấm tất cả các loại xe ô tô tải có khối lượng chuyên chở lớn hơn 3,5 tấn vượt các xe cơ giới khác.'
  },
  {
    id: 'p130',
    code: 'P.130',
    name: 'Cấm dừng xe và đỗ xe',
    category: 'prohibitory',
    image: '/signs/p130.svg',
    badge: 'Cấm cả dừng & đỗ',
    tip: '2 vạch đỏ chéo chữ X: CẤM CẢ DỪNG LẪN ĐỖ XE',
    meaning: 'Cấm tất cả các loại xe cơ giới và thô sơ dừng và đỗ ở đoạn đường có đặt biển, trừ các xe được ưu tiên.'
  },
  {
    id: 'p131a',
    code: 'P.131a',
    name: 'Cấm đỗ xe',
    category: 'prohibitory',
    image: '/signs/p131a.svg',
    badge: 'Cấm đỗ, được dừng',
    tip: '1 vạch đỏ chéo: CẤM ĐỖ XE, NHƯNG VẪN ĐƯỢC DỪNG XE',
    meaning: 'Cấm tất cả các loại xe cơ giới và thô sơ đỗ xe ở đoạn đường có đặt biển, trừ các xe được ưu tiên. Biển cho phép dừng xe tạm thời.'
  },
  {
    id: 'p131b',
    code: 'P.131b',
    name: 'Cấm đỗ xe ngày lẻ',
    category: 'prohibitory',
    image: '/signs/p131b.svg',
    badge: 'Cấm đỗ ngày lẻ',
    tip: '1 vạch trắng thẳng đứng ở giữa: Cấm đỗ vào các ngày 1, 3, 5, 7...',
    meaning: 'Cấm các loại xe cơ giới đỗ xe ở đoạn đường có đặt biển vào các ngày lẻ trong tháng.'
  },
  {
    id: 'p131c',
    code: 'P.131c',
    name: 'Cấm đỗ xe ngày chẵn',
    category: 'prohibitory',
    image: '/signs/p131c.svg',
    badge: 'Cấm đỗ ngày chẵn',
    tip: '2 vạch trắng thẳng đứng ở giữa: Cấm đỗ vào các ngày 2, 4, 6, 8...',
    meaning: 'Cấm các loại xe cơ giới đỗ xe ở đoạn đường có đặt biển vào các ngày chẵn trong tháng.'
  },
  {
    id: 'p133',
    code: 'P.133',
    name: 'Hết cấm vượt',
    category: 'prohibitory',
    image: '/signs/p133.svg',
    badge: 'Hết cấm vượt',
    tip: '2 ô tô màu xám có vạch đen chéo: Báo hiệu hết đoạn đường cấm vượt',
    meaning: 'Báo hiệu hết đoạn đường cấm vượt. Các loại xe cơ giới được phép vượt nhau nhưng phải bảo đảm an toàn.'
  }
];

// ==========================================
// BẢNG 2: BIỂN HIỆU LỆNH & CHỈ DẪN (Bìa sau sách mẹo)
// ==========================================
export const MANDATORY_SIGNS: TrafficSignItem[] = [
  {
    id: 'r301a',
    code: 'R.301a',
    name: 'Chỉ được đi thẳng',
    category: 'mandatory',
    image: '/signs/r301a.svg',
    badge: 'Đi thẳng',
    tip: 'Biển đặt TRƯỚC ngã 3, 4: Chỉ được phép đi thẳng qua nút giao',
    meaning: 'Các xe chỉ được đi thẳng (trừ xe được quyền ưu tiên theo quy định).'
  },
  {
    id: 'r301b',
    code: 'R.301b',
    name: 'Chỉ được rẽ phải',
    category: 'mandatory',
    image: '/signs/r301b.svg',
    badge: 'Rẽ phải',
    tip: 'Biển đặt TRƯỚC ngã 3, 4: Bắt buộc chỉ được phép rẽ phải',
    meaning: 'Các xe chỉ được rẽ phải ở phạm vi ngã ba, ngã tư phía sau mặt biển.'
  },
  {
    id: 'r301c',
    code: 'R.301c',
    name: 'Chỉ được rẽ trái',
    category: 'mandatory',
    image: '/signs/r301c.svg',
    badge: 'Rẽ trái',
    tip: 'Biển đặt TRƯỚC ngã 3, 4: Bắt buộc chỉ được phép rẽ trái',
    meaning: 'Các xe chỉ được rẽ trái ở phạm vi ngã ba, ngã tư phía sau mặt biển.'
  },
  {
    id: 'r301d',
    code: 'R.301d',
    name: 'Các xe chỉ được rẽ phải',
    category: 'mandatory',
    image: '/signs/r301d.svg',
    badge: 'Đặt sau ngã 3, 4',
    tip: 'Biển đặt SAU ngã ba, ngã tư: Chỉ được phép rẽ phải ở phạm vi nơi đường giao nhau',
    meaning: 'Biển đặt ở sau nơi đường giao nhau. Bắt buộc các xe chỉ được phép rẽ phải ở phạm vi nơi đường giao nhau.'
  },
  {
    id: 'r301e',
    code: 'R.301e',
    name: 'Các xe chỉ được rẽ trái',
    category: 'mandatory',
    image: '/signs/r301e.svg',
    badge: 'Đặt sau ngã 3, 4',
    tip: 'Biển đặt SAU ngã ba, ngã tư: Chỉ được rẽ trái hoặc quay đầu xe',
    meaning: 'Biển đặt ở sau nơi đường giao nhau. Bắt buộc các xe chỉ được phép rẽ trái (được phép quay đầu xe để đi theo hướng ngược lại).'
  },
  {
    id: 'r301h',
    code: 'R.301h',
    name: 'Các xe chỉ được rẽ trái và rẽ phải',
    category: 'mandatory',
    image: '/signs/r301h.svg',
    badge: 'Đặt sau ngã 3, 4',
    tip: 'Biển đặt SAU ngã ba, ngã tư: Chỉ được rẽ trái (kèm quay đầu) hoặc rẽ phải',
    meaning: 'Biển đặt ở sau nơi đường giao nhau. Bắt buộc các xe chỉ được rẽ trái (được phép quay đầu xe) hoặc rẽ phải.'
  },
  {
    id: 'r304',
    code: 'R.304',
    name: 'Đường dành cho xe thô sơ',
    category: 'mandatory',
    image: '/signs/r304.svg',
    badge: 'Xe thô sơ',
    tip: 'Đường chỉ dành cho xe thô sơ (kể cả xe người tàn tật) và người đi bộ',
    meaning: 'Báo hiệu đường dành riêng cho xe thô sơ và người đi bộ. Các loại xe cơ giới cấm đi vào.'
  },
  {
    id: 'r305',
    code: 'R.305',
    name: 'Đường dành cho người đi bộ',
    category: 'mandatory',
    image: '/signs/r305.svg',
    badge: 'Người đi bộ',
    tip: 'Đường chỉ dành cho người đi bộ, CẤM MỌI LOẠI XE',
    meaning: 'Báo hiệu đường dành riêng cho người đi bộ. Các loại xe cơ giới và thô sơ kể cả xe được ưu tiên cấm đi vào.'
  },
  {
    id: 'r306',
    code: 'R.306',
    name: 'Tốc độ tối thiểu cho phép (60)',
    category: 'mandatory',
    image: '/signs/r306.svg',
    badge: 'Tối thiểu 60',
    tip: 'Biển tròn xanh số 60 trắng: TỐC ĐỘ TỐI THIỂU (không được chạy chậm hơn 60km/h)',
    meaning: 'Báo hiệu tốc độ lưu hành tối thiểu cho phép các xe cơ giới chạy. Cấm các xe chạy dưới tốc độ ghi trên biển.'
  },
  {
    id: 'r307',
    code: 'R.307',
    name: 'Hết hạn chế tốc độ tối thiểu',
    category: 'mandatory',
    image: '/signs/r307.svg',
    badge: 'Hết tối thiểu',
    tip: 'Biển tròn xanh số 60 có gạch chéo đỏ: Hết hiệu lực tốc độ tối thiểu',
    meaning: 'Báo hiệu hết đoạn đường hạn chế tốc độ tối thiểu cho phép.'
  },
  {
    id: 'r303',
    code: 'R.303',
    name: 'Nơi giao nhau chạy theo vòng xuyến',
    category: 'mandatory',
    image: '/signs/r303.svg',
    badge: 'Vòng xuyến',
    tip: 'Biển tròn xanh 3 mũi tên khép kín: Bắt buộc chạy vòng theo đảo an toàn',
    meaning: 'Báo hiệu các loại xe muốn chuyển hướng phải chạy vòng theo đảo an toàn ở nơi đường giao nhau theo chiều mũi tên.'
  },
  {
    id: 'r308a',
    code: 'R.308a',
    name: 'Tuyến đường cầu vượt cắt qua',
    category: 'mandatory',
    image: '/signs/r308a.svg',
    badge: 'Cầu vượt cắt qua',
    tip: 'Biển hình tròn mũi tên uốn vòng qua cầu vượt',
    meaning: 'Báo hiệu phía trước có tuyến đường cầu vượt cắt qua, phương tiện đi theo hướng mũi tên chỉ dẫn.'
  },
  {
    id: 'r308b',
    code: 'R.308b',
    name: 'Tuyến đường cầu vượt cắt qua',
    category: 'mandatory',
    image: '/signs/r308b.svg',
    badge: 'Cầu vượt cắt qua',
    tip: 'Biển hình tròn mũi tên chữ thập rẽ nhánh',
    meaning: 'Báo hiệu phía trước có tuyến đường cầu vượt cắt ngang.'
  },
  {
    id: 'r420',
    code: 'R.420',
    name: 'Bắt đầu khu đông dân cư',
    category: 'mandatory',
    image: '/signs/r420.svg',
    badge: 'Khu dân cư',
    tip: 'Biển hình chữ nhật vẽ các tòa nhà: Giới hạn tốc độ trong khu dân cư (50 - 60km/h)',
    meaning: 'Báo hiệu bắt đầu đoạn đường đi qua phạm vi khu đông dân cư.'
  },
  {
    id: 'r421',
    code: 'R.421',
    name: 'Hết khu đông dân cư',
    category: 'mandatory',
    image: '/signs/r421.svg',
    badge: 'Hết khu dân cư',
    tip: 'Biển tòa nhà có vạch đỏ gạch chéo: Được tăng tốc độ ngoài khu dân cư',
    meaning: 'Báo hiệu hết đoạn đường đi qua phạm vi khu đông dân cư.'
  },
  {
    id: 'r412a',
    code: 'R.412a',
    name: 'Làn đường dành cho ô tô khách',
    category: 'mandatory',
    image: '/signs/r412a.svg',
    badge: 'Làn ô tô khách',
    tip: 'Biển vuông xanh có mũi tên và hình xe khách/buýt',
    meaning: 'Chỉ dẫn làn đường dành riêng cho các loại xe ô tô chở khách (kể cả xe buýt).'
  },
  {
    id: 'r412b',
    code: 'R.412b',
    name: 'Làn đường dành cho xe ô tô con',
    category: 'mandatory',
    image: '/signs/r412b.svg',
    badge: 'Làn ô tô con',
    tip: 'Biển vuông xanh có mũi tên và hình xe con',
    meaning: 'Chỉ dẫn làn đường dành riêng cho các loại xe ô tô con lưu thông.'
  },
  {
    id: 'r412c',
    code: 'R.412c',
    name: 'Làn đường dành cho xe ô tô tải',
    category: 'mandatory',
    image: '/signs/r412c.svg',
    badge: 'Làn xe tải',
    tip: 'Biển vuông xanh có mũi tên và hình xe tải',
    meaning: 'Chỉ dẫn làn đường dành riêng cho các loại ô tô tải lưu thông.'
  },
  {
    id: 'r412d',
    code: 'R.412d',
    name: 'Làn đường dành cho xe máy',
    category: 'mandatory',
    image: '/signs/r412d.svg',
    badge: 'Làn xe máy',
    tip: 'Biển vuông xanh có mũi tên và hình xe mô tô',
    meaning: 'Chỉ dẫn làn đường dành riêng cho xe mô tô và xe gắn máy lưu thông.'
  },
  {
    id: 'i407a',
    code: 'I.407a',
    name: 'Đường một chiều',
    category: 'mandatory',
    image: '/signs/i407a.svg',
    badge: 'Đường 1 chiều',
    tip: 'Biển chữ nhật đứng mũi tên trắng: Bắt đầu đoạn đường một chiều',
    meaning: 'Chỉ dẫn bắt đầu đoạn đường một chiều, các phương tiện chỉ được phép đi theo chiều mũi tên.'
  },
  {
    id: 'i407b',
    code: 'I.407b',
    name: 'Đường một chiều (rẽ phải)',
    category: 'mandatory',
    image: '/signs/i407b.svg',
    badge: 'Đường 1 chiều',
    tip: 'Biển chữ nhật nằm ngang mũi tên rẽ phải: Đường giao nhau là đường một chiều',
    meaning: 'Đặt trước nơi đường giao nhau để chỉ dẫn đường giao nhau phía trước là đường một chiều đi về bên phải.'
  },
  {
    id: 'i408',
    code: 'I.408',
    name: 'Nơi đỗ xe',
    category: 'mandatory',
    image: '/signs/i408.svg',
    badge: 'Nơi đỗ xe',
    tip: 'Biển vuông xanh chữ P trắng: Nơi được phép đỗ xe',
    meaning: 'Chỉ dẫn những nơi được phép đỗ xe, có thể đỗ một phần hoặc toàn bộ xe trên hè phố.'
  },
  {
    id: 'i408a',
    code: 'I.408a',
    name: 'Khu vực đỗ xe (ZONE)',
    category: 'mandatory',
    image: '/signs/i408a.svg',
    badge: 'ZONE Đỗ xe',
    tip: 'Biển có chữ ZONE: Hiệu lực trong toàn bộ khu vực mạng lưới đường bên trong',
    meaning: 'Chỉ dẫn khu vực đỗ xe áp dụng cho toàn bộ các tuyến đường bên trong khu vực đó.'
  }
];

// ==========================================
// BẢNG 3: 15 BIỂN BÁO NGUY HIỂM (Trang 11 sách mẹo - Mẹo 36)
// ==========================================
export const WARNING_SIGNS: TrafficSignItem[] = [
  {
    id: 'w212',
    code: 'W.212',
    name: 'Cầu hẹp',
    category: 'warning',
    image: '/signs/w212.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: '2 vạch co thắt hẹp ở giữa: Chiều rộng lòng cầu <= 4.5m',
    meaning: 'Báo trước sắp tới cầu hẹp là loại cầu có chiều rộng phần xe chạy nhỏ hơn hoặc bằng 4,50m.'
  },
  {
    id: 'w213',
    code: 'W.213',
    name: 'Cầu tạm',
    category: 'warning',
    image: '/signs/w213.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Vẽ giàn cầu bằng khung sắt bắc qua sông',
    meaning: 'Báo trước sắp tới cầu tạm là loại cầu được làm để sử dụng tạm thời cho xe cộ qua lại.'
  },
  {
    id: 'w214',
    code: 'W.214',
    name: 'Cầu quay, cầu cất',
    category: 'warning',
    image: '/signs/w214.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Hình cánh cầu nhấc bổng lên trên mặt nước',
    meaning: 'Báo trước sắp tới cầu quay, cầu cất là loại cầu trong từng thời gian có cắt giao thông đường bộ để cho tàu thuyền qua lại.'
  },
  {
    id: 'w245a',
    code: 'W.245a',
    name: 'Đi chậm',
    category: 'warning',
    image: '/signs/w245a.svg',
    badge: 'Đi chậm',
    tip: 'Biển tam giác có chữ "ĐI CHẬM": Báo người lái xe phải giảm tốc độ đi chậm',
    meaning: 'Báo trước người điều khiển phương tiện phải giảm tốc độ đi chậm để bảo đảm an toàn.'
  },
  {
    id: 'w245b',
    code: 'W.245b',
    name: 'Đi chậm (SLOW)',
    category: 'warning',
    image: '/signs/w245b.svg',
    badge: 'Đi chậm SLOW',
    tip: 'Biển có chữ "ĐI CHẬM" kèm biển phụ "SLOW" dùng cho tuyến đối ngoại',
    meaning: 'Báo trước người lái xe phải giảm tốc độ đi chậm trên các tuyến đường đối ngoại hoặc có yếu tố quốc tế.'
  },
  {
    id: 'w235',
    code: 'W.235',
    name: 'Đường đôi',
    category: 'warning',
    image: '/signs/w235.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Cục tròn (dải phân cách) ở TRÊN: Bắt đầu đường đôi',
    meaning: 'Báo trước sắp đến đoạn đường đôi có dải phân cách cố định phân chia hai chiều xe chạy.'
  },
  {
    id: 'w236',
    code: 'W.236',
    name: 'Hết đường đôi (Kết thúc đường đôi)',
    category: 'warning',
    image: '/signs/w236.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Cục tròn (dải phân cách) ở DƯỚI: Kết thúc đường đôi',
    meaning: 'Báo trước sắp kết thúc đoạn đường đôi, xe cộ chuẩn bị chuyển sang lưu thông trên đường thông thường.'
  },
  {
    id: 'w203b',
    code: 'W.203b',
    name: 'Đường bị hẹp về phía bên trái',
    category: 'warning',
    image: '/signs/w203b.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Vạch bên trái uốn cong vào trong: Đường co hẹp bên trái',
    meaning: 'Báo trước sắp đến đoạn đường bị hẹp về phía bên tay trái.'
  },
  {
    id: 'w203a',
    code: 'W.203a',
    name: 'Đường bị hẹp cả hai bên',
    category: 'warning',
    image: '/signs/w203a.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Cả 2 vạch đều thắt hẹp vào giữa',
    meaning: 'Báo trước sắp đến đoạn đường bị hẹp cả hai bên phần xe chạy.'
  },
  {
    id: 'w205a',
    code: 'W.205a',
    name: 'Đường cùng cấp (+)',
    category: 'warning',
    image: '/signs/w205a.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Dấu chữ thập (+) nét đều: Ngã tư cùng cấp, nhường đường cho xe bên phải',
    meaning: 'Báo trước sắp đến nơi giao nhau của các tuyến đường cùng cấp (không có đường ưu tiên).'
  },
  {
    id: 'w215',
    code: 'W.215a',
    name: 'Kè, vực sâu phía trước (hoặc Bến phà)',
    category: 'warning',
    image: '/signs/w215.svg',
    badge: 'Bờ kè vực sâu',
    tip: 'Hình ô tô lao xuống mép nước: Báo trước bờ kè, vực sâu hoặc bến phà nguy hiểm',
    meaning: 'Báo trước sắp tới những nơi có bờ kè, vực sâu mép sông nước hoặc bến phà nguy hiểm.'
  },
  {
    id: 'w204',
    code: 'W.204',
    name: 'Đường hai chiều',
    category: 'warning',
    image: '/signs/w204.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: '2 mũi tên THẲNG ĐỨNG ngược chiều nhau: Báo trước sắp đi vào đoạn đường hai chiều',
    meaning: 'Báo trước sắp đến đoạn đường do sửa chữa hoặc có trở ngại phải đi chung cả hai chiều xe chạy trên cùng một phần đường.'
  },
  {
    id: 'w234',
    code: 'W.234',
    name: 'Giao nhau với đường hai chiều',
    category: 'warning',
    image: '/signs/w234.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: '2 mũi tên NẰM NGANG ngược chiều nhau: Báo trước sắp giao nhau với đường 2 chiều',
    meaning: 'Báo trước sắp đến nơi giao nhau với đường hai chiều (thường gặp khi xe đang đi trên đường một chiều).'
  },
  {
    id: 'w207a',
    code: 'W.207a',
    name: 'Giao nhau với đường không ưu tiên',
    category: 'warning',
    image: '/signs/w207a.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Mũi tên to cắt vạch ngang nhỏ: BẠN ĐƯỢC ƯU TIÊN ĐI TRƯỚC',
    meaning: 'Báo trước sắp đến nơi giao nhau với đường không ưu tiên. Xe đi trên đường này được quyền ưu tiên qua nơi giao nhau.'
  },
  {
    id: 'w208',
    code: 'W.208',
    name: 'Giao nhau với đường ưu tiên',
    category: 'warning',
    image: '/signs/w208.svg',
    badge: 'Mẹo 36 (Trang 11)',
    tip: 'Tam giác ngược (đỉnh chúc xuống): BẠN PHẢI NHƯỜNG ĐƯỜNG',
    meaning: 'Báo trước sắp đến nơi giao nhau với đường ưu tiên. Xe gặp biển này bắt buộc phải nhường đường cho xe trên đường ưu tiên.'
  }
];

// ==========================================
// BẢNG 4: 16 KÝ HIỆU ĐÈN TÁP-LÔ & DỤNG CỤ CỨU HỘ (BỘ ĐỀ 600 CÂU & SÁCH MẸO)
// ==========================================
export const DASHBOARD_SIGNS: TrafficSignItem[] = [
  {
    id: 'taplo_tire',
    code: 'Câu 288',
    name: 'Áp suất lốp không đủ tiêu chuẩn',
    category: 'dashboard',
    image: '/signs/taplo_tire.png',
    badge: 'Áp suất lốp',
    tip: 'Mặt cắt lốp xe có khía rãnh và dấu than (!) ở giữa: Áp suất lốp không đủ',
    meaning: 'Hệ thống cảm biến áp suất lốp (TPMS) cảnh báo có ít nhất một bánh xe bị non hơi, áp suất giảm dưới mức an toàn.'
  },
  {
    id: 'taplo_brake',
    code: 'Câu 227',
    name: 'Phanh tay đang hãm hoặc thiếu dầu phanh',
    category: 'dashboard',
    image: '/signs/taplo_brake.png',
    badge: 'Hệ thống phanh',
    tip: 'Ký hiệu chữ BRAKE và dấu than (!) màu đỏ: Phanh tay đang hãm hoặc thiếu dầu phanh',
    meaning: 'Cảnh báo phanh đỗ xe (phanh tay) đang hãm hoặc dầu phanh trong bình chứa đang ở dưới ngưỡng an toàn.'
  },
  {
    id: 'taplo_oil',
    code: 'Câu 228',
    name: 'Áp suất dầu bôi trơn ở mức thấp',
    category: 'dashboard',
    image: '/signs/taplo_oil.png',
    badge: 'Bôi trơn động cơ',
    tip: 'Bình dầu có giọt dầu chảy: Áp suất dầu bôi trơn ở mức thấp',
    meaning: 'Áp suất dầu bôi trơn động cơ không đủ áp lực để bôi trơn các chi tiết máy, có nguy cơ gây bó kẹt hư hỏng động cơ.'
  },
  {
    id: 'taplo_door',
    code: 'Câu 229',
    name: 'Cửa xe đóng chưa chặt hoặc có cửa chưa đóng',
    category: 'dashboard',
    image: '/signs/taplo_door.png',
    badge: 'Cửa & Khóa',
    tip: 'Hình chiếc ô tô nhìn từ trên xuống có các cánh cửa hé mở: Cửa xe đóng chưa chặt',
    meaning: 'Cảnh báo một trong các cửa xe hoặc nắp cốp sau chưa được đóng chặt hoàn toàn khi xe đang vận hành.'
  },
  {
    id: 'taplo_seatbelt',
    code: 'Câu 230',
    name: 'Lái xe và người ngồi ghế trước chưa cài dây an toàn',
    category: 'dashboard',
    image: '/signs/taplo_seatbelt.png',
    badge: 'Dây an toàn',
    tip: 'Hình người ngồi ghế có dây vắt chéo qua ngực: Chưa cài dây an toàn',
    meaning: 'Cảnh báo người lái hoặc hành khách ngồi ở hàng ghế trước chưa cài dây đai an toàn.'
  },
  {
    id: 'tool_jack',
    code: 'Câu 296',
    name: 'Dùng để kích nâng xe ô tô (thay lốp)',
    category: 'dashboard',
    image: '/signs/tool_jack.png',
    badge: 'Dụng cụ ô tô',
    tip: 'Thiết bị hình quả trám con đội: Dùng để kích (nâng) xe ô tô',
    meaning: 'Trang thiết bị chuyên dùng để nâng xe lên khỏi mặt đất khi cần tháo lắp, thay thế bánh xe dự phòng.'
  },
  {
    id: 'tool_hammer',
    code: 'Câu 297',
    name: 'Phá cửa kính ô tô trong các trường hợp khẩn cấp',
    category: 'dashboard',
    image: '/signs/tool_hammer.png',
    badge: 'Cứu nạn cứu hộ',
    tip: 'Thiết bị hình chữ T màu đỏ có đầu nhọn: Dùng để phá cửa kính ô tô khi khẩn cấp',
    meaning: 'Dụng cụ chuyên dùng trang bị trên xe để phá vỡ các ô cửa kính thoát hiểm khi xảy ra tai nạn chìm nước hoặc cháy nổ.'
  },
  {
    id: 'taplo_fuel',
    code: 'Câu 231',
    name: 'Sắp hết nhiên liệu',
    category: 'dashboard',
    image: '/signs/taplo_fuel.png',
    badge: 'Nhiên liệu',
    tip: 'Hình cây bơm xăng: Xe sắp hết nhiên liệu, cần tiếp thêm',
    meaning: 'Báo hiệu lượng xăng hoặc dầu diesel trong thùng chứa ở mức dự trữ tối thiểu.'
  },
  {
    id: 'tool_fire',
    code: 'Câu 298',
    name: 'Chữa cháy trong các trường hợp hỏa hoạn',
    category: 'dashboard',
    image: '/signs/tool_fire.png',
    badge: 'Phòng cháy',
    tip: 'Thiết bị hình bình chữa cháy màu đỏ chữ F: Dùng để chữa cháy',
    meaning: 'Trang bị phòng cháy chữa cháy dùng để dập tắt các đám cháy ban đầu trên xe ô tô.'
  },
  {
    id: 'taplo_coolant',
    code: 'Câu 286',
    name: 'Nhiệt độ nước làm mát động cơ quá ngưỡng cho phép',
    category: 'dashboard',
    image: '/signs/taplo_coolant.png',
    badge: 'Làm mát động cơ',
    tip: 'Hình cây nhiệt kế cắm trên các gợn sóng nước: Động cơ bị quá nhiệt',
    meaning: 'Nhiệt độ nước làm mát động cơ vượt quá giới hạn an toàn cho phép (nóng máy, thiếu nước làm mát).'
  },
  {
    id: 'taplo_engine',
    code: 'Câu 287',
    name: 'Cần kiểm tra động cơ (Check Engine)',
    category: 'dashboard',
    image: '/signs/taplo_engine.png',
    badge: 'Động cơ ô tô',
    tip: 'Khối động cơ màu vàng/cam: Cần kiểm tra hệ thống điều khiển động cơ',
    meaning: 'Báo hiệu hệ thống điều khiển động cơ (ECU) phát hiện sự cố ở các cảm biến hoặc cơ cấu chấp hành.'
  },
  {
    id: 'taplo_abs',
    code: 'Câu 289',
    name: 'Hệ thống chống bó cứng khi phanh (ABS) bị lỗi',
    category: 'dashboard',
    image: '/signs/taplo_abs.png',
    badge: 'An toàn ABS',
    tip: 'Vòng tròn có chữ ABS ở giữa: Hệ thống chống bó cứng phanh bị lỗi',
    meaning: 'Hệ thống chống bó cứng phanh (Anti-lock Braking System) bị lỗi. Phanh cơ bản vẫn hoạt động nhưng không có tính năng chống trượt ABS.'
  },
  {
    id: 'tool_pedal',
    code: 'Câu 290',
    name: 'Đạp hết hành trình bàn đạp chân phanh để khởi động',
    category: 'dashboard',
    image: '/signs/tool_pedal.png',
    badge: 'Khởi động xe',
    tip: 'Hình bàn chân nhấn bàn đạp phanh: Phải đạp hết hành trình bàn đạp chân phanh',
    meaning: 'Yêu cầu người lái xe phải đạp hết hành trình bàn đạp phanh chân để khởi động động cơ an toàn trên xe số tự động.'
  },
  {
    id: 'taplo_steering',
    code: 'Câu 295',
    name: 'Hệ thống lái đang gặp sự cố',
    category: 'dashboard',
    image: '/signs/taplo_steering.png',
    badge: 'Hệ thống lái',
    tip: 'Vô lăng kèm dấu chấm than (!): Báo hiệu hệ thống lái đang gặp sự cố',
    meaning: 'Hệ thống trợ lực lái (thủy lực hoặc điện) gặp lỗi kỹ thuật, làm tay lái trở nên rất nặng hoặc mất cân bằng.'
  },
  {
    id: 'taplo_hazard',
    code: 'Câu 299',
    name: 'Báo hiệu xe đang gặp tình huống nguy hiểm',
    category: 'dashboard',
    image: '/signs/taplo_hazard.png',
    badge: 'Cảnh báo khẩn cấp',
    tip: 'Hai hình tam giác lồng nhau: Báo hiệu xe đang trong tình huống nguy hiểm',
    meaning: 'Đèn cảnh báo nguy hiểm (Hazard lights) bật nhấp nháy 4 đèn xi nhan khi xe dừng đỗ khẩn cấp trên đường.'
  },
  {
    id: 'taplo_eco',
    code: 'Câu 300',
    name: 'Cài đặt chế độ lái tiết kiệm nhiên liệu (ECO)',
    category: 'dashboard',
    image: '/signs/taplo_eco.png',
    badge: 'Chế độ ECO',
    tip: 'Chữ ECO màu xanh: Cài đặt chế độ tiết kiệm nhiên liệu',
    meaning: 'Báo hiệu xe đang kích hoạt chế độ lái tiết kiệm nhiên liệu, tối ưu hóa mức tiêu hao xăng/dầu.'
  }
];

