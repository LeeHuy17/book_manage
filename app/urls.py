from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views

# URL ủy quyền cho ứng dụng book
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('app.v1.urls')),
]