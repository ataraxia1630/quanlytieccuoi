const statusOptions = [
  { value: 'AVAILABLE', label: 'Còn hàng' },
  { value: 'UNAVAILABLE', label: 'Tạm hết hàng' },
  { value: 'NO_LONGER_AVAILABLE', label: 'Ngừng bán' },
];

const statusList = ['Còn hàng', 'Tạm hết hàng', 'Ngừng bán'];

const statusMapToFrontend = {
  AVAILABLE: 'Còn hàng',
  UNAVAILABLE: 'Tạm hết hàng',
  NO_LONGER_AVAILABLE: 'Ngừng bán',
};

const statusMapToBackend = {
  'Còn hàng': 'AVAILABLE',
  'Tạm hết hàng': 'UNAVAILABLE',
  'Ngừng bán': 'NO_LONGER_AVAILABLE',
};

export { statusOptions, statusMapToFrontend, statusMapToBackend, statusList };
