from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.serializers import CustomUserSerializer
from .models import *
from .serializers import *

User = get_user_model()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def pets(request):
    """
    This function returns a list of all pets in the database or creates a new pet.
    """
    if request.method == 'GET':
        pets = Pet.objects.all()
        serializer = PetSerializer(pets, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(pet_parent_name=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'PUT', 'DELETE'])
def pet_detail(request, slug):
    """
    This function retrieves, updates, or deletes a pet instance.
    args:
        slug: str
    """
    try:
        pet = Pet.objects.get(slug=slug)
    except Pet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PetSerializer(pet)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PetSerializer(pet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        pet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class RegisterPetView(APIView):
    """
    API view to register a pet. Only authenticated pet owners can register a pet.
    Only users with the 'vet_clinic' user type can be assigned as vets.
    """
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request):
        user = request.user

        # Ensure the user is a pet owner
        if user.user_type != 'pet_owner':
            return Response(
                {"detail": "Only pet owners can register a pet."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Ensure the primary and secondary vets are users with 'vet_clinic' user_type
        primary_vet_id = request.data.get('primary_vet')
        secondary_vet_id = request.data.get('secondary_vet')
        
        if primary_vet_id:
            primary_vet = CustomUser.objects.filter(id=primary_vet_id, user_type='vet_clinic').first()
            if not primary_vet:
                return Response(
                    {"detail": "Primary vet must be a vet clinic."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if secondary_vet_id:
            secondary_vet = CustomUser.objects.filter(id=secondary_vet_id, user_type='vet_clinic').first()
            if not secondary_vet:
                return Response(
                    {"detail": "Secondary vet must be a vet clinic."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Assign the authenticated user as the pet's parent
        data = request.data
        data['pet_parent'] = user.id

        # Serialize the pet data
        serializer = PetSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()  # Save the pet to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PetOwnerPetsView(generics.ListAPIView):
    """
    List pets owned by the current Pet Owner.
    """
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user  # Get the current user (Pet Owner)
        
        # Return pets where the logged-in user is the pet parent
        if user.user_type == 'pet_owner':
            return Pet.objects.filter(pet_parent=user)
        else:
            return Pet.objects.none()  # Return empty queryset if the user is not a pet owner


class CareProviderPetsView(generics.ListAPIView):
    """
    List pets that are under the care of the current Vet Clinic or Welfare Organization.
    """
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user  # Get the current user (Vet Clinic or Welfare Organization)
        
        # Filter pets by the logged-in user's care_provider field
        if user.user_type in ['vet_clinic', 'welfare']:
            return Pet.objects.filter(care_provider=user)
        else:
            return Pet.objects.none()  # Return empty queryset if the user is not a care provider



@api_view(['GET'])
@permission_classes([AllowAny])
def petSearch(request, search):
    """
    This function searches for a pet by name.
    args:
        search: str
    """
    if request.method == 'GET':
        if search:
            pets = Pet.objects.filter(microchip_no__icontains=search)
            if pets.exists():
                serializer = PetSerializer(pets, many=True)
                return Response(serializer.data)
            else:
                return Response(
                    {'error': 'No pet with that number found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(
                {'error': 'Please provide a microchip number'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# ------------------------------- Pet Ownership Views ------------------------------- # 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transferPetOwnership(request, slug):
    """
    Transfer the ownership of a pet to a new owner.
    """
    try:
        pet = Pet.objects.get(slug=slug)
        new_owner_username = request.data.get('new_owner_username')
        new_owner = CustomUser.objects.get(username=new_owner_username)
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found.'}, status=status.HTTP_404_NOT_FOUND)
    except CustomUser.DoesNotExist:
        return Response({'error': 'New owner not found.'}, status=status.HTTP_404_NOT_FOUND)

    if pet.pet_parent_name != request.user:
        return Response({'error': 'You are not the owner of this pet.'}, status=status.HTTP_403_FORBIDDEN)

    pet.pet_parent_name = new_owner
    pet.save()

    serializer = PetSerializer(pet)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ------------------------------- Dashboard Views ------------------------------- #
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userProfile(request, username):
    profile_user = get_object_or_404(User, username=username)
    user_serializer = CustomUserSerializer(profile_user)
    
    profile_data = {
        'user': user_serializer.data,
        # Include other user data here
    }
    
    if profile_user.user_type == 'PET_OWNER':
        pets = Pet.objects.filter(owner=profile_user)
        pet_serializer = PetSerializer(pets, many=True)
        profile_data.update({
            'pets': pet_serializer.data,
            'pet_count': pets.count()
        })
    elif profile_user.user_type == 'VET':
        pets = Pet.objects.filter(vet=profile_user)
        pet_serializer = PetSerializer(pets, many=True)
        profile_data.update({
            'pets_under_care': pet_serializer.data,
            'pets_count': pets.count()
        })
    else:
        profile_data['message'] = 'User type not specified'
    
    return Response(profile_data, status=status.HTTP_200_OK)