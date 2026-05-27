from django.urls import path
from .book import views

urlpatterns = [
    # Với Class bắt buộc phải có đuôi .as_view() vì nó sẽ trả về một instance của class đó,
    #  và instance này sẽ có phương thức as_view() để xử lý request
    path('class-view/', views.BookClassView.as_view(), name='api_class'),
]