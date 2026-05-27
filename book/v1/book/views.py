from django.http import JsonResponse, HttpResponseNotAllowed
from ...models import Book
from .serializers import serialize_books 

# Bộ gác cổng tự chế
def chi_cho_phep_get(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if request.method != 'GET':
            return HttpResponseNotAllowed(['GET'])
        return view_func(request, *args, **kwargs)
    return _wrapped_view

@chi_cho_phep_get
def book_list_decorator(request):
    books = Book.objects.all()
    return JsonResponse({
        "status": "Thành công",
        "version": "v1 (Decorator)",
        "data": serialize_books(books)
    }, json_dumps_params={'ensure_ascii': False})