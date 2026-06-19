from django.test import TestCase

class SimpleCITest(TestCase):
    def test_math_operations(self):
        """Bài test cơ bản để kiểm tra quy trình CI hoạt động tốt"""
        self.assertEqual(1 + 1, 2)