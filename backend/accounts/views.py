from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny 
from rest_framework.response import Response
from .models import CustomUser
from .serializers import *
from api.models import Pet
from api.serializers import *

class RegisterView(generics.CreateAPIView):
    """
    Register a new user.
    """	
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]
    
class GetAllUsersView(generics.ListAPIView):
    """
    Get the details of all users.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    
class UserDetailView(generics.RetrieveAPIView):
    """
    Get the details of a specific user by username.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        return user
    
class GetUserView(generics.RetrieveAPIView):
    """
    Get the details of the currently logged-in user.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

