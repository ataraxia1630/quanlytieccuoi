// import React, { useState, useEffect, useRef } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
// import './HallList.css'; // Bạn cần tạo file CSS riêng
// import { uploadHallImage, createHall, updateHall } from '../../services/sanh.service';



// const HallList = () => {
//     // State cho danh sách sảnh
//     const [halls, setHalls] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);

//     // State cho bộ lọc và tìm kiếm
//     const [showFilter, setShowFilter] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [hallTypeFilter, setHallTypeFilter] = useState('');
//     const [minCapacity, setMinCapacity] = useState('');
//     const [maxCapacity, setMaxCapacity] = useState('');

//     // State cho modal chỉnh sửa/thêm mới
//     const [modalOpen, setModalOpen] = useState(false);
//     const [editingHall, setEditingHall] = useState(null);
//     const [formData, setFormData] = useState({
//         name: '',
//         type: '',
//         capacity: '',
//         image: null,
//         notes: ''
//     });

//     // Refs
//     const observer = useRef();
//     const lastHallElementRef = useRef();

//     // Danh sách các loại sảnh (mock data)
//     const hallTypes = [
//         { id: 'LS001', name: 'Sảnh VIP' },
//         { id: 'LS002', name: 'Sảnh tiêu chuẩn' },
//         { id: 'LS003', name: 'Sảnh ngoài trời' },
//     ];

//     // Hàm fetch dữ liệu từ API
//     useEffect(() => {
//         const fetchHalls = async () => {
//             try {
//                 setLoading(true);
//                 // Đây là nơi bạn sẽ gọi API thực tế
//                 // const response = await axios.get(`/api/halls?page=${page}&search=${searchTerm}&type=${hallTypeFilter}&minCapacity=${minCapacity}&maxCapacity=${maxCapacity}`);

//                 // Mock data cho ví dụ
//                 setTimeout(() => {
//                     const mockData = [
//                         { id: 1, code: 'S001', name: 'Sảnh tiệc Smith\'s', typeCode: 'LS001', typeName: 'Sảnh VIP', capacity: 150, image: 'https://via.placeholder.com/100', notes: 'Sảnh cao cấp' },
//                         { id: 2, code: 'S002', name: 'Sảnh tiệc Maya', typeCode: 'LS002', typeName: 'Sảnh tiêu chuẩn', capacity: 200, image: 'https://via.placeholder.com/100', notes: 'Sảnh trung bình' },
//                         { id: 3, code: 'S003', name: 'Sảnh Tiệc Tamarind', typeCode: 'LS003', typeName: 'Sảnh ngoài trời', capacity: 250, image: 'https://via.placeholder.com/100', notes: 'Sảnh ngoài trời' },
//                     ];

//                     if (page === 1) {
//                         setHalls(mockData);
//                     } else {
//                         setHalls(prev => [...prev, ...mockData]);
//                     }

//                     setHasMore(mockData.length > 0 && page < 3); // Giả sử chỉ có 3 trang
//                     setLoading(false);
//                 }, 500);
//             } catch (error) {
//                 toast.error('Không thể kết nối đến máy chủ!');
//                 setLoading(false);
//             }
//         };

//         fetchHalls();
//     }, [page, searchTerm, hallTypeFilter, minCapacity, maxCapacity]);

//     // Setup Intersection Observer cho infinite scrolling
//     useEffect(() => {
//         if (loading) return;

//         if (observer.current) observer.current.disconnect();

//         observer.current = new IntersectionObserver(entries => {
//             if (entries[0].isIntersecting && hasMore) {
//                 setPage(prevPage => prevPage + 1);
//             }
//         });

//         if (lastHallElementRef.current) {
//             observer.current.observe(lastHallElementRef.current);
//         }

//         return () => {
//             if (observer.current) observer.current.disconnect();
//         };
//     }, [loading, hasMore]);

//     // Xử lý tìm kiếm
//     const handleSearch = (e) => {
//         e.preventDefault();
//         setPage(1);
//         // Thực hiện tìm kiếm - API call sẽ được kích hoạt bởi useEffect
//     };

//     // Xử lý lọc
//     const handleApplyFilter = () => {
//         setPage(1);
//         // Áp dụng bộ lọc - API call sẽ được kích hoạt bởi useEffect
//         setShowFilter(false);
//     };

//     // Mở modal thêm mới
//     const handleOpenAddModal = () => {
//         setEditingHall(null);
//         setFormData({
//             name: '',
//             type: '',
//             capacity: '',
//             image: null,
//             notes: ''
//         });
//         setModalOpen(true);
//     };

//     // Mở modal chỉnh sửa
//     const handleOpenEditModal = (hall) => {
//         setEditingHall(hall);
//         setFormData({
//             name: hall.name,
//             type: hall.typeCode,
//             capacity: hall.capacity,
//             image: hall.image,
//             notes: hall.notes || ''
//         });
//         setModalOpen(true);
//     };

//     // Xử lý thay đổi trong form
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     // Xử lý upload ảnh
//     const handleImageChange = (e) => {
//         try {
//             const file = e.target.files[0];
//             if (!file) return;

//             // Hiển thị ảnh preview trước khi upload
//             setFormData({
//                 ...formData,
//                 imagePreview: URL.createObjectURL(file),
//                 imageFile: file
//             });

//             // Nếu muốn upload ngay, có thể làm như sau:
//             // const uploadResult = await uploadHallImage(file);
//             // setFormData({
//             //   ...formData,
//             //   image: uploadResult.imageUrl,
//             //   imagePreview: URL.createObjectURL(file)
//             // });
//         } catch (error) {
//             toast.error('Không thể tải lên hình ảnh!');
//         }
//     };

//     // Xử lý lưu (thêm mới hoặc cập nhật)
//     const handleSave = async () => {
//         // Kiểm tra dữ liệu
//         if (!formData.name || !formData.type || !formData.capacity) {
//             toast.warning('Vui lòng nhập đầy đủ thông tin!');
//             return;
//         }

//         try {
//             setLoading(true);

//             // Upload ảnh nếu có
//             let imageUrl = formData.image;
//             if (formData.imageFile) {
//                 const uploadResult = await uploadHallImage(formData.imageFile);
//                 imageUrl = uploadResult.imageUrl;
//             }

//             const hallData = {
//                 name: formData.name,
//                 typeCode: formData.type,
//                 capacity: formData.capacity,
//                 image: imageUrl,
//                 notes: formData.notes
//             };

//             if (editingHall) {
//                 // Cập nhật sảnh hiện có
//                 await updateHall(editingHall.id, hallData);
//                 toast.success('Cập nhật thành công!');
//             } else {
//                 // Thêm sảnh mới
//                 await createHall(hallData);
//                 toast.success('Thêm mới thành công!');
//             }

//             // Refresh danh sách
//             setPage(1);
//             setModalOpen(false);
//             setLoading(false);
//         } catch (error) {
//             toast.error(editingHall ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
//             setLoading(false);
//         }
//     };

//     // Xử lý xóa sảnh
//     const handleDelete = async (hall) => {
//         // Hiển thị modal xác nhận
//         if (window.confirm('Bạn có chắc chắn muốn xóa sảnh này?')) {
//             try {
//                 setLoading(true);

//                 // Trong thực tế, bạn sẽ kiểm tra ràng buộc và gọi API DELETE
//                 // await axios.delete(`/api/halls/${hall.axios}`);

//                 // Mock delete
//                 setTimeout(() => {
//                     const filteredHalls = halls.filter(h => h.id !== hall.id);
//                     setHalls(filteredHalls);
//                     toast.success('Xóa thành công!');
//                     setLoading(false);
//                 }, 500);
//             } catch (error) {
//                 toast.error('Xóa thất bại!');
//                 setLoading(false);
//             }
//         }
//     };

//     // Render danh sách sảnh
//     const renderHalls = () => {
//         return halls.map((hall, index) => {
//             // Thêm ref cho phần tử cuối cùng để hỗ trợ infinite scrolling
//             if (halls.length === index + 1) {
//                 return (
//                     <tr key={hall.id} ref={lastHallElementRef}>
//                         <td>{index + 1}</td>
//                         <td>{hall.code}</td>
//                         <td>{hall.name}</td>
//                         <td>{hall.typeCode}</td>
//                         <td>{hall.capacity}</td>
//                         <td>
//                             <img src={hall.image} alt={hall.name} className="hall-image" />
//                         </td>
//                         <td>{hall.notes}</td>
//                         <td className="action-buttons">
//                             <button
//                                 className="edit-btn"
//                                 onClick={() => handleOpenEditModal(hall)}
//                             >
//                                 <FaEdit /> Sửa
//                             </button>
//                             <button
//                                 className="delete-btn"
//                                 onClick={() => handleDelete(hall)}
//                             >
//                                 <FaTrash /> Xóa
//                             </button>
//                         </td>
//                     </tr>
//                 );
//             } else {
//                 return (
//                     <tr key={hall.id}>
//                         <td>{index + 1}</td>
//                         <td>{hall.code}</td>
//                         <td>{hall.name}</td>
//                         <td>{hall.typeCode}</td>
//                         <td>{hall.capacity}</td>
//                         <td>
//                             <img src={hall.image} alt={hall.name} className="hall-image" />
//                         </td>
//                         <td>{hall.notes}</td>
//                         <td className="action-buttons">
//                             <button
//                                 className="edit-btn"
//                                 onClick={() => handleOpenEditModal(hall)}
//                             >
//                                 <FaEdit /> Sửa
//                             </button>
//                             <button
//                                 className="delete-btn"
//                                 onClick={() => handleDelete(hall)}
//                             >
//                                 <FaTrash /> Xóa
//                             </button>
//                         </td>
//                     </tr>
//                 );
//             }
//         });
//     };

//     return (
//         <div className="hall-list-container">
//             <ToastContainer position="top-right" autoClose={3000} />

//             <h1 className="page-title">Danh sách sảnh</h1>

//             {/* Phần tìm kiếm và nút chức năng */}
//             <div className="search-bar-container">
//                 <form onSubmit={handleSearch} className="search-form">
//                     <div className="search-input-container">
//                         <input
//                             type="text"
//                             placeholder="Tìm tên hoặc mã sảnh ..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="search-input"
//                         />
//                         <button type="submit" className="search-button">
//                             <FaSearch />
//                         </button>
//                     </div>
//                 </form>

//                 <div className="action-buttons-container">
//                     <button
//                         className="filter-button"
//                         onClick={() => setShowFilter(!showFilter)}
//                     >
//                         <FaFilter /> Filter
//                     </button>
//                     <button
//                         className="add-button"
//                         onClick={handleOpenAddModal}
//                     >
//                         <FaPlus /> Thêm
//                     </button>
//                 </div>
//             </div>

//             {/* Phần bộ lọc */}
//             {showFilter && (
//                 <div className="filter-container">
//                     <div className="filter-row">
//                         <div className="filter-column">
//                             <label>Mã loại sảnh:</label>
//                             <select
//                                 value={hallTypeFilter}
//                                 onChange={(e) => setHallTypeFilter(e.target.value)}
//                                 className="filter-select"
//                             >
//                                 <option value="">Tất cả</option>
//                                 {hallTypes.map(type => (
//                                     <option key={type.id} value={type.id}>{type.name}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="filter-column">
//                             <label>Số lượng bàn tối đa:</label>
//                             <div className="capacity-filter">
//                                 <input
//                                     type="number"
//                                     placeholder="Từ"
//                                     value={minCapacity}
//                                     onChange={(e) => setMinCapacity(e.target.value)}
//                                     className="capacity-input"
//                                     min="0"
//                                 />
//                                 <span>-</span>
//                                 <input
//                                     type="number"
//                                     placeholder="Đến"
//                                     value={maxCapacity}
//                                     onChange={(e) => setMaxCapacity(e.target.value)}
//                                     className="capacity-input"
//                                     min="0"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="filter-actions">
//                         <button
//                             className="apply-filter-button"
//                             onClick={handleApplyFilter}
//                         >
//                             <FaFilter /> Apply
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Bảng danh sách sảnh */}
//             <div className="table-container">
//                 <table className="hall-table">
//                     <thead>
//                         <tr>
//                             <th>STT</th>
//                             <th>Mã sảnh</th>
//                             <th>Tên sảnh</th>
//                             <th>Mã loại sảnh</th>
//                             <th>Số lượng bàn tối đa</th>
//                             <th>Hình ảnh</th>
//                             <th>Ghi chú</th>
//                             <th>Thao tác</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {renderHalls()}
//                     </tbody>
//                 </table>

//                 {loading && <div className="loading">Đang xử lý...</div>}
//                 {!loading && halls.length === 0 && <div className="no-data">Không có dữ liệu</div>}
//             </div>

//             {/* Modal chỉnh sửa/thêm mới */}
//             {modalOpen && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h2>{editingHall ? 'Chỉnh sửa sảnh' : 'Thêm sảnh mới'}</h2>
//                             <button
//                                 className="close-modal-button"
//                                 onClick={() => setModalOpen(false)}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="modal-body">
//                             <div className="form-group">
//                                 <label htmlFor="name">Tên sảnh</label>
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="type">Mã loại sảnh</label>
//                                 <select
//                                     id="type"
//                                     name="type"
//                                     value={formData.type}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                 >
//                                     <option value="">Chọn loại sảnh</option>
//                                     {hallTypes.map(type => (
//                                         <option key={type.id} value={type.id}>{type.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="capacity">Số lượng bàn tối đa</label>
//                                 <input
//                                     type="number"
//                                     id="capacity"
//                                     name="capacity"
//                                     value={formData.capacity}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                     min="0"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Hình ảnh</label>
//                                 <div className="image-upload-container">
//                                     {formData.image && (
//                                         <div className="image-preview">
//                                             <img src={formData.image} alt="Preview" />
//                                             <button
//                                                 className="remove-image-button"
//                                                 onClick={() => setFormData({ ...formData, image: null })}
//                                             >
//                                                 <FaTimes />
//                                             </button>
//                                         </div>
//                                     )}

//                                     <div className="upload-button-container">
//                                         <label className="upload-button">
//                                             Chọn hình ảnh
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleImageChange}
//                                                 style={{ display: 'none' }}
//                                             />
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="notes">Ghi chú</label>
//                                 <textarea
//                                     id="notes"
//                                     name="notes"
//                                     value={formData.notes}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                     rows="3"
//                                 ></textarea>
//                             </div>
//                         </div>

//                         <div className="modal-footer">
//                             <button
//                                 className="cancel-button"
//                                 onClick={() => setModalOpen(false)}
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 className="save-button"
//                                 onClick={handleSave}
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Đang xử lý...' : 'Lưu'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HallList;