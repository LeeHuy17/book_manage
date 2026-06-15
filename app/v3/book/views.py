from app.models import Book
from app.v3.book.serializers import BookV3Serializer
from rest_framework import mixins
from rest_framework import generics
from rest_framework import permissions
from app.paginations import CustomPagination



class BookList(mixins.ListModelMixin,
               mixins.CreateModelMixin,
               generics.GenericAPIView):
    serializer_class = BookV3Serializer
    pagination_class = CustomPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Book.objects.all()

        title = self.request.query_params.get('title')
        if title is not None:
            queryset = queryset.filter(title=title)

        author = self.request.query_params.get('author')
        if author is not None:
            queryset = queryset.filter(author=author)

        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class BookDetail(mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 generics.GenericAPIView):
    queryset = Book.objects.all()
    serializer_class = BookV3Serializer
    pagination_class = CustomPagination
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)