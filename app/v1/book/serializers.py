from rest_framework import serializers
from app.models import Book

class BookV1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'price', 'quantity']