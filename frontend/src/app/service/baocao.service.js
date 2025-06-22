const baseURL = '/api/baocao';

const BaoCaoThangService = {
  getMonthlyReport: async (month, year) => {
    if (!month || !year) {
      throw new Error('Tháng và năm không được để trống!');
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const uri = `${baseURL}/${year}/${month}`;
    console.log('Request URL:', uri);
    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 403)
        throw new Error(
          'Bạn không có quyền thực hiện thao tác này. Vui lòng đặng nhập lại để đồng bộ quyền.'
        );
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy báo cáo!');
    }
    const result = await res.json();
    return result;
  },

  exportMonthlyReport: async (month, year) => {
    if (!month || !year) {
      throw new Error('Tháng và năm không được để trống!');
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const uri = `${baseURL}/export/${year}/${month}`;
    console.log('Export URL:', uri);
    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 403)
        throw new Error(
          'Bạn không có quyền thực hiện thao tác này. Vui lòng đặng nhập lại để đồng bộ quyền.'
        );
      const error = await res.json();
      throw new Error(error.message || 'Không thể xuất báo cáo!');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCao_${month >= 10 ? month : `0${month}`}_${year}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  },
};

export default BaoCaoThangService;
