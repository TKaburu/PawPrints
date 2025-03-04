from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import *
from api.models import Pet
from api.serializers import *

# -------------------------------------------- User Registration --------------------------------------------

class RegisterView(generics.CreateAPIView):
    """
    Register a new user.
    """	
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # You can perform additional validation here if needed
        user = serializer.save()
        return user

# -------------------------------------------- User Views --------------------------------------------
    
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
    
class GetCurrentUserView(generics.RetrieveAPIView):
    """
    Get the details of the currently logged-in user.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class PetOwnerView(APIView):
    """
    This view checks if a user is a pet owner based on their email.
    """

    def get(self, request, format=None):
        # Get the email from the query parameters
        email = request.query_params.get('email')

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
            # Check if the user owns any pets by filtering Pet objects where the pet_parent is the user
            is_pet_owner = Pet.objects.filter(pet_parent=user).exists()

            return Response({"isPetOwner": is_pet_owner})
        
        except CustomUser.DoesNotExist:
            return Response({"isPetOwner": False}, status=status.HTTP_404_NOT_FOUND)


class VetClinicsListView(generics.ListAPIView):
    """
    Get the details of all vet clinics.
    """
    queryset = CustomUser.objects.filter(user_type='vet_clinic')
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    

# -------------------------------------------- Dashboard Views --------------------------------------------

class PetOwnerDashboardView(generics.ListAPIView):
    """
    Dashboard for the pet owner user
    """
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        pets = Pet.objects.filter(pet_parent=user)
        return pets

class VetClinicDashboardView(generics.ListAPIView):
    """
    Dashboard for the vet clinic user
    """
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        pets = Pet.objects.filter(primary_vet=user)
        return pets
    
class WelfareOrganizationDashboardView(generics.ListAPIView):
    """
    Dashboard for the welfare organization user
    """
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        pets = Pet.objects.all()
        return pets