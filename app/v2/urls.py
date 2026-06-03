from django.urls import path
from .book.views import bookDetail, bookList


urlpatterns = [
    path('book', bookList.as_view()),
    path('book/<int:id>', bookDetail.as_view()),
]