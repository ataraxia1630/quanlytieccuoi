# Toast Service Usage Guide - Phiên bản Tối ưu

## Cách sử dụng Toast Service

### 1. Import Toast Service

```javascript
import toastService from '../service/toast.service';
// hoặc
import { toastService } from '../service/toast.service';
```

### 2. Basic Usage

#### Các phương thức cơ bản:
```javascript
// Success toast
toastService.success('Thành công!');

// Error toast
toastService.error('Có lỗi xảy ra!');

// Warning toast
toastService.warning('Cảnh báo!');

// Info toast
toastService.info('Thông tin');
```

### 3. CRUD Operations

#### Success operations:
```javascript
toastService.crud.success.create(); // "Thêm mới thành công!"
toastService.crud.success.create('món ăn'); // "Thêm món ăn thành công!"
toastService.crud.success.update(); // "Cập nhật thành công!"
toastService.crud.success.update('dịch vụ'); // "Cập nhật dịch vụ thành công!"
toastService.crud.success.delete(); // "Xóa thành công!"
toastService.crud.success.save(); // "Lưu thành công!"
```

#### Error operations:
```javascript
toastService.crud.error.create(); // "Thêm thất bại!"
toastService.crud.error.update(); // "Cập nhật thất bại!"
toastService.crud.error.delete(); // "Xóa thất bại!"
toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"
```

#### Processing operations:
```javascript
toastService.crud.processing.loading(); // "Đang xử lý …"
toastService.crud.processing.saving(); // "Đang lưu..."
toastService.crud.processing.deleting(); // "Đang xóa..."
```

#### Cancel operations:
```javascript
toastService.crud.cancel.delete(); // "Đã hủy xóa"
toastService.crud.cancel.edit(); // "Đã đóng cửa sổ chỉnh sửa"
toastService.crud.cancel.create(); // "Đã đóng cửa sổ thêm mới"
```

### 4. Search Operations

```javascript
toastService.search.success(5); // "Đã tìm thấy 5 kết quả phù hợp"
toastService.search.success(3, 'dịch vụ'); // "Đã tìm thấy 3 dịch vụ phù hợp"

toastService.search.noResults(); // "Không tìm thấy kết quả phù hợp"
toastService.search.noResults('món ăn'); // "Không tìm thấy món ăn nào phù hợp"

toastService.search.emptyKeyword(); // "Vui lòng nhập từ khóa tìm kiếm"
toastService.search.appliedFilter(); // "Đã áp dụng bộ lọc"
toastService.search.resetFilter(); // "Đã reset bộ lọc"
```

### 5. Validation

```javascript
toastService.validation.requiredFields(); // "Vui lòng nhập đầy đủ thông tin!"
toastService.validation.invalidData(); // "Dữ liệu không hợp lệ!"
toastService.validation.checkInfo(); // "Vui lòng kiểm tra lại thông tin!"
toastService.validation.notFound(); // "Không tìm thấy dữ liệu!"
toastService.validation.notFound('món ăn'); // "Không tìm thấy món ăn!"
```

### 6. **MỚI** - Generic Entity Operations

**Đây là cách mới để quản lý toast cho tất cả các entity một cách đồng nhất:**

#### Thành công:
```javascript
// Cho các entity đơn giản
toastService.entity.createSuccess('ca'); // "Thêm ca thành công!"
toastService.entity.updateSuccess('sảnh'); // "Cập nhật sảnh thành công!"
toastService.entity.deleteSuccess('dịch vụ'); // "Xóa dịch vụ thành công!"

// Cho các entity có tên cụ thể
toastService.entity.createSuccess('món ăn', 'Cơm chiên'); // "Thêm món ăn "Cơm chiên" thành công!"
toastService.entity.updateSuccess('dịch vụ', 'Trang trí'); // "Cập nhật dịch vụ "Trang trí" thành công!"
toastService.entity.deleteSuccess('ca', 'Ca sáng'); // "Đã xóa ca "Ca sáng" thành công!"
```

#### Lỗi & Thông báo khác:
```javascript
toastService.entity.notFound('món ăn'); // "Không tìm thấy món ăn!"
toastService.entity.updateFailed('sảnh'); // "Cập nhật sảnh thất bại!"

// Các thông báo tương tác (nếu cần)
toastService.entity.deleteConfirm('món ăn', 'Cơm chiên'); // "Bạn sắp xóa món ăn: Cơm chiên"
toastService.entity.editing('dịch vụ', 'Trang trí'); // "Đang chỉnh sửa dịch vụ: Trang trí"
toastService.entity.createStart('ca'); // "Bắt đầu thêm ca mới"
toastService.entity.cancelDelete('sảnh'); // "Đã hủy xóa sảnh"
```

### 7. Page Specific Toasts - Chỉ cho những tính năng đặc biệt

#### Đặt món ăn:
```javascript
toastService.datMonAn.success(); // "Đặt món thành công!"

// Sử dụng generic methods cho các operations khác:
toastService.crud.success.update('chi tiết đặt món'); // "Cập nhật chi tiết đặt món thành công!"
toastService.crud.success.delete('chi tiết đặt món'); // "Xóa chi tiết đặt món thành công!"
toastService.crud.cancel.delete(); // "Đã hủy xóa"
toastService.crud.error.create('chi tiết đặt bàn'); // "Thêm chi tiết đặt bàn thất bại!"
toastService.crud.error.update('chi tiết đặt bàn'); // "Cập nhật chi tiết đặt bàn thất bại!"
toastService.crud.error.delete('chi tiết đặt bàn'); // "Xóa chi tiết đặt bàn thất bại!"
```

#### Đặt dịch vụ:
```javascript
toastService.datDichVu.success(); // "Đặt dịch vụ thành công!"

// Sử dụng generic methods cho các operations khác:
toastService.crud.success.update('chi tiết dịch vụ'); // "Cập nhật chi tiết dịch vụ thành công!"
toastService.crud.success.delete('chi tiết dịch vụ'); // "Xóa chi tiết dịch vụ thành công!"
toastService.crud.cancel.delete(); // "Đã hủy xóa"
toastService.crud.error.create('chi tiết dịch vụ'); // "Thêm chi tiết dịch vụ thất bại!"
toastService.crud.error.update('chi tiết dịch vụ'); // "Cập nhật chi tiết dịch vụ thất bại!"
toastService.crud.error.delete('chi tiết dịch vụ'); // "Xóa chi tiết dịch vụ thất bại!"
```

#### Hóa đơn:
```javascript
toastService.hoaDon.serviceAdded(); // "Dịch vụ đã được thêm vào hoá đơn!"
toastService.hoaDon.dishAdded(); // "Món ăn đã được thêm vào hoá đơn!"
toastService.hoaDon.serviceUpdated(); // "Dịch vụ đã được cập nhật!"
toastService.hoaDon.dishUpdated(); // "Món ăn đã được cập nhật!"
toastService.hoaDon.serviceRemoved(); // "Đã xoá dịch vụ khỏi hoá đơn!"
toastService.hoaDon.dishRemoved(); // "Đã xoá món ăn khỏi hoá đơn!"
toastService.hoaDon.serviceAlreadySelected(); // "Dịch vụ đã được chọn trước đó!"
toastService.hoaDon.dishAlreadySelected(); // "Món ăn đã được chọn trước đó!"
toastService.hoaDon.paymentSuccess(); // "Tạo hoá đơn thành công!"
toastService.hoaDon.paymentFailed(); // "Tạo hoá đơn thất bại!"
```

#### Báo cáo:
```javascript
toastService.baoCao.generateSuccess(); // "Tạo báo cáo thành công!"
toastService.baoCao.generateFailed(); // "Tạo báo cáo thất bại!"

// Sử dụng file operations cho print/export
toastService.file.noPrintData(); // "Không có dữ liệu để in!"
toastService.file.noExportData(); // "Không có dữ liệu để xuất báo cáo!"
toastService.file.exportSuccess(); // "Báo cáo đã được xuất thành công!"
```

#### Tham số:
```javascript
toastService.thamSo.searchSuccess(5); // "Tìm thấy 5 tham số"
toastService.thamSo.noParamsFound(); // "Không tìm thấy tham số phù hợp"
toastService.thamSo.editing(); // "Chỉnh sửa quy định"
toastService.thamSo.closeEdit(); // "Đã đóng chỉnh sửa"
toastService.thamSo.saveEdit(); // "Đã lưu chỉnh sửa"
```

#### Phiếu đặt tiệc:
```javascript
toastService.phieuDatTiec.bookingSuccess(); // "Đặt tiệc thành công!"
toastService.phieuDatTiec.bookingFailed(); // "Đặt tiệc thất bại!"
toastService.phieuDatTiec.cancelBooking(); // "Đã hủy đặt tiệc"
toastService.phieuDatTiec.confirmBooking(); // "Xác nhận đặt tiệc thành công!"

// Sử dụng generic methods cho update status
toastService.crud.success.update('trạng thái'); // "Cập nhật trạng thái thành công!"
toastService.crud.error.update('trạng thái'); // "Cập nhật trạng thái thất bại!"
```

#### User Management:
```javascript
toastService.user.loginSuccess(); // "Đăng nhập thành công!"
toastService.user.loginFailed(); // "Đăng nhập thất bại!"
toastService.user.logoutSuccess(); // "Đăng xuất thành công!"
toastService.user.registerSuccess(); // "Đăng ký thành công!"
toastService.user.changePasswordSuccess(); // "Đổi mật khẩu thành công!"
toastService.user.permissionDenied(); // "Bạn không có quyền thực hiện thao tác này!"
```

#### Quyền & Nhóm:
```javascript
toastService.quyen.assignSuccess(); // "Phân quyền thành công!"
toastService.quyen.assignFailed(); // "Phân quyền thất bại!"

// Sử dụng generic methods cho remove quyền
toastService.crud.success.delete('quyền'); // "Xóa quyền thành công!"
toastService.crud.error.delete('quyền'); // "Xóa quyền thất bại!"

toastService.nhom.addUserSuccess(); // "Thêm người dùng vào nhóm thành công!"
toastService.nhom.addUserFailed(); // "Thêm người dùng vào nhóm thất bại!"
toastService.nhom.removeUserSuccess(); // "Xóa người dùng khỏi nhóm thành công!"
toastService.nhom.removeUserFailed(); // "Xóa người dùng khỏi nhóm thất bại!"
```

### 8. File Operations

```javascript
toastService.file.printError('Connection timeout'); // "Lỗi khi in: Connection timeout"
toastService.file.exportError('File not found'); // "Lỗi khi xuất file: File not found"
toastService.file.noPrintData(); // "Không có dữ liệu để in!"
toastService.file.noExportData(); // "Không có dữ liệu để xuất báo cáo!"
toastService.file.exportSuccess(); // "Báo cáo đã được xuất thành công!"
```

### 9. Usage Examples - Cách sử dụng mới

```javascript
// Trong React component cho DanhSachMonAn
import toastService from '../service/toast.service';

const DanhSachMonAn = () => {
  const handleCreateMonAn = async (monAnData) => {
    try {
      toastService.crud.processing.saving();
      
      const result = await createMonAn(monAnData);
      
      // Sử dụng entity method thay vì page-specific
      toastService.entity.createSuccess('món ăn', result.tenMonAn);
    } catch (error) {
      toastService.crud.error.create('món ăn');
    }
  };

  const handleDeleteMonAn = (monAn) => {
    if (window.confirm(`Bạn có chắc muốn xóa món ăn "${monAn.tenMonAn}"?`)) {
      try {
        deleteMonAn(monAn.id);
        toastService.entity.deleteSuccess('món ăn', monAn.tenMonAn);
      } catch (error) {
        toastService.crud.error.delete('món ăn');
      }
    } else {
      toastService.entity.cancelDelete('món ăn');
    }
  };

  const handleSearch = (results, keyword) => {
    if (results.length > 0) {
      toastService.search.success(results.length, 'món ăn');
    } else {
      toastService.search.noResults('món ăn');
    }
  };

  return (
    // JSX component
  );
};
```

```javascript
// Trong React component cho DatMonAn
const DatMonAn = () => {
  const handleDatMon = async (datMonData) => {
    try {
      const result = await datMon(datMonData);
      toastService.datMonAn.success(); // "Đặt món thành công!"
    } catch (error) {
      toastService.crud.error.generic();
    }
  };

  const handleUpdateChiTiet = async (id, data) => {
    try {
      await updateChiTietDatMon(id, data);
      toastService.crud.success.update('chi tiết đặt món'); // "Cập nhật chi tiết đặt món thành công!"
    } catch (error) {
      toastService.crud.error.update('chi tiết đặt bàn'); // "Cập nhật chi tiết đặt bàn thất bại!"
    }
  };

  const handleDeleteChiTiet = (chiTiet) => {
    if (window.confirm('Bạn có chắc muốn xóa chi tiết này?')) {
      try {
        deleteChiTietDatMon(chiTiet.id);
        toastService.crud.success.delete('chi tiết đặt món'); // "Xóa chi tiết đặt món thành công!"
      } catch (error) {
        toastService.crud.error.delete('chi tiết đặt bàn'); // "Xóa chi tiết đặt bàn thất bại!"
      }
    } else {
      toastService.crud.cancel.delete(); // "Đã hủy xóa"
    }
  };

  // ... other methods
};
```

```javascript
// Trong React component cho DatDichVu
const DatDichVu = () => {
  const handleDatDichVu = async (datDichVuData) => {
    try {
      const result = await datDichVu(datDichVuData);
      toastService.datDichVu.success(); // "Đặt dịch vụ thành công!"
    } catch (error) {
      toastService.crud.error.generic();
    }
  };

  const handleUpdateChiTiet = async (id, data) => {
    try {
      await updateChiTietDichVu(id, data);
      toastService.crud.success.update('chi tiết dịch vụ'); // "Cập nhật chi tiết dịch vụ thành công!"
    } catch (error) {
      toastService.crud.error.update('chi tiết dịch vụ'); // "Cập nhật chi tiết dịch vụ thất bại!"
    }
  };

  const handleDeleteChiTiet = (chiTiet) => {
    if (window.confirm('Bạn có chắc muốn xóa chi tiết này?')) {
      try {
        deleteChiTietDichVu(chiTiet.id);
        toastService.crud.success.delete('chi tiết dịch vụ'); // "Xóa chi tiết dịch vụ thành công!"
      } catch (error) {
        toastService.crud.error.delete('chi tiết dịch vụ'); // "Xóa chi tiết dịch vụ thất bại!"
      }
    } else {
      toastService.crud.cancel.delete(); // "Đã hủy xóa"
    }
  };

  // ... other methods
};
```

### 10. **Best Practices** - Hướng dẫn tốt nhất

1. **Sử dụng Generic Entity Methods**: Ưu tiên `toastService.entity.*` cho các thao tác CRUD thông thường
2. **Consistency**: Sử dụng cùng một tên entity trong toàn bộ page (ví dụ: 'món ăn', 'dịch vụ', 'sảnh')
3. **Page-Specific Only When Needed**: Chỉ sử dụng page-specific methods cho những tính năng thực sự đặc biệt
4. **Entity Names**: Sử dụng tên entity bằng tiếng Việt thống nhất:
   - 'món ăn' (không phải 'monan' hay 'món')
   - 'dịch vụ' (không phải 'dichvu')  
   - 'ca' (không phải 'ca làm việc')
   - 'sảnh' (không phải 'sanh tiec')
   - 'loại sảnh'
   - 'tham số'

### 11. **Migration Guide** - Hướng dẫn chuyển đổi

**Thay đổi từ:**
```javascript
// Cũ - mỗi page có methods riêng
toastService.monAn.createSuccess('Cơm chiên');
toastService.dichVu.createSuccess('Trang trí');
toastService.ca.notFound();
toastService.sanh.deleteConfirm('Sảnh A');
```

**Thành:**
```javascript
// Mới - sử dụng generic methods
toastService.entity.createSuccess('món ăn', 'Cơm chiên');
toastService.entity.createSuccess('dịch vụ', 'Trang trí');
toastService.validation.notFound('ca');
toastService.entity.deleteConfirm('sảnh', 'Sảnh A');
```

Phiên bản tối ưu này giúp giảm code duplicate và tạo ra một hệ thống toast nhất quán, dễ bảo trì hơn!
