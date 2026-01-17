from django.contrib.auth import authenticate, login, logout
from django.middleware import csrf
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class CsrfView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token = csrf.get_token(request)
        return Response({'csrfToken': token})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        return Response({'id': user.id, 'username': user.username})


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out'})


class MeView(APIView):
    def get(self, request):
        user = request.user
        return Response({'id': user.id, 'username': user.username})
