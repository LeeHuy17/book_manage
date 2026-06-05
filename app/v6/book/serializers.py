from rest_framework import serializers
from ...models import Book


class BookV6Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'