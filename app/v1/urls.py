from django.urls import path 
from app.v1.book.views import book_list

urlpatterns = [
    path('book', book_list),
]