from django.urls import path
from .book.views import BookViewSet

urlpatterns = [
    path('book', BookViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('book/<int:pk>/', BookViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})),
]