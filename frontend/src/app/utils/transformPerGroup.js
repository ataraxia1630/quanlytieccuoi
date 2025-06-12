export const transformPerGroup = (permissions) => {
  const groupDefinitions = [
    { name: 'Đặt tiệc cưới', prefix: 'order.' },
    { name: 'Tra cứu tiệc cưới', prefix: 'wedding.' },
    { name: 'Lập hóa đơn thanh toán', prefix: 'bill.' },
    { name: 'Danh sách sảnh', prefix: 'hall.' },
    { name: 'Danh sách loại sảnh', prefix: 'hallType.' },
    { name: 'Danh sách ca', prefix: 'shift.' },
    { name: 'Danh sách món ăn', prefix: 'food.' },
    { name: 'Danh sách dịch vụ', prefix: 'service.' },
    { name: 'Danh sách tham số', prefix: 'variable.' },
    { name: 'Báo cáo tháng', prefix: 'report.' },
    { name: 'Quản lý người dùng', prefix: 'account.' },
    { name: 'Quản lý nhóm người dùng', prefix: 'group.' },
  ];

  const permissionGroups = {};
  groupDefinitions.forEach((group) => {
    permissionGroups[group.name] = [];
  });

  permissions.forEach((permission) => {
    const group = groupDefinitions.find((g) =>
      permission.TenQuyen.startsWith(g.prefix)
    );
    if (group) {
      permissionGroups[group.name].push({
        MaQuyen: permission.MaQuyen,
        TenQuyen: permission.TenQuyen,
      });
    }
  });

  return permissionGroups;
};
