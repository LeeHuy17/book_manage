from rest_framework import serializers
from ...models import Book, Post

class BookV4Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class PostV4Serializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'