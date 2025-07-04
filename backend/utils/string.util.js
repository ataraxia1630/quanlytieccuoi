// Chuẩn hóa chuỗi để tìm kiếm
const removeDiacritics = (str, keepSpaces = false) => {
  if (!str || typeof str !== 'string') return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim();

  const replaced = keepSpaces
    ? cleaned.replace(/\s+/g, ' ')
    : cleaned.replace(/\s+/g, '');

  return replaced.toLowerCase();
};

module.exports = removeDiacritics;
