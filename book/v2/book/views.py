import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from ...models import Book
from .serializers import serialize_books 

@method_decorator(csrf_exempt, name='dispatch')
class BookClassView(View):
    
    # Tự động bắt request GET
    def get(self, request, *args, **kwargs): # dấu *args và **kwargs là để nhận thêm các tham số nếu có, nhưng ở đây chúng ta không sử dụng
        books = Book.objects.all()
        return JsonResponse({
            "status": "Thành công",
            "version": "v2 (Class-Based View)",
            "data": serialize_books(books)
        }, json_dumps_params={'ensure_ascii': False})

    # Tự động bắt request POST
    def post(self, request, *args, **kwargs):
        try:
            body_data = json.loads(request.body)
            new_book = Book.objects.create(
                title=body_data.get('title'),
                author=body_data.get('author'),
                price=body_data.get('price'),
                quantity=body_data.get('quantity', 0)
            )
            return JsonResponse({
                "status": "Thành công",
                "message": f"Đã thêm cuốn '{new_book.title}' thành công vào v2!"
            }, status=201, json_dumps_params={'ensure_ascii': False})
        except Exception as e:
            return JsonResponse({"status": "Lỗi", "error": str(e)}, status=400)