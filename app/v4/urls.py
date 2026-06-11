from django.urls import path

from app.v4.post.views import PostListCreateAPIView, PostRetrieveUpdateDestroyAPIView
from .book.views import BookListCreateAPIView, BookRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('book/', BookListCreateAPIView.as_view()), 
    path('book/<int:pk>/', BookRetrieveUpdateDestroyAPIView.as_view()),
    path('post/', PostListCreateAPIView.as_view()),
    path('post/<int:pk>/', PostRetrieveUpdateDestroyAPIView.as_view()),
]