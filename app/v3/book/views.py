from app.models import Book
from app.v3.book.serializers import BookV3Serializer
from rest_framework import mixins
from rest_framework import generics
from rest_framework import permissions
from app.paginations import CustomPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
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

class LogoutView(APIView):
    # Bắt buộc phải xác thực token khi gọi API này
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Lấy refresh token từ body request do FE gửi lên
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Thiếu dữ liệu refresh token!"}, status=status.HTTP_400_BAD_REQUEST)
                
            token = RefreshToken(refresh_token)
            token.blacklist()  # Đưa token vào danh sách đen
            return Response({"detail": "Đăng xuất thành công!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)