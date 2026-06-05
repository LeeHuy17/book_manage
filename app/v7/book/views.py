from rest_framework import viewsets
from app.models import Book
from .serializers import BookV7Serializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookV7Serializer