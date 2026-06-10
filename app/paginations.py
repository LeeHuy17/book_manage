from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 20  # Mặc định mỗi trang hiển thị 20 record
    page_query_param = 'page_number'  # Tên tham số trang trong URL (mặc định là 'page')
    page_size_query_param = 'page_size'  # Cho phép client tùy chỉnh số record trên mỗi trang
    max_page_size = 100  # Giới hạn tối đa số record trên mỗi trang để tránh quá tải server