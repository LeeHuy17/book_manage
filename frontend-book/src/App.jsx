import React from 'react';
import { useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/v3/book/'; // Thay đổi theo đúng URL chạy ở bài 4 

function App() {
  // State danh sách và phân trang
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
 
  

  // State bộ lọc (Filter)
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  // State quản lý Form (Dùng chung cho cả Thêm và Sửa)
  const [formData, setFormData] = useState({ title: '', author: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null); // Nếu có ID là đang sửa, null là đang thêm

  // Hàm gọi API lấy sách, phân trang và filter
  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: page,
          page_size: pageSize,
          title: searchTitle || undefined,
          author: searchAuthor || undefined,
        }
      });
      setBooks(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, formData);
        alert("Cập nhật sách thành công!");
      } else {
        await axios.post(API_URL, formData);
        alert("Thêm sách mới thành công!");
      }
      setFormData({ title: '', author: '', price: '', quantity: '' });
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
    }
  };

  const handleEditClick = (book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: book.quantity
    });
  };

  const handleDetailClick = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      alert(`CHI TIẾT SÁCH:\nTên: ${response.data.title}\nTác giả: ${response.data.author}\nGiá: ${response.data.price} VNĐ\nSố lượng: ${response.data.quantity}`);
    } catch (error) {
      console.error("Lỗi khi xem chi tiết:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này không?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        alert("Xóa sách thành công!");
        fetchBooks();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
      }
    }
  };

  // Tự động gọi API lấy danh sách mỗi khi page, pageSize thay đổi
  useEffect(() => {
    fetchBooks();
  }, [page, pageSize]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>QUẢN LÝ CƠ SỞ DỮ LIỆU SÁCH (FULLSTACK)</h1>

      {/* BLOCK 1: FORM TÌM KIẾM & LỌC */}
      <fieldset style={{ marginBottom: '20px' }}>
        <legend>Bộ lọc dữ liệu</legend>
        <form onSubmit={handleFilterSubmit}>
          <input type="text" placeholder="Tìm theo tiêu đề..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
          <input type="text" placeholder="Tìm theo tác giả..." value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} style={{ marginLeft: '10px' }} />
          <button type="submit" style={{ marginLeft: '10px' }}>Tìm kiếm</button>
          <button type="button" onClick={() => { setSearchTitle(''); setSearchAuthor(''); setPage(1); }} style={{ marginLeft: '5px' }}>Reset</button>
        </form>
      </fieldset>

      {/* BLOCK 2: FORM THÊM / SỬA SÁCH */}
      <fieldset style={{ marginBottom: '20px' }}>
        <legend>{editingId ? "Cập nhật thông tin sách" : "Thêm sách mới vào hệ thống"}</legend>
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="title" placeholder="Tiêu đề" value={formData.title} onChange={handleInputChange} required />
          <input type="text" name="author" placeholder="Tác giả" value={formData.author} onChange={handleInputChange} required style={{ marginLeft: '10px' }} />
          <input type="number" name="price" placeholder="Giá tiền" value={formData.price} onChange={handleInputChange} required style={{ marginLeft: '10px' }} />
          <input type="number" name="quantity" placeholder="Số lượng" value={formData.quantity} onChange={handleInputChange} required style={{ marginLeft: '10px' }} />
          <button type="submit" style={{ marginLeft: '10px', backgroundColor: editingId ? 'orange' : 'green', color: 'white' }}>
            {editingId ? "Save (Update)" : "Add Book"}
          </button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', author: '', price: '', quantity: '' }); }} style={{ marginLeft: '5px' }}>Hủy</button>}
        </form>
      </fieldset>

      {/* BLOCK 3: BẢNG HIỂN THỊ DANH SÁCH */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th><th>Title</th><th>Author</th><th>Price</th><th>Quantity</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.price}</td>
              <td>{book.quantity}</td>
              <td>
                <button onClick={() => handleDetailClick(book.id)} style={{ marginRight: '5px' }}>Detail</button>
                <button onClick={() => handleEditClick(book)} style={{ marginRight: '5px', backgroundColor: '#ffc107' }}>Edit</button>
                <button onClick={() => handleDeleteClick(book.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete</button>
              </td>
            </tr>
          )) : <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy cuốn sách nào!</td></tr>}
        </tbody>
      </table>

      {/* BLOCK 4: ĐIỀU HƯỚNG PHÂN TRANG */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</button>
        <span>Trang hiện tại: <strong>{page}</strong> / {Math.ceil(totalCount / pageSize) || 1}</span>
        <button onClick={() => setPage(prev => (books.length < pageSize ? prev : prev + 1))} disabled={books.length < pageSize}>Next</button>
        
        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ marginLeft: '20px' }}>
          <option value={3}>3 records / trang (Dễ test)</option>
          <option value={20}>20 records / trang</option>
          <option value={100}>100 records / trang</option>
        </select>
      </div>
    </div>
  );
}

export default App;
