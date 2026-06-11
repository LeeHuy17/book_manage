from app.models import Book
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import BookV4Serializer


class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookV4Serializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['title', 'author']


class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookV4Serializer
