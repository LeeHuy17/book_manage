from django.urls import path
from .book import views

urlpatterns = [
    path('pure-decorator/', views.book_list_decorator, name='api_decorator'),
]