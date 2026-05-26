import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.core import serializers
from .models import Book

def book_list(request):
    if request.method == 'GET':
        # Lấy tất cả sách từ cơ sở dữ liệu
        books = Book.objects.all()
        # Chuyển đổi queryset thành JSON
        data = json.loads(serializers.serialize('json', books))
        response_data = {
            "status": "Thành công",
            "message": "Xin chào! Đây là dòng chữ được in ra từ API thuần đầu tiên của tôi.",
            "author": "Lập trình viên Django tương lai",
            "data": data # đưa dữ liệu sách vào response_data
        }
        # Chuyển đổi JSON string thành Python object để trả về JsonResponse hiểu được
        return JsonResponse(response_data, safe=False, json_dumps_params={'ensure_ascii': False})
    
    else:
        return HttpResponseNotAllowed(['GET'])