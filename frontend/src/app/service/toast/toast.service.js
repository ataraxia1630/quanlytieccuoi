import { toast } from 'react-toastify';

// ===== COMMON TOAST MESSAGES =====
export const COMMON_MESSAGES = {
  // CRUD Operations
  CRUD: {
    SUCCESS: {
      CREATE: 'Thêm mới thành công!',
      UPDATE: 'Cập nhật thành công!',
      DELETE: 'Xóa thành công!',
      SAVE: 'Lưu thành công!',
      CANCEL: 'Đã hủy thao tác',
    },
    PROCESSING: {
      LOADING: 'Đang xử lý …',
      SENDING: 'Đang gửi yêu cầu …',
      PROCESSING: 'Đang xử lý yêu cầu ...',
      SAVING: 'Đang lưu...',
      DELETING: 'Đang xóa...',
    },
    ERROR: {
      GENERIC: 'Có lỗi xảy ra. Vui lòng thử lại sau!',
      DELETE_FAILED: 'Xóa thất bại! Vui lòng thử lại.',
      UPDATE_FAILED: 'Cập nhật thất bại!',
      CREATE_FAILED: 'Thêm thất bại!',
      SAVE_FAILED: 'Lưu thất bại!',
      LOAD_FAILED: 'Lỗi khi tải dữ liệu',
      CANNOT_LOAD: 'Không thể tải dữ liệu',
    },
    CANCEL: {
      DELETE: 'Đã hủy xóa',
      EDIT: 'Đã đóng cửa sổ chỉnh sửa',
      CREATE: 'Đã đóng cửa sổ thêm mới',
    }
  },

  // Search & Filter
  SEARCH: {
    SUCCESS: (count) => `Đã tìm thấy ${count} kết quả phù hợp`,
    NO_RESULTS: 'Không tìm thấy kết quả phù hợp',
    EMPTY_KEYWORD: 'Vui lòng nhập từ khóa tìm kiếm',
    APPLIED_FILTER: 'Đã áp dụng bộ lọc',
    RESET_FILTER: 'Đã reset bộ lọc',
    SEARCHING: (keyword) => `Đang tìm kiếm: ${keyword}`,
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELDS: 'Vui lòng nhập đầy đủ thông tin!',
    INVALID_DATA: 'Dữ liệu không hợp lệ!',
    CHECK_INFO: 'Vui lòng kiểm tra lại thông tin!',
    REQUIRED_INFO: 'Thông tin bắt buộc chưa được nhập!',
  },

  // Data Loading
  LOADING: {
    DATA: 'Đang tải dữ liệu...',
    PROCESSING: 'Đang xử lý...',
  },

  // File Operations
  FILE: {
    PRINT_ERROR: (error) => `Lỗi khi in: ${error}`,
    EXPORT_ERROR: (error) => `Lỗi khi xuất file: ${error}`,
    NO_DATA_PRINT: 'Không có dữ liệu để in!',
    NO_DATA_EXPORT: 'Không có dữ liệu để xuất báo cáo!',
    EXPORT_SUCCESS: 'Báo cáo đã được xuất thành công!',
  }
};

// ===== PAGE SPECIFIC MESSAGES =====
export const PAGE_MESSAGES = {
  // DatMonAn - chỉ giữ lại những message thực sự đặc biệt
  DATMONAN: {
    SUCCESS: 'Đặt món thành công!',
  },

  // DatDichVu - chỉ giữ lại những message thực sự đặc biệt
  DATDICHVU: {
    SUCCESS: 'Đặt dịch vụ thành công!',
  },
  // HoaDon
  HOADON: {
    SERVICE_ADDED: 'Dịch vụ đã được thêm vào hoá đơn!',
    DISH_ADDED: 'Món ăn đã được thêm vào hoá đơn!',
    SERVICE_UPDATED: 'Dịch vụ đã được cập nhật!',
    DISH_UPDATED: 'Món ăn đã được cập nhật!',
    SERVICE_REMOVED: 'Đã xoá dịch vụ khỏi hoá đơn!',
    DISH_REMOVED: 'Đã xoá món ăn khỏi hoá đơn!',
    SERVICE_ALREADY_SELECTED: 'Dịch vụ đã được chọn trước đó!',
    DISH_ALREADY_SELECTED: 'Món ăn đã được chọn trước đó!',
    PAYMENT_SUCCESS: 'Tạo hoá đơn thành công!',
    PAYMENT_FAILED: 'Tạo hoá đơn thất bại!',
  },
  // BaoCaoThang
  BAOCAO: {
    GENERATE_SUCCESS: 'Tạo báo cáo thành công!',
    GENERATE_FAILED: 'Tạo báo cáo thất bại!',
  },

  // BangThamSo
  THAMSO: {
    SEARCH_SUCCESS: (count) => `Tìm thấy ${count} tham số`,
    NO_PARAMS_FOUND: 'Không tìm thấy tham số phù hợp',
    EDITING: 'Chỉnh sửa quy định',
    CLOSE_EDIT: 'Đã đóng chỉnh sửa',
    SAVE_EDIT: 'Đã lưu chỉnh sửa',
  },
  // PhieuDatTiec
  PHIEUDATTIEC: {
    BOOKING_SUCCESS: 'Đặt tiệc thành công!',
    BOOKING_FAILED: 'Đặt tiệc thất bại!',
    CANCEL_BOOKING: 'Đã hủy đặt tiệc',
    CONFIRM_BOOKING: 'Xác nhận đặt tiệc thành công!',
  },

  // User Management
  USER: {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGIN_FAILED: 'Đăng nhập thất bại!',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    REGISTER_SUCCESS: 'Đăng ký thành công!',
    REGISTER_FAILED: 'Đăng ký thất bại!',
    CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công!',
    CHANGE_PASSWORD_FAILED: 'Đổi mật khẩu thất bại!',
    PERMISSION_DENIED: 'Bạn không có quyền thực hiện thao tác này!',
  },
  // Permissions & Groups
  QUYEN: {
    ASSIGN_SUCCESS: 'Phân quyền thành công!',
    ASSIGN_FAILED: 'Phân quyền thất bại!',
  },

  NHOM: {
    ADD_USER_SUCCESS: 'Thêm người dùng vào nhóm thành công!',
    ADD_USER_FAILED: 'Thêm người dùng vào nhóm thất bại!',
    REMOVE_USER_SUCCESS: 'Xóa người dùng khỏi nhóm thành công!',
    REMOVE_USER_FAILED: 'Xóa người dùng khỏi nhóm thất bại!',
  }
};

// ===== TOAST SERVICE CLASS =====
class ToastService {
  // Basic toast methods
  success(message, options = {}) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  error(message, options = {}) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  warning(message, options = {}) {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  info(message, options = {}) {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  // Common CRUD operations
  crud = {
    success: {
      create: (itemName = '') => this.success(itemName ? `Thêm ${itemName} thành công!` : COMMON_MESSAGES.CRUD.SUCCESS.CREATE),
      update: (itemName = '') => this.success(itemName ? `Cập nhật ${itemName} thành công!` : COMMON_MESSAGES.CRUD.SUCCESS.UPDATE),
      delete: (itemName = '') => this.success(itemName ? `Xóa ${itemName} thành công!` : COMMON_MESSAGES.CRUD.SUCCESS.DELETE),
      save: () => this.success(COMMON_MESSAGES.CRUD.SUCCESS.SAVE),
    },
    error: {
      create: (itemName = '') => this.error(itemName ? `Thêm ${itemName} thất bại!` : COMMON_MESSAGES.CRUD.ERROR.CREATE_FAILED),
      update: (itemName = '') => this.error(itemName ? `Cập nhật ${itemName} thất bại!` : COMMON_MESSAGES.CRUD.ERROR.UPDATE_FAILED),
      delete: (itemName = '') => this.error(itemName ? `Xóa ${itemName} thất bại!` : COMMON_MESSAGES.CRUD.ERROR.DELETE_FAILED),
      generic: () => this.error(COMMON_MESSAGES.CRUD.ERROR.GENERIC),
    },
    processing: {
      loading: () => this.info(COMMON_MESSAGES.CRUD.PROCESSING.LOADING),
      saving: () => this.info(COMMON_MESSAGES.CRUD.PROCESSING.SAVING),
      deleting: () => this.info(COMMON_MESSAGES.CRUD.PROCESSING.DELETING),
    },
    cancel: {
      delete: () => this.info(COMMON_MESSAGES.CRUD.CANCEL.DELETE),
      edit: () => this.info(COMMON_MESSAGES.CRUD.CANCEL.EDIT),
      create: () => this.info(COMMON_MESSAGES.CRUD.CANCEL.CREATE),
    }
  };
  // Enhanced search operations with entity type
  search = {
    success: (count, entityType = '') => {
      const message = entityType 
        ? `Đã tìm thấy ${count} ${entityType} phù hợp`
        : COMMON_MESSAGES.SEARCH.SUCCESS(count);
      this.success(message);
    },
    noResults: (entityType = '') => {
      const message = entityType
        ? `Không tìm thấy ${entityType} nào phù hợp`
        : COMMON_MESSAGES.SEARCH.NO_RESULTS;
      this.warning(message);
    },
    emptyKeyword: () => this.warning(COMMON_MESSAGES.SEARCH.EMPTY_KEYWORD),
    appliedFilter: () => this.success(COMMON_MESSAGES.SEARCH.APPLIED_FILTER),
    resetFilter: () => this.info(COMMON_MESSAGES.SEARCH.RESET_FILTER),
  };

  // Enhanced validation with entity context
  validation = {
    requiredFields: () => this.warning(COMMON_MESSAGES.VALIDATION.REQUIRED_FIELDS),
    invalidData: () => this.error(COMMON_MESSAGES.VALIDATION.INVALID_DATA),
    checkInfo: () => this.warning(COMMON_MESSAGES.VALIDATION.CHECK_INFO),
    notFound: (entityType = 'dữ liệu') => this.error(`Không tìm thấy ${entityType}!`),
  };

  // Generic entity operations - can be used for any entity type
  entity = {
    createSuccess: (entityName, itemName = '') => {
      const message = itemName 
        ? `Thêm ${entityName} "${itemName}" thành công!`
        : `Thêm ${entityName} thành công!`;
      this.success(message);
    },
    updateSuccess: (entityName, itemName = '') => {
      const message = itemName 
        ? `Cập nhật ${entityName} "${itemName}" thành công!`
        : `Cập nhật ${entityName} thành công!`;
      this.success(message);
    },
    deleteSuccess: (entityName, itemName = '') => {
      const message = itemName 
        ? `Đã xóa ${entityName} "${itemName}" thành công!`
        : `Xóa ${entityName} thành công!`;
      this.success(message);
    },
    notFound: (entityName) => this.error(`Không tìm thấy ${entityName}!`),
    deleteConfirm: (entityName, itemName) => {
      this.warning(`Bạn sắp xóa ${entityName}: ${itemName}`);
    },
    editing: (entityName, itemName) => {
      this.info(`Đang chỉnh sửa ${entityName}: ${itemName}`);
    },
    createStart: (entityName) => {
      this.info(`Bắt đầu thêm ${entityName} mới`);
    },
    cancelDelete: (entityName) => {
      this.info(`Đã hủy xóa ${entityName}`);
    },
    updateFailed: (entityName) => {
      this.error(`Cập nhật ${entityName} thất bại!`);
    }
  };
  // Page specific methods - only for truly unique functionality
  datMonAn = {
    success: () => this.success(PAGE_MESSAGES.DATMONAN.SUCCESS),
    // Sử dụng generic methods cho các operations khác:
    // toastService.crud.success.update('chi tiết đặt món');
    // toastService.crud.success.delete('chi tiết đặt món');
    // toastService.crud.cancel.delete();
    // toastService.crud.error.create('chi tiết đặt bàn');
    // toastService.crud.error.update('chi tiết đặt bàn');
    // toastService.crud.error.delete('chi tiết đặt bàn');
  };

  datDichVu = {
    success: () => this.success(PAGE_MESSAGES.DATDICHVU.SUCCESS),
    // Sử dụng generic methods cho các operations khác:
    // toastService.crud.success.update('chi tiết dịch vụ');
    // toastService.crud.success.delete('chi tiết dịch vụ');
    // toastService.crud.cancel.delete();
    // toastService.crud.error.create('chi tiết dịch vụ');
    // toastService.crud.error.update('chi tiết dịch vụ');
    // toastService.crud.error.delete('chi tiết dịch vụ');
  };
  hoaDon = {
    serviceAdded: () => this.success(PAGE_MESSAGES.HOADON.SERVICE_ADDED),
    dishAdded: () => this.success(PAGE_MESSAGES.HOADON.DISH_ADDED),
    serviceUpdated: () => this.success(PAGE_MESSAGES.HOADON.SERVICE_UPDATED),
    dishUpdated: () => this.success(PAGE_MESSAGES.HOADON.DISH_UPDATED),
    serviceRemoved: () => this.success(PAGE_MESSAGES.HOADON.SERVICE_REMOVED),
    dishRemoved: () => this.success(PAGE_MESSAGES.HOADON.DISH_REMOVED),
    serviceAlreadySelected: () => this.warning(PAGE_MESSAGES.HOADON.SERVICE_ALREADY_SELECTED),
    dishAlreadySelected: () => this.warning(PAGE_MESSAGES.HOADON.DISH_ALREADY_SELECTED),
    paymentSuccess: () => this.success(PAGE_MESSAGES.HOADON.PAYMENT_SUCCESS),
    paymentFailed: () => this.error(PAGE_MESSAGES.HOADON.PAYMENT_FAILED),
  };
  baoCao = {
    generateSuccess: () => this.success(PAGE_MESSAGES.BAOCAO.GENERATE_SUCCESS),
    generateFailed: () => this.error(PAGE_MESSAGES.BAOCAO.GENERATE_FAILED),
  };

  thamSo = {
    searchSuccess: (count) => this.success(PAGE_MESSAGES.THAMSO.SEARCH_SUCCESS(count)),
    noParamsFound: () => this.warning(PAGE_MESSAGES.THAMSO.NO_PARAMS_FOUND),
    editing: () => this.info(PAGE_MESSAGES.THAMSO.EDITING),
    closeEdit: () => this.info(PAGE_MESSAGES.THAMSO.CLOSE_EDIT),
    saveEdit: () => this.success(PAGE_MESSAGES.THAMSO.SAVE_EDIT),
  };

  phieuDatTiec = {
    bookingSuccess: () => this.success(PAGE_MESSAGES.PHIEUDATTIEC.BOOKING_SUCCESS),
    bookingFailed: () => this.error(PAGE_MESSAGES.PHIEUDATTIEC.BOOKING_FAILED),
    cancelBooking: () => this.info(PAGE_MESSAGES.PHIEUDATTIEC.CANCEL_BOOKING),
    confirmBooking: () => this.success(PAGE_MESSAGES.PHIEUDATTIEC.CONFIRM_BOOKING),
  };

  user = {
    loginSuccess: () => this.success(PAGE_MESSAGES.USER.LOGIN_SUCCESS),
    loginFailed: () => this.error(PAGE_MESSAGES.USER.LOGIN_FAILED),
    logoutSuccess: () => this.success(PAGE_MESSAGES.USER.LOGOUT_SUCCESS),
    registerSuccess: () => this.success(PAGE_MESSAGES.USER.REGISTER_SUCCESS),
    registerFailed: () => this.error(PAGE_MESSAGES.USER.REGISTER_FAILED),
    changePasswordSuccess: () => this.success(PAGE_MESSAGES.USER.CHANGE_PASSWORD_SUCCESS),
    changePasswordFailed: () => this.error(PAGE_MESSAGES.USER.CHANGE_PASSWORD_FAILED),
    permissionDenied: () => this.error(PAGE_MESSAGES.USER.PERMISSION_DENIED),
  };
  quyen = {
    assignSuccess: () => this.success(PAGE_MESSAGES.QUYEN.ASSIGN_SUCCESS),
    assignFailed: () => this.error(PAGE_MESSAGES.QUYEN.ASSIGN_FAILED),
  };

  nhom = {
    addUserSuccess: () => this.success(PAGE_MESSAGES.NHOM.ADD_USER_SUCCESS),
    addUserFailed: () => this.error(PAGE_MESSAGES.NHOM.ADD_USER_FAILED),
    removeUserSuccess: () => this.success(PAGE_MESSAGES.NHOM.REMOVE_USER_SUCCESS),
    removeUserFailed: () => this.error(PAGE_MESSAGES.NHOM.REMOVE_USER_FAILED),
  };

  // File operations
  file = {
    printError: (error) => this.error(COMMON_MESSAGES.FILE.PRINT_ERROR(error)),
    exportError: (error) => this.error(COMMON_MESSAGES.FILE.EXPORT_ERROR(error)),
    noPrintData: () => this.warning(COMMON_MESSAGES.FILE.NO_DATA_PRINT),
    noExportData: () => this.warning(COMMON_MESSAGES.FILE.NO_DATA_EXPORT),
    exportSuccess: () => this.success(COMMON_MESSAGES.FILE.EXPORT_SUCCESS),
  };

  // Utility method to dismiss all toasts
  dismissAll() {
    toast.dismiss();
  }

  // Custom toast with custom styling
  custom(message, type = 'default', options = {}) {
    switch (type) {
      case 'success':
        return this.success(message, options);
      case 'error':
        return this.error(message, options);
      case 'warning':
        return this.warning(message, options);
      case 'info':
        return this.info(message, options);
      default:
        return toast(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          ...options
        });
    }
  }
}

// Export singleton instance
const toastService = new ToastService();
export default toastService;

// Export for named imports
export { toastService };
