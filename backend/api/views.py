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


class PetsListView(generics.ListAPIView):
    """
    API view to list all pets in the database.
    """
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

class PetDetailsView(generics.RetrieveAPIView):
    """
    API view to retrieve a pet's details by ID.
    """
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Pet, slug=self.kwargs['slug'])


class UpdatePetInforView(generics.UpdateAPIView):
    """
    API view to update a pet's information.
    """
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Pet, slug=self.kwargs['slug'])


class DeletePetView(generics.DestroyAPIView):
    """
    API view to delete a pet by ID.
    """
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]


class TransferPetOwnership(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pet_id):
        try:
            # Retrieve the pet instance by ID
            pet = Pet.objects.get(id=pet_id)
        except Pet.DoesNotExist:
            return Response({'detail': 'Pet not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the current user is the owner of the pet
        if pet.pet_parent != request.user:
            return Response({'detail': 'You are not the current owner of this pet.'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the new owner's email address from the request data
        new_owner_email = request.data.get('new_owner_email')
        if not new_owner_email:
            return Response({'detail': 'New owner email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure the new owner is a valid user with 'pet_owner' user type
            new_owner = CustomUser.objects.get(email=new_owner_email, user_type='pet_owner')
        except CustomUser.DoesNotExist:
            return Response({'detail': 'New owner not found or invalid user type.'}, status=status.HTTP_404_NOT_FOUND)

        # Transfer the pet to the new owner
        pet.pet_parent = new_owner
        pet.save()

        # Return the updated pet data
        serializer = PetSerializer(pet)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PetSearchView(APIView):
    """
    Api view to search for a pet by its microchip number.
    """
    permission_classes = [AllowAny]

    def get(self, request, search=None):
        """
        Search for a pet by its microchip number.
        """
        if search:
            pets = Pet.objects.filter(microchip_no__icontains=search)
            if pets.exists():
                serializer = PetSerializer(pets, many=True)
                return Response(serializer.data)
            else:
                return Response(
                    {'error': 'No pet with that number found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {'error': 'Please provide a microchip number'}, 
                status=status.HTTP_400_BAD_REQUEST
            )    


class CheckMicrochipExistsView(APIView):
    """
    API View to check if a microchip number already exists in the Pet model.
    """

    def get(self, request, microchip_no, *args, **kwargs):
        # Check if the microchip number exists in the Pet model
        exists = Pet.objects.filter(microchip_no=microchip_no).exists()

        return Response({"exists": exists}, status=status.HTTP_200_OK)

