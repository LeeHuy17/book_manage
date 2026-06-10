from rest_framework import serializers
from ...models import Book

class BookV3Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'