import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Khấu hình URL gốc của Django Backend
const API_BASE_URL = 'http://127.0.0.1:8000/api/';

function App() {
  // ----------------------------------------------------------------
  // 1. KHAI BÁO CÁC STATE (Đã sửa lỗi ReferenceError: page/setFormData)
  // ----------------------------------------------------------------
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // State hỗ trợ tìm kiếm/bộ lọc
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  // State hỗ trợ CRUD Form
  const [formData, setFormData] = useState({ title: '', author: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);

  // State hỗ trợ Xác thực Đăng nhập (JWT)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // ----------------------------------------------------------------
  // 2. CẤU HÌNH AXIOS INTERCEPTOR (Tự động đính Token bảo mật)
  // ----------------------------------------------------------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ----------------------------------------------------------------
  // 3. CÁC HÀM XỬ LÝ LOGIC (LOGIC FUNCTIONS)
  // ----------------------------------------------------------------
  
  // Lấy danh sách sách từ backend kèm phân trang và token
  const fetchBooks = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.get(`${API_BASE_URL}v3/book/`, {
        headers: getAuthHeaders(),
        params: {
          page: page,
          page_size: pageSize,
          title: searchTitle || undefined,
          author: searchAuthor || undefined,
        }
      });
      // Đọc cấu trúc từ Custom Pagination tuần 5 của bạn
      setBooks(response.data.results || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
      if (error.response?.status === 401) {
        handleLogoutClean(); // Token hết hạn hoặc không hợp lệ -> Logout luôn
      }
    }
  };

  // Tự động tải dữ liệu mỗi khi đổi trang hoặc kích thước trang
  useEffect(() => {
    fetchBooks();
  }, [page, pageSize, isLoggedIn]);

  // Xử lý đăng nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await axios.post(`${API_BASE_URL}token/`, loginCredentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsLoggedIn(true);
      setPage(1);
    } catch (error) {
      setAuthError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  // Xử lý đăng xuất (Gọi API và dọn dẹp bộ nhớ máy Client)
  const handleLogoutClick = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      // Gọi API logout tuần 5 truyền kèm Refresh Token để đưa vào blacklist
      await axios.post(`${API_BASE_URL}v3/logout/`, { refresh: refreshToken }, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error("Lỗi API đăng xuất:", error);
    } finally {
      handleLogoutClean();
    }
  };

  const handleLogoutClean = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setBooks([]);
  };

  // Thay đổi dữ liệu trong form nhập liệu sách
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý Thêm / Cập nhật sách
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}v3/book/${editingId}/`, formData, { headers: getAuthHeaders() });
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}v3/book/`, formData, { headers: getAuthHeaders() });
      }
      setFormData({ title: '', author: '', price: '', quantity: '' });
      fetchBooks();
    } catch (error) {
      console.error("Lỗi khi lưu thông tin sách:", error);
    }
  };

  // Điền dữ liệu vào form để tiến hành sửa
  const handleEditClick = (book) => {
    setEditingId(book.id);
    setFormData({ title: book.title, author: book.author, price: book.price, quantity: book.quantity });
  };

  // Xóa sách
  const handleDeleteClick = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}v3/book/${id}/`, { headers: getAuthHeaders() });
        fetchBooks();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
      }
    }
  };

  // ----------------------------------------------------------------
  // 4. GIAO DIỆN HIỂN THỊ (RENDER JSX)
  // ----------------------------------------------------------------

  // MÀN HÌNH 1: GIAO DIỆN ĐĂNG NHẬP (Nếu chưa có token)
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form onSubmit={handleLoginSubmit} className="login-form">
          <h2>HỆ THỐNG QUẢN LÝ SÁCH</h2>
          <p>Vui lòng đăng nhập để tiếp tục tuần 5</p>
          {authError && <div className="error-alert">{authError}</div>}
          <div className="input-group">
            <label>Tài khoản</label>
            <input type="text" required value={loginCredentials.username} onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input type="password" required value={loginCredentials.password} onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-search" style={{ width: '100%', marginTop: '10px' }}>Đăng nhập</button>
        </form>
      </div>
    );
  }

  // MÀN HÌNH 2: GIAO DIỆN CHÍNH HỆ THỐNG (Đã đăng nhập thành công)
  return (
    <div className="container">
      {/* Thanh Tiêu Đề Hệ Thống Tích Hợp Nút Đăng Xuất */}
      <div className="header-bar">
        <h1 className="main-title">QUẢN LÝ CƠ SỞ DỮ LIỆU SÁCH (FULLSTACK)</h1>
        <button onClick={handleLogoutClick} className="btn btn-delete logout-btn">Đăng xuất</button>
      </div>

      {/* BLOCK 1: FORM TÌM KIẾM / BỘ LỌC */}
      <fieldset className="filter-section">
        <legend>Bộ lọc dữ liệu</legend>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchBooks(); }} className="inline-form">
          <input type="text" placeholder="Tìm theo tiêu đề..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
          <input type="text" placeholder="Tìm theo tác giả..." value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} />
          <button type="submit" className="btn btn-search">Tìm kiếm</button>
          <button type="button" className="btn btn-reset" onClick={() => { setSearchTitle(''); setSearchAuthor(''); setPage(1); }}>Reset</button>
        </form>
      </fieldset>

      {/* BLOCK 2: FORM THÊM / SỬA SÁCH */}
      <fieldset className="filter-section">
        <legend>{editingId ? "Cập nhật thông tin sách" : "Thêm sách mới vào hệ thống"}</legend>
        <form onSubmit={handleBookSubmit} className="inline-form">
          <input type="text" name="title" required placeholder="Tiêu đề sách..." value={formData.title} onChange={handleInputChange} />
          <input type="text" name="author" required placeholder="Tác giả..." value={formData.author} onChange={handleInputChange} />
          <input type="number" name="price" required placeholder="Giá tiền..." value={formData.price} onChange={handleInputChange} />
          <input type="number" name="quantity" required placeholder="Số lượng..." value={formData.quantity} onChange={handleInputChange} />
          <button type="submit" className={editingId ? "btn btn-save" : "btn btn-add"}>
            {editingId ? "Cập nhật" : "Thêm Sách"}
          </button>
          {editingId && <button type="button" className="btn btn-cancel" onClick={() => { setEditingId(null); setFormData({ title: '', author: '', price: '', quantity: '' }); }}>Hủy</button>}
        </form>
      </fieldset>

      {/* BLOCK 3: BẢNG DỮ LIỆU */}
      <table className="book-table">
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Author</th><th>Price</th><th>Quantity</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.price} VNĐ</td>
                <td>{book.quantity}</td>
                <td>
                  <button onClick={() => handleEditClick(book)} className="btn btn-table btn-edit">Sửa</button>
                  <button onClick={() => handleDeleteClick(book.id)} className="btn btn-table btn-delete">Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy cuốn sách nào!</td></tr>
          )}
        </tbody>
      </table>

      {/* BLOCK 4: THANH PHÂN TRANG (Tương thích Custom Pagination) */}
      <div className="pagination-footer">
        <div className="pagination-controls">
          <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Trang trước</button>
          <span className="page-info">Trang: <strong>{page}</strong> / {totalPages}</span>
          <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Trang sau</button>
        </div>
        
        <div className="page-size-selector">
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={5}>5 bản ghi / trang</option>
            <option value={20}>20 bản ghi / trang</option>
            <option value={50}>50 bản ghi / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
