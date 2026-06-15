from django.urls import path
from .book.views import BookDetail, BookList


urlpatterns = [
    path('book/', BookList.as_view()),
    path('book/<int:pk>/', BookDetail.as_view()), 
]