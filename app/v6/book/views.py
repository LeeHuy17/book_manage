from app.models import Book
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from .serializers import BookV6Serializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    permission_classes = [IsAuthenticated] 
    serializer_class = BookV6Serializer