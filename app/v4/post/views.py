from app.models import Post, Post
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from app.filters import PostFilter
from .serializers import PostV4Serializer


class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostV4Serializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter


class PostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostV4Serializer
