from django.urls import path
from .book.views import BookDetail, BookList, LogoutView


urlpatterns = [
    path('book/', BookList.as_view()),
    path('book/<int:pk>/', BookDetail.as_view()), 
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]