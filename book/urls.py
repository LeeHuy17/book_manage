from django.urls import path
from . import views

# URL ủy quyền cho ứng dụng book
urlpatterns = [
    path('api/pure/', views.book_list, name='api_pure'),
]