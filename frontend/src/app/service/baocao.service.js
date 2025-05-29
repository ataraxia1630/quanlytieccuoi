const baseURL = 'http://localhost:25053/api/baocao';

const BaoCaoThangService = {
  getMonthlyReport: async (month, year) => {
    if (!month || !year) {
      throw new Error('Tháng và năm không được để trống!');
    }
    const uri = `${baseURL}/${year}/${month}`;
    console.log('Request URL:', uri);
    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Không thể lấy báo cáo!');
    }
    const result = await res.json();
    return result;
  },

  exportMonthlyReport: async (month, year) => {
    if (!month || !year) {
      throw new Error('Tháng và năm không được để trống!');
    }
    const uri = `${baseURL}/export/${year}/${month}`;
    console.log('Export URL:', uri);
    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Không thể xuất báo cáo!');
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
