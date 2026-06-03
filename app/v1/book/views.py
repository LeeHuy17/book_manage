from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Book
from .serializers import BookV1Serializer


@api_view(['GET', 'POST'])
def book_list(request):
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookV1Serializer(books, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = BookV1Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)