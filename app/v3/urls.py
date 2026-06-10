from django.urls import path
from .book.views import BookDetail, BookList


urlpatterns = [
    path('book', BookList.as_view()),
    path('book/<int:id>', BookDetail.as_view()), 
]