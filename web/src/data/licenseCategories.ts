import type { LicenseConfig } from '../types';

export const LICENSE_CATEGORIES: LicenseConfig[] = [
  {
    id: 'A1',
    name: 'Hạng A1',
    description: 'Xe mô tô hai bánh có dung tích xi-lanh đến 125 cm³',
    totalQuestions: 25,
    timeMinutes: 19,
    passScore: 21,
    allowedWrong: 4,
    criticalAllowed: 0,
    questionPoolCount: 200,
    criticalCount: 20
  },
  {
    id: 'A',
    name: 'Hạng A (A2 cũ)',
    description: 'Xe mô tô hai bánh có dung tích xi-lanh trên 125 cm³',
    totalQuestions: 25,
    timeMinutes: 19,
    passScore: 23,
    allowedWrong: 2,
    criticalAllowed: 0,
    questionPoolCount: 450,
    criticalCount: 50
  },
  {
    id: 'B1',
    name: 'Hạng B1 (Số tự động)',
    description: 'Ô tô số tự động chở người đến 8 chỗ, không hành nghề lái xe',
    totalQuestions: 30,
    timeMinutes: 20,
    passScore: 27,
    allowedWrong: 3,
    criticalAllowed: 0,
    questionPoolCount: 574,
    criticalCount: 60
  },
  {
    id: 'B',
    name: 'Hạng B',
    description: 'Ô tô chở người đến 8 chỗ, ô tô tải đến 3.5 tấn (thay thế B1 & B2 cũ)',
    totalQuestions: 30,
    timeMinutes: 20,
    passScore: 27,
    allowedWrong: 3,
    criticalAllowed: 0,
    questionPoolCount: 600,
    criticalCount: 60
  },
  {
    id: 'C1',
    name: 'Hạng C1',
    description: 'Ô tô tải có khối lượng từ trên 3.5 tấn đến 7.5 tấn',
    totalQuestions: 35,
    timeMinutes: 22,
    passScore: 32,
    allowedWrong: 3,
    criticalAllowed: 0,
    questionPoolCount: 600,
    criticalCount: 60
  },
  {
    id: 'C',
    name: 'Hạng C',
    description: 'Ô tô tải có khối lượng chuyên chở trên 7.5 tấn',
    totalQuestions: 40,
    timeMinutes: 24,
    passScore: 36,
    allowedWrong: 4,
    criticalAllowed: 0,
    questionPoolCount: 600,
    criticalCount: 60
  },
  {
    id: 'D',
    name: 'Hạng D / D1 / D2',
    description: 'Xe chở người trên 8 chỗ, xe khách, xe bus',
    totalQuestions: 45,
    timeMinutes: 26,
    passScore: 41,
    allowedWrong: 4,
    criticalAllowed: 0,
    questionPoolCount: 600,
    criticalCount: 60
  }
];
