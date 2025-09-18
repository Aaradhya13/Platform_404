# home/views.py
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from home.models import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class LoginView(APIView):
    """
    DRF APIView for login. Returns:
      - token
      - username
      - role (designation)
      - department
    """
    authentication_classes = []  # No auth required for login
    permission_classes = []      # Open endpoint

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)

        try:
            designed_user = DesignedUser.objects.get(user=user)
            role = designed_user.designation.name if designed_user.designation else None
            department = designed_user.Department.name if designed_user.Department else None
        except DesignedUser.DoesNotExist:
            role = None
            department = None

        return Response({
            "token": token.key,
            "username": user.username,
            "role": role,
            "department": department,
        }, status=status.HTTP_200_OK)

class CheckRoleView(APIView):
    """
    API to check user's department and role using token.
    Requires token authentication.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            designed_user = DesignedUser.objects.get(user=user)
            role = designed_user.designation.name if designed_user.designation else None
            department = designed_user.Department.name if designed_user.Department else None
        except DesignedUser.DoesNotExist:
            role = None
            department = None

        return Response({
            "username": user.username,
            "role": role,
            "department": department
        }, status=status.HTTP_200_OK)
