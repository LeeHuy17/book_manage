from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tên sách")
    author = models.CharField(max_length=100, verbose_name="Tác giả")
    price = models.DecimalField(max_length=10, decimal_places=2, max_digits=10, verbose_name="Giá tiền")
    quantity = models.IntegerField(default=0, verbose_name="Số lượng")

    def __str__(self):
        return self.title

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tên bài viết")
    author = models.CharField(max_length=100, verbose_name="Tác giả")
    content = models.TextField(verbose_name="Nội dung bài viết")

    def __str__(self):
        return self.title