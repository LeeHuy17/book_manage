from rest_framework import serializers
from ...models import Book


class BookV5Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'