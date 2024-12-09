from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .models import *
from .serializers import *
from api.models import Pet
from api.serializers import PetSerializer
import json


User = get_user_model()

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def registerUser(request):
#     """
#     Create a new user.
#     """
#     if request.method == 'POST':
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def registerPetOwner(request):
    """
    This function registers a Pet Owner.
    """
    if request.method == 'POST':
        serializer = PetOwnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        pet_owners = PetOwner.objects.all()
        serializer = PetOwnerSerializer(pet_owners, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def registerVetClinic(request):
    """
    This function registers a Vet Clinic.
    """
    if request.method == 'POST':
        serializer = VetClinicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        vet_clinics = VetClinic.objects.all()
        serializer = VetClinicSerializer(vet_clinics, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def registerVet(request):
    """
    This function registers a Vet.
    """
    if request.method == 'POST':
        serializer = VetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        vets = Vet.objects.all()
        serializer = VetSerializer(vets, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def registerWelfare(request):
    """
    This function registers a Welfare Organization.
    """
    if request.method == 'POST':
        serializer = WelfareSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        welfare = WelfareOrg.objects.all()
        serializer = WelfareSerializer(welfare, many=True)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request):
    """
    Get the details of the currently logged-in user.
    """
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userDashboard(request):
    """
    Returns pet data based on the user type.
    Pet owners see their pets.
    Vets see pets they are responsible for.
    Welfare users see all pets.
    """
    user = request.user

    if user.user_type == 'pet_owner':
        pets = Pet.objects.filter(owner=user)
    elif user.user_type == 'vet':
        pets = Pet.objects.filter(vet=user)
    elif user.user_type == 'welfare':
        pets = Pet.objects.all()
    else:
        return Response({"error": "Invalid user type"}, status=400)

    serializer = PetSerializer(pets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userProfile(request):
    """
    Returns the logged-in user's profile info, including user_type.
    """
    user = request.user
    return Response({
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'email': user.email,
        'user_type': user.user_type
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pet_owner_dashboard(request, username):
    """
    Retrieve the list of pets for a specific user by username.
    """
    user = get_object_or_404(CustomUser, username=username)
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


@api_view(['POST'])
@permission_classes([AllowAny])
def contact(request):
    try:
        # Parse the incoming JSON data
        data = request.data
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # Validate input
        if not name or not email or not message:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Send email
        subject = f"New Message from {name}"
        body = f"Message from: {name}\nEmail: {email}\n\n{message}"
        send_mail(subject, body, {email} , [settings.EMAIL_HOST_USER])

        return Response({"success": "Message sent successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

