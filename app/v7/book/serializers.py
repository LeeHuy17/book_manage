from rest_framework import serializers
from app.models import Book

class BookV7Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'