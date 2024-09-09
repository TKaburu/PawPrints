from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from api.models import Pet
from api.serializers import PetSerializer
from .models import CustomUser

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    """
    Create a new user.
    """
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request):
    """
    Get the details of the currently logged-in user.
    """
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def userProfile(request, username):
#     """
#     View for user profile, adapting based on user type.
#     """
#     profile_user = get_object_or_404(User, username=username)
#     user_serializer = UserSerializer(profile_user)
    
#     if profile_user.user_type == 'Pet Owner':
#         pets = Pet.objects.filter(owner=profile_user)
#         pet_serializer = PetSerializer(pets, many=True)
#         profile_data = {
#             'user': user_serializer.data,
#             'pets': pet_serializer.data,
#             'pet_count': pets.count()
#         }
#     elif profile_user.user_type == 'Vet':
#         pets = Pet.objects.filter(vet=profile_user)
#         pet_serializer = PetSerializer(pets, many=True)
#         profile_data = {
#             'user': user_serializer.data,
#             'pets_under_care': pet_serializer.data,
#             'pets_count': pets.count()
#         }
#     else:
#         return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
    
#     return Response(profile_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pet_owner_dashboard(request, username):
    """
    Retrieve the list of pets for a specific user by username.
    """
    user = get_object_or_404(CustomUser, username=username)
    # if request.user.username != user.username:
    #     return Response({"detail": "You do not have permission to view this data."}, status=status.HTTP_403_FORBIDDEN)
    if username == 'undefined' or not username:
        username =  request.user.username
    pets = Pet.objects.filter(pet_parent_name=user)
    serializer = PetSerializer(pets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def checkUserExists(request):
    username = request.GET.get('username')
    if CustomUser.objects.filter(username=username).exists():
        return Response({"exists": True}, status=status.HTTP_200_OK)
    return Response({"exists": False}, status=status.HTTP_404_NOT_FOUND)
