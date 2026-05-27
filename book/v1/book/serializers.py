

def serialize_books(books_queryset):
    return [{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "price": float(book.price),
        "quantity": book.quantity,
    } for book in books_queryset]