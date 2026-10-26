from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        # Eski parol to'g'riligini tekshiramiz
        if not user.check_password(old_password):
            return Response({'error': "Eski parol noto'g'ri kiritildi!"}, status=status.HTTP_400_BAD_REQUEST)

        # Yangi parolni o'rnatib saqlaymiz
        user.set_password(new_password)
        user.save()
        
        return Response({'message': "Parol muvaffaqiyatli o'zgartirildi!"}, status=status.HTTP_200_OK)