from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from app.models import Book
from .serializers import BookV2Serializer


class bookList(APIView):
# - GET /api/books/ : Lấy danh sách sách
    def get(self, request):
        books = Book.objects.all()
        serializer = BookV2Serializer(books, many=True)
        return Response(serializer.data) 

# - POST /api/books/ : Thêm sách mới  
    def post(self, request):
        serializer = BookV2Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class bookDetail(APIView):
# - GET /api/books/<id>/ : Xem chi tiết một sách
    def get(self, request, id):
        try:
            book = Book.objects.get(id=id)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BookV2Serializer(book)
        return Response(serializer.data)
# - PUT /api/books/<id>/ : Cập nhật toàn bộ thông tin sách
    def put(self, request, id):
        try:
            book = Book.objects.get(id=id)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BookV2Serializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# - DELETE /api/books/<id>/ : Xóa sách
    def delete(self, request, id):
        try:
            book = Book.objects.get(id=id)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
