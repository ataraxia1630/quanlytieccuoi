import { toast } from 'react-toastify';
import smartToast from '../../components/SmartToast';

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
  // Helper method to generate unique toast IDs
  generateToastId(type, context = '') {
    return context ? `${type}-${context}` : type;
  }  // Basic toast methods using smartToast to prevent spam
  success(message, toastId = null, options = {}) {
    const id = toastId || this.generateToastId('success', message.substring(0, 20));
    smartToast('success', message, id, options);
  }

  error(message, toastId = null, options = {}) {
    const id = toastId || this.generateToastId('error', message.substring(0, 20));
    smartToast('error', message, id, options);
  }

  warning(message, toastId = null, options = {}) {
    const id = toastId || this.generateToastId('warning', message.substring(0, 20));
    smartToast('warning', message, id, options);
  }

  info(message, toastId = null, options = {}) {
    const id = toastId || this.generateToastId('info', message.substring(0, 20));
    smartToast('info', message, id, options);
  }
  // Common CRUD operations with unique IDs to prevent spam
  crud = {
    success: {
      create: (itemName = '') => {
        const message = itemName ? `Thêm ${itemName} thành công!` : COMMON_MESSAGES.CRUD.SUCCESS.CREATE;
        this.success(message, 'crud-create-success');
      },
      update: (itemName = '') => {
        const message = itemName ? `Cập nhật ${itemName} thành công!` : COMMON_MESSAGES.CRUD.SUCCESS.UPDATE;
        this.success(message, 'crud-update-success');
      },
      delete: (itemName = '') => {
        const message = itemName ? `Xóa ${itemName} thành công!` : COMMON_MESSAGES.CRUD.SUCCESS.DELETE;
        this.success(message, 'crud-delete-success');
      },
      save: () => this.success(COMMON_MESSAGES.CRUD.SUCCESS.SAVE, 'crud-save-success'),
    },
    error: {
      create: (itemName = '') => {
        const message = itemName ? `Thêm ${itemName} thất bại!` : COMMON_MESSAGES.CRUD.ERROR.CREATE_FAILED;
        this.error(message, 'crud-create-error');
      },
      update: (itemName = '') => {
        const message = itemName ? `Cập nhật ${itemName} thất bại!` : COMMON_MESSAGES.CRUD.ERROR.UPDATE_FAILED;
        this.error(message, 'crud-update-error');
      },
      delete: (itemName = '') => {
        const message = itemName ? `Xóa ${itemName} thất bại!` : COMMON_MESSAGES.CRUD.ERROR.DELETE_FAILED;
        this.error(message, 'crud-delete-error');
      },
      generic: () => this.error(COMMON_MESSAGES.CRUD.ERROR.GENERIC, 'crud-generic-error'),
    },
    processing: {
      loading: () => this.info(COMMON_MESSAGES.CRUD.PROCESSING.LOADING, 'crud-loading'),
      saving: () => this.info(COMMON_MESSAGES.CRUD.PROCESSING.SAVING, 'crud-saving'),
      deleting: () => this.info(COMMON_MESSAGES.CRUD.PROCESSING.DELETING, 'crud-deleting'),
    },
    cancel: {
      delete: () => this.info(COMMON_MESSAGES.CRUD.CANCEL.DELETE, 'crud-cancel-delete'),
      edit: () => this.info(COMMON_MESSAGES.CRUD.CANCEL.EDIT, 'crud-cancel-edit'),
      create: () => this.info(COMMON_MESSAGES.CRUD.CANCEL.CREATE, 'crud-cancel-create'),
    }
  };  // Enhanced search operations with entity type and unique IDs
  search = {
    success: (count, entityType = '') => {
      const message = entityType 
        ? `Đã tìm thấy ${count} ${entityType} phù hợp`
        : COMMON_MESSAGES.SEARCH.SUCCESS(count);
      this.success(message, `search-success-${entityType}`);
    },
    noResults: (entityType = '') => {
      const message = entityType
        ? `Không tìm thấy ${entityType} nào phù hợp`
        : COMMON_MESSAGES.SEARCH.NO_RESULTS;
      this.warning(message, `search-no-results-${entityType}`);
    },
    emptyKeyword: () => this.warning(COMMON_MESSAGES.SEARCH.EMPTY_KEYWORD, 'search-empty-keyword'),
    appliedFilter: (filterType = '') => {
      this.success(COMMON_MESSAGES.SEARCH.APPLIED_FILTER, `filter-applied-${filterType}`);
    },
    resetFilter: (filterType = '') => {
      this.info(COMMON_MESSAGES.SEARCH.RESET_FILTER, `filter-reset-${filterType}`);
    },
  };
  // Enhanced validation with entity context and unique IDs
  validation = {
    requiredFields: () => this.warning(COMMON_MESSAGES.VALIDATION.REQUIRED_FIELDS, 'validation-required-fields'),
    invalidData: () => this.error(COMMON_MESSAGES.VALIDATION.INVALID_DATA, 'validation-invalid-data'),
    checkInfo: () => this.warning(COMMON_MESSAGES.VALIDATION.CHECK_INFO, 'validation-check-info'),
    notFound: (entityType = 'dữ liệu') => this.error(`Không tìm thấy ${entityType}!`, `validation-not-found-${entityType}`),
  };
  // Generic entity operations with unique IDs - can be used for any entity type
  entity = {
    createSuccess: (entityName, itemName = '') => {
      const message = itemName 
        ? `Thêm ${entityName} "${itemName}" thành công!`
        : `Thêm ${entityName} thành công!`;
      this.success(message, `entity-create-${entityName}`);
    },
    updateSuccess: (entityName, itemName = '') => {
      const message = itemName 
        ? `Cập nhật ${entityName} "${itemName}" thành công!`
        : `Cập nhật ${entityName} thành công!`;
      this.success(message, `entity-update-${entityName}`);
    },
    deleteSuccess: (entityName, itemName = '') => {
      const message = itemName 
        ? `Đã xóa ${entityName} "${itemName}" thành công!`
        : `Xóa ${entityName} thành công!`;
      this.success(message, `entity-delete-${entityName}`);
    },
    notFound: (entityName) => this.error(`Không tìm thấy ${entityName}!`, `entity-not-found-${entityName}`),
    deleteConfirm: (entityName, itemName) => {
      this.warning(`Bạn sắp xóa ${entityName}: ${itemName}`, `entity-delete-confirm-${entityName}`);
    },
    editing: (entityName, itemName) => {
      this.info(`Đang chỉnh sửa ${entityName}: ${itemName}`, `entity-editing-${entityName}`);
    },
    createStart: (entityName) => {
      this.info(`Bắt đầu thêm ${entityName} mới`, `entity-create-start-${entityName}`);
    },
    cancelDelete: (entityName) => {
      this.info(`Đã hủy xóa ${entityName}`, `entity-cancel-delete-${entityName}`);
    },
    updateFailed: (entityName) => {
      this.error(`Cập nhật ${entityName} thất bại!`, `entity-update-failed-${entityName}`);
    }
  };  // Page specific methods - only for truly unique functionality
  datMonAn = {
    success: () => this.success(PAGE_MESSAGES.DATMONAN.SUCCESS, 'datmonan-success'),
    // Sử dụng generic methods cho các operations khác:
    // toastService.crud.success.update('chi tiết đặt món');
    // toastService.crud.success.delete('chi tiết đặt món');
    // toastService.crud.cancel.delete();
    // toastService.crud.error.create('chi tiết đặt bàn');
    // toastService.crud.error.update('chi tiết đặt bàn');
    // toastService.crud.error.delete('chi tiết đặt bàn');
  };

  datDichVu = {
    success: () => this.success(PAGE_MESSAGES.DATDICHVU.SUCCESS, 'datdichvu-success'),
    // Sử dụng generic methods cho các operations khác:
    // toastService.crud.success.update('chi tiết dịch vụ');
    // toastService.crud.success.delete('chi tiết dịch vụ');
    // toastService.crud.cancel.delete();
    // toastService.crud.error.create('chi tiết dịch vụ');
    // toastService.crud.error.update('chi tiết dịch vụ');
    // toastService.crud.error.delete('chi tiết dịch vụ');
  };  hoaDon = {
    serviceAdded: () => this.success(PAGE_MESSAGES.HOADON.SERVICE_ADDED, 'hoadon-service-added'),
    dishAdded: () => this.success(PAGE_MESSAGES.HOADON.DISH_ADDED, 'hoadon-dish-added'),
    serviceUpdated: () => this.success(PAGE_MESSAGES.HOADON.SERVICE_UPDATED, 'hoadon-service-updated'),
    dishUpdated: () => this.success(PAGE_MESSAGES.HOADON.DISH_UPDATED, 'hoadon-dish-updated'),
    serviceRemoved: () => this.success(PAGE_MESSAGES.HOADON.SERVICE_REMOVED, 'hoadon-service-removed'),
    dishRemoved: () => this.success(PAGE_MESSAGES.HOADON.DISH_REMOVED, 'hoadon-dish-removed'),
    serviceAlreadySelected: () => this.warning(PAGE_MESSAGES.HOADON.SERVICE_ALREADY_SELECTED, 'hoadon-service-already-selected'),
    dishAlreadySelected: () => this.warning(PAGE_MESSAGES.HOADON.DISH_ALREADY_SELECTED, 'hoadon-dish-already-selected'),
    paymentSuccess: () => this.success(PAGE_MESSAGES.HOADON.PAYMENT_SUCCESS, 'hoadon-payment-success'),
    paymentFailed: () => this.error(PAGE_MESSAGES.HOADON.PAYMENT_FAILED, 'hoadon-payment-failed'),
  };  baoCao = {
    generateSuccess: () => this.success(PAGE_MESSAGES.BAOCAO.GENERATE_SUCCESS, 'baocao-generate-success'),
    generateFailed: () => this.error(PAGE_MESSAGES.BAOCAO.GENERATE_FAILED, 'baocao-generate-failed'),
  };

  thamSo = {
    searchSuccess: (count) => this.success(PAGE_MESSAGES.THAMSO.SEARCH_SUCCESS(count), 'thamso-search-success'),
    noParamsFound: () => this.warning(PAGE_MESSAGES.THAMSO.NO_PARAMS_FOUND, 'thamso-no-params-found'),
    editing: () => this.info(PAGE_MESSAGES.THAMSO.EDITING, 'thamso-editing'),
    closeEdit: () => this.info(PAGE_MESSAGES.THAMSO.CLOSE_EDIT, 'thamso-close-edit'),
    saveEdit: () => this.success(PAGE_MESSAGES.THAMSO.SAVE_EDIT, 'thamso-save-edit'),
  };

  phieuDatTiec = {
    bookingSuccess: () => this.success(PAGE_MESSAGES.PHIEUDATTIEC.BOOKING_SUCCESS, 'phieudattiec-booking-success'),
    bookingFailed: () => this.error(PAGE_MESSAGES.PHIEUDATTIEC.BOOKING_FAILED, 'phieudattiec-booking-failed'),
    cancelBooking: () => this.info(PAGE_MESSAGES.PHIEUDATTIEC.CANCEL_BOOKING, 'phieudattiec-cancel-booking'),
    confirmBooking: () => this.success(PAGE_MESSAGES.PHIEUDATTIEC.CONFIRM_BOOKING, 'phieudattiec-confirm-booking'),
  };

  user = {
    loginSuccess: () => this.success(PAGE_MESSAGES.USER.LOGIN_SUCCESS, 'user-login-success'),
    loginFailed: () => this.error(PAGE_MESSAGES.USER.LOGIN_FAILED, 'user-login-failed'),
    logoutSuccess: () => this.success(PAGE_MESSAGES.USER.LOGOUT_SUCCESS, 'user-logout-success'),
    registerSuccess: () => this.success(PAGE_MESSAGES.USER.REGISTER_SUCCESS, 'user-register-success'),
    registerFailed: () => this.error(PAGE_MESSAGES.USER.REGISTER_FAILED, 'user-register-failed'),
    changePasswordSuccess: () => this.success(PAGE_MESSAGES.USER.CHANGE_PASSWORD_SUCCESS, 'user-change-password-success'),
    changePasswordFailed: () => this.error(PAGE_MESSAGES.USER.CHANGE_PASSWORD_FAILED, 'user-change-password-failed'),
    permissionDenied: () => this.error(PAGE_MESSAGES.USER.PERMISSION_DENIED, 'user-permission-denied'),
  };  quyen = {
    assignSuccess: () => this.success(PAGE_MESSAGES.QUYEN.ASSIGN_SUCCESS, 'quyen-assign-success'),
    assignFailed: () => this.error(PAGE_MESSAGES.QUYEN.ASSIGN_FAILED, 'quyen-assign-failed'),
  };

  nhom = {
    addUserSuccess: () => this.success(PAGE_MESSAGES.NHOM.ADD_USER_SUCCESS, 'nhom-add-user-success'),
    addUserFailed: () => this.error(PAGE_MESSAGES.NHOM.ADD_USER_FAILED, 'nhom-add-user-failed'),
    removeUserSuccess: () => this.success(PAGE_MESSAGES.NHOM.REMOVE_USER_SUCCESS, 'nhom-remove-user-success'),
    removeUserFailed: () => this.error(PAGE_MESSAGES.NHOM.REMOVE_USER_FAILED, 'nhom-remove-user-failed'),
  };
  // File operations with unique IDs
  file = {
    printError: (error) => this.error(COMMON_MESSAGES.FILE.PRINT_ERROR(error), 'file-print-error'),
    exportError: (error) => this.error(COMMON_MESSAGES.FILE.EXPORT_ERROR(error), 'file-export-error'),
    noPrintData: () => this.warning(COMMON_MESSAGES.FILE.NO_DATA_PRINT, 'file-no-print-data'),
    noExportData: () => this.warning(COMMON_MESSAGES.FILE.NO_DATA_EXPORT, 'file-no-export-data'),
    exportSuccess: () => this.success(COMMON_MESSAGES.FILE.EXPORT_SUCCESS, 'file-export-success'),
  };
  // Utility method to dismiss all toasts
  dismissAll() {
    toast.dismiss();
  }  // Clear toast cache (useful for testing or cleanup)
  clearCache() {
    smartToast.clearCache();
  }

  // Get cache status for debugging
  getCacheStatus() {
    return smartToast.getCacheStatus();
  }  // Custom toast with custom styling and unique IDs
  custom(message, type = 'default', toastId = null, options = {}) {
    const id = toastId || this.generateToastId(`custom-${type}`, message.substring(0, 20));
    
    switch (type) {
      case 'success':
        return this.success(message, id, options);
      case 'error':
        return this.error(message, id, options);
      case 'warning':
        return this.warning(message, id, options);
      case 'info':
        return this.info(message, id, options);
      default:
        smartToast('info', message, id, options);
    }
  }
}

// Export singleton instance
const toastService = new ToastService();
export default toastService;

// Export for named imports
export { toastService };
