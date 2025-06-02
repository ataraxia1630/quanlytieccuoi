import { useState, useEffect, useRef } from 'react';
import './BaoCaoThang.css';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'chart.js/auto';

import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import FormTextField from '../../components/Formtextfield';
import CustomTable from '../../components/Customtable';
import ReportColumns from '../../components/baocao/baocao_column';
import BaoCaoThangService from '../../service/baocao.service';

export default function BaoCaoThang() {
  //#region declaration
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [reportData, setReportData] = useState([]);
  const [totalDoanhThu, setTotalDoanhThu] = useState(0);
  const [totalTiecCuoi, setTotalTiecCuoi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ month: '', year: '' });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  //#endregion

  //#region mock data
  const mockReportData = {
    baocao: {
      MaBC: 'BCT052025',
      Thang: 5,
      Nam: 2025,
      NgayLap: new Date().toISOString(),
      TongDoanhThu: 250000000, // Tổng doanh thu từ dữ liệu chi tiết
      Ct_BaoCaoTheoNgays: [
        { Ngay: '01/05/2025', SoLuongTiec: 5, DoanhThu: 55000000, TiLe: 20.0 },
        { Ngay: '02/05/2025', SoLuongTiec: 3, DoanhThu: 30000000, TiLe: 12.0 },
        { Ngay: '03/05/2025', SoLuongTiec: 4, DoanhThu: 48000000, TiLe: 16.0 },
        { Ngay: '04/05/2025', SoLuongTiec: 2, DoanhThu: 20000000, TiLe: 8.0 },
        { Ngay: '05/05/2025', SoLuongTiec: 6, DoanhThu: 60000000, TiLe: 24.0 },
        { Ngay: '06/05/2025', SoLuongTiec: 1, DoanhThu: 10000000, TiLe: 4.0 },
        { Ngay: '07/05/2025', SoLuongTiec: 3, DoanhThu: 31000000, TiLe: 12.0 },
        { Ngay: '08/05/2025', SoLuongTiec: 2, DoanhThu: 20000000, TiLe: 8.0 },
        { Ngay: '09/05/2025', SoLuongTiec: 4, DoanhThu: 40000000, TiLe: 16.0 },
        { Ngay: '10/05/2025', SoLuongTiec: 3, DoanhThu: 37000000, TiLe: 12.0 },
        { Ngay: '11/05/2025', SoLuongTiec: 5, DoanhThu: 50000000, TiLe: 20.0 },
        { Ngay: '12/05/2025', SoLuongTiec: 2, DoanhThu: 20000000, TiLe: 8.0 },
        { Ngay: '13/05/2025', SoLuongTiec: 3, DoanhThu: 30000000, TiLe: 12.0 },
        { Ngay: '14/05/2025', SoLuongTiec: 4, DoanhThu: 42500000, TiLe: 16.0 },
        { Ngay: '15/05/2025', SoLuongTiec: 1, DoanhThu: 10000000, TiLe: 4.0 },
      ],
    },
  };
  //#endregion

  //#region func handler
  const fetchReport = async () => {
    setLoading(true);
    //------------- the real one -------------
    // try {
    //   const result = await BaoCaoThangService.getMonthlyReport(month, year);
    //   const baocao = result.baocao || {};
    //   const ctData = baocao.Ct_BaoCaoTheoNgays || [];
    //   setReportData(ctData);
    //   setTotalDoanhThu(baocao.TongDoanhThu || 0);
    //   setTotalTiecCuoi(ctData.reduce((sum, item) => sum + item.SoLuongTiec, 0));
    //   toast.success('Lấy báo cáo thành công!');
    //   drawChart(ctData);
    // } catch (error) {
    //   console.log('Error fetching report:', error.message);
    //   toast.error(`Lỗi: ${error.message || 'Không thể tải báo cáo!'}`);
    // } finally {
    //   setLoading(false);
    // }

    //---------------mock - test---------------
    try {
      // Giả lập delay API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const baocao = mockReportData.baocao;
      const ctData = baocao.Ct_BaoCaoTheoNgays || [];
      setReportData(ctData);
      setTotalDoanhThu(baocao.TongDoanhThu || 0);
      setTotalTiecCuoi(ctData.reduce((sum, item) => sum + item.SoLuongTiec, 0));
      toast.success('Lấy báo cáo thành công (dữ liệu giả lập)!');
      drawChart(ctData);
    } catch (error) {
      console.log('Error fetching mock report:', error.message);
      toast.error(`Lỗi: ${error.message || 'Không thể tải báo cáo!'}`);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let tempErrors = { month: '', year: '' };
    let isValid = true;

    const monthNum = Number(month);
    const yearNum = Number(year);

    if (!month || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      tempErrors.month = 'Tháng phải là số từ 1 đến 12';
      isValid = false;
    }
    if (!year || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      tempErrors.year = 'Năm phải là số từ 2000 đến 2100';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleViewReport = () => {
    if (validate()) {
      fetchReport();
    }
  };

  const handleExportReport = async () => {
    if (reportData.length === 0) {
      toast.error('Không có dữ liệu để xuất!');
      return;
    }
    try {
      await BaoCaoThangService.exportMonthlyReport(month, year);
      toast.success('Xuất báo cáo thành công!');
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể xuất báo cáo!'}`);
    }
  };

  const handlePrintReport = () => {
    if (reportData.length === 0) {
      toast.error('Không có dữ liệu để in!');
      return;
    }
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Báo cáo tháng</title>');
    printWindow.document.write(
      '<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>Báo cáo tháng ${month}/${year}</h1>`);
    printWindow.document.write(
      `<p>Tổng doanh thu: ${totalDoanhThu.toLocaleString('vi-VN')} VNĐ</p>`
    );
    printWindow.document.write(`<p>Tổng số tiệc cưới: ${totalTiecCuoi}</p>`);
    printWindow.document.write(
      '<table><tr><th>Ngày</th><th>Số lượng tiệc cưới</th><th>Doanh thu (VNĐ)</th><th>Tỷ lệ (%)</th></tr>'
    );
    reportData.forEach((row) => {
      printWindow.document.write(
        `<tr><td>${row.Ngay}</td><td>${row.SoLuongTiec
        }</td><td>${row.DoanhThu.toLocaleString(
          'vi-VN'
        )}</td><td>${row.TiLe.toFixed(2)}</td></tr>`
      );
    });
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const drawChart = (data) => {
    if (!chartRef.current || data.length === 0) return;

    // Hủy instance cũ nếu có
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((row) => row.Ngay),
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: data.map((row) => row.DoanhThu),
            backgroundColor: 'rgba(6, 63, 92, 0.2)',
            borderColor: 'rgba(6, 63, 92, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Doanh thu (VNĐ)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Ngày',
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  };

  //#endregion

  //#region useEffect
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  //#endregion

  //#region ui
  return (
    <Box>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Báo cáo tháng
      </Typography>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', gap: '20px', mb: 3 }}
      >
        <FormTextField
          label="Tháng"
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          error={!!errors.month}
          helperText={errors.month}
          sx={{ width: '150px' }}
        />
        <FormTextField
          label="Năm"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          error={!!errors.year}
          helperText={errors.year}
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#063F5C',
            '&:hover': { backgroundColor: '#045b7a' },
            height: 56,
          }}
          onClick={handleViewReport}
          disabled={loading}
        >
          Xem báo cáo
        </Button>
      </Box>

      {
        reportData.length > 0 && (
          <Box sx={{ justifyContent: 'center' }}>
            <Typography sx={{ mt: 2 }}>
              Ngày lập báo cáo: {formattedDate}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Tổng doanh thu: {totalDoanhThu.toLocaleString('vi-VN')} VNĐ
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Tổng tiệc cưới: {totalTiecCuoi}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '20px',
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#063F5C',
                  '&:hover': { backgroundColor: '#045b7a' },
                }}
                onClick={handleExportReport}
              >
                Xuất báo cáo
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#063F5C',
                  '&:hover': { backgroundColor: '#045b7a' },
                }}
                onClick={handlePrintReport}
              >
                In báo cáo
              </Button>
            </Box>
            <canvas
              ref={chartRef}
              width="600"
              height="300"
              style={{ margin: '50px', display: 'block' }}
            />
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CustomTable data={reportData} columns={ReportColumns} />
            </Box>
          </Box>
        )
      }

      {
        loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )
      }
    </Box >
  );
  //#endregion
}
