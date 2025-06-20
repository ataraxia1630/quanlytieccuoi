import { useState, useEffect, useRef } from 'react';
import './BaoCaoThang.css';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'chart.js/auto';

import { Box, Typography, CircularProgress, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ToastContainer, toast } from 'react-toastify';

import FormTextField from '../../components/Formtextfield';
import CustomTable from '../../components/Customtable';
import ReportColumns from '../../components/baocao/baocao_column';
import BaoCaoThangService from '../../service/baocao.service';

import toastService from '../../service/toast/toast.service';

export default function BaoCaoThang() {
  //#region declaration
  const today = new Date();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [reportData, setReportData] = useState([]);
  const [totalDoanhThu, setTotalDoanhThu] = useState(0);
  const [totalTiecCuoi, setTotalTiecCuoi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ month: '', year: '' });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const formattedDate = today.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const [reportDate, setReportDate] = useState(formattedDate);
  const [reportTitleDate, setReportTitleDate] = useState({
    month: '',
    year: '',
  });
  //#endregion

  //#region func handler
  const fetchReport = async () => {
    setLoading(true);
    //------------- the real one -------------
    try {
      const result = await BaoCaoThangService.getMonthlyReport(month, year);
      const baocao = result.baocao || {};
      const ctData = baocao.Ct_BaoCaoTheoNgays || [];
      setReportData(ctData);
      setTotalDoanhThu(baocao.TongDoanhThu || 0);
      setTotalTiecCuoi(ctData.reduce((sum, item) => sum + item.SoLuongTiec, 0));
      setReportDate(
        new Date(baocao.NgayLap).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
      setReportTitleDate({ month: baocao.Thang, year: baocao.Nam });
      toastService.success('Lấy báo cáo thành công!');
    } catch (error) {
      console.log('Error fetching report:', error.message);
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

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    if (!month || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      tempErrors.month = 'Tháng phải là số từ 1 đến 12';
      isValid = false;
    } else if (yearNum === thisYear && monthNum > thisMonth) {
      tempErrors.month = 'Tháng chưa kết thúc nên chưa thể xem báo cáo';
      isValid = false;
    }
    if (!year || isNaN(yearNum) || yearNum < 2000 || yearNum > thisYear) {
      tempErrors.year = `Năm phải là số từ 2000 đến ${thisYear}`;
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleViewReport = () => {
    if (validate()) {
      fetchReport();
    } else toastService.validation.checkInfo();
  };

  const handleExportReport = async () => {
    if (reportData.length === 0) {
      toastService.file.noExportData();
      return;
    }
    try {
      await BaoCaoThangService.exportMonthlyReport(month, year);
      toastService.file.exportSuccess();
    } catch (error) {
      toastService.file.exportError();
    }
  };

  const handlePrintReport = () => {
    if (reportData.length === 0) {
      toastService.file.noPrintData();
      return;
    }
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(
      `<html><head><title>Báo cáo doanh thu tháng ${
        month < 10 ? '0' + month : month
      } / ${year} </title>`
    );
    printWindow.document.write(
      '<style>' +
        'body { text-align: center; font-family: Arial, sans-serif; }' +
        'h1 { text-align: center; }' +
        'p { text-align: center; margin: 10px 0; }' +
        'table { border-collapse: collapse; width: 80%; margin: 0 auto; }' + // Căn giữa bảng với chiều rộng 80%
        'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }' +
        'th { background-color: #f2f2f2; text-align: center; }' + // Căn giữa tiêu đề cột
        'td { text-align: center; }' + // Căn phải dữ liệu trong ô để dễ đọc số
        '</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write(
      `<h1>Báo cáo doanh thu tháng ${
        month < 10 ? '0' + month : month
      } / ${year}</h1>`
    );
    printWindow.document.write(`<p>Ngày lập báo cáo: ${reportDate}</p>`);
    printWindow.document.write(
      `<p>Tổng doanh thu: ${parseFloat(totalDoanhThu).toLocaleString(
        'vi-VN'
      )} VNĐ</p>`
    );
    printWindow.document.write(`<p>Tổng số tiệc cưới: ${totalTiecCuoi}</p>`);
    printWindow.document.write(
      '<table><tr><th>Ngày</th><th>Số lượng tiệc cưới</th><th>Doanh thu (VNĐ)</th><th>Tỷ lệ (%)</th></tr>'
    );
    reportData.forEach((row) => {
      // Format ngày từ YYYY-MM-DDTHH:mm:ss.SSSZ thành DD/MM/YYYY
      let formattedDate = row.Ngay;
      const dateParts = row.Ngay.split('-');
      if (dateParts.length === 3) {
        const day = dateParts[2].split('T')[0]; // Lấy ngày, loại bỏ phần thời gian
        formattedDate = `${day}/${dateParts[1]}/${dateParts[0]}`; // Định dạng thành DD/MM/YYYY
      }

      // Format doanh thu
      const formattedDoanhThu = row.DoanhThu
        ? new Intl.NumberFormat('vi-VN').format(row.DoanhThu)
        : '0';

      printWindow.document.write(
        `<tr><td>${formattedDate}</td><td>${
          row.SoLuongTiec
        }</td><td>${formattedDoanhThu}</td><td>${parseFloat(row.TiLe).toFixed(
          2
        )}</td></tr>`
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
        labels: data.map((row) => {
          const dateParts = row.Ngay.split('-');
          if (dateParts.length === 3) {
            const day = dateParts[2].split('T')[0];
            return `${day}/${dateParts[1]}/${dateParts[0]}`;
          }
          return row.Ngay;
        }),
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
    if (reportData.length > 0) {
      drawChart(reportData);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [reportData]);

  useEffect(() => {
    if (month || year) {
      validate();
    }
  }, [month, year]);

  //#endregion

  //#region ui
  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Báo cáo doanh thu
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          mb: 3,
        }}
      >
        <Box width={150}>
          <FormTextField
            label="Tháng"
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            error={!!errors.month}
            helperText={errors.month}
            fullWidth="false"
          />
        </Box>
        <Box width={150}>
          <FormTextField
            label="Năm"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            error={!!errors.year}
            helperText={errors.year}
            width="150"
            fullWidth={false}
          />
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#063F5C',
            '&:hover': { backgroundColor: '#045b7a' },
            height: 56,
            textTransform: 'none',
          }}
          onClick={handleViewReport}
          disabled={loading}
          startIcon={<RemoveRedEyeIcon />}
        >
          Xem báo cáo
        </Button>
      </Box>

      {reportTitleDate.month && reportTitleDate.year && reportData && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#063F5C', mt: 2, mb: 4 }}
          >
            BÁO CÁO THÁNG {reportTitleDate.month} / {reportTitleDate.year}
          </Typography>
          <Typography sx={{ mt: 2 }}>Ngày lập báo cáo: {reportDate}</Typography>
          <Typography sx={{ mt: 2 }}>
            Tổng doanh thu: {parseFloat(totalDoanhThu).toLocaleString('vi-VN')}{' '}
            VNĐ
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Tổng tiệc cưới: {totalTiecCuoi}
          </Typography>
        </Box>
      )}

      {reportData.length > 0 && (
        <Box sx={{ justifyContent: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '20px',
              mb: 2,
              marginRight: '50px',
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#063F5C',
                '&:hover': { backgroundColor: '#045b7a' },
                textTransform: 'none',
              }}
              onClick={handleExportReport}
              startIcon={<FileDownloadIcon />}
            >
              Xuất báo cáo
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#063F5C',
                '&:hover': { backgroundColor: '#045b7a' },
                textTransform: 'none',
              }}
              onClick={handlePrintReport}
              startIcon={<PrintIcon />}
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
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      )}
    </Box>
  );
  //#endregion
}
