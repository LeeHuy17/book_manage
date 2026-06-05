from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .book.views import BookViewSet

# Khởi tạo router và đăng ký viewset
router = DefaultRouter()
router.register(r'book', BookViewSet, basename='book')
# gộp các URL do router tạo ra vào urlpatterns
urlpatterns = [
    path('', include(router.urls)),
]