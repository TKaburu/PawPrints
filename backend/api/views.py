from django.shortcuts import render, get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.pagination import CursorPagination
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

        # Ensure the user is not vet clinic
        if user.user_type == 'vet_clinic':
            return Response(
                {"detail": "Only pet owners and welfare organizations can register a pet."},
                status=status.HTTP_403_FORBIDDEN
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
    
# class CustomPagination(CursorPagination):
#     """
#     Custom pagination class to set the page size and ordering.
#     """
#     page_size = 9
#     ordering = ('-created_at', 'id')


class PetsListView(generics.ListAPIView):
    """
    API view to list all pets in the database.
    """
    queryset = Pet.objects.all().select_related('pet_parent')
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]
    # pagination_class = CustomPagination

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

    def get_object(self):
        """
        Gets the pet object by its slug.
        """
        return get_object_or_404(Pet, slug=self.kwargs['slug'])

    def delete(self, request, *args, **kwargs):
        """
        Deletes a pet object and returns a success response.
        """
        pet = self.get_object()
        pet.delete()
        return Response({"message": "Pet deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class TransferPetOwnership(APIView):
    """
    API View to transfer the ownership of a pet to another user.
    """
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
    
class RequestTransferOwnership(APIView):
    """
    API View to request the transfer of a pet's ownership to another user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pet_id):
        # Retrieve the pet and check if it's owned by the current user
        try:
            pet = Pet.objects.get(id=pet_id)
        except Pet.DoesNotExist:
            return Response({"detail": "Pet not found."}, status=status.HTTP_404_NOT_FOUND)

        if pet.pet_parent != request.user:
            return Response({"detail": "You can only transfer ownership of your own pets."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the new owner email from the request
        new_owner_email = request.data.get("new_owner_email")

        # Check if the new_owner_email is provided and valid
        if not new_owner_email:
            return Response({"detail": "New owner's email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_owner_email == request.user.email:
            return Response({"detail": "You cannot transfer the pet ownership to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the transfer request entry
        transfer_request = TransferRequest.objects.create(
            pet=pet,
            current_owner=request.user,
            new_owner_email=new_owner_email
        )

        # Send email notification to the admin for approval
        send_mail(
            'Pet Ownership Transfer Request',
            f'A request has been made to transfer ownership of {pet.pet_name} to {new_owner_email}. Please review and approve.',
            settings.EMAIL_HOST_USER,
            ['admin@yourdomain.com'],  # Admin's email for approval
            fail_silently=False,
        )

        return Response({"detail": "Transfer request submitted successfully. We will notify you once it's approved."}, status=status.HTTP_200_OK)


class TransferRequestApproval(APIView):
    """
    API VIew to approve or reject a pet ownership transfer request.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]  

    def post(self, request, transfer_request_id):
        try:
            transfer_request = TransferRequest.objects.get(id=transfer_request_id)
        except TransferRequest.DoesNotExist:
            return Response({"detail": "Transfer request not found."}, status=status.HTTP_404_NOT_FOUND)
            
        action = request.data.get("action")  # 'approve' or 'reject'
        
        if action == 'approve':
            # Try to find the new owner
            try:
                new_owner = CustomUser.objects.get(email=transfer_request.new_owner_email)
            except CustomUser.DoesNotExist:
                return Response({'detail': 'New owner not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            # Update the transfer request status
            transfer_request.status = 'approved'
            transfer_request.save()
            
            # Update the pet's owner
            pet = transfer_request.pet
            pet.pet_parent = new_owner
            pet.save()
            
            # Send email notifications to both owners
            send_mail(
                'Pet Ownership Transfer Approved',
                f'The ownership transfer of {pet.pet_name} has been approved.',
                settings.EMAIL_HOST_USER,
                [transfer_request.current_owner.email, new_owner.email],
                fail_silently=False,
            )
            
            return Response({"detail": "Transfer request approved and pet ownership updated."})
            
        elif action == 'reject':
            transfer_request.status = 'rejected'
            transfer_request.save()
            
            # Notify the current owner
            send_mail(
                'Pet Ownership Transfer Rejected',
                f'The ownership transfer of {transfer_request.pet.pet_name} has been rejected. Please contact the PawPrints for more information',
                settings.EMAIL_HOST_USER,
                [transfer_request.current_owner.email],
                fail_silently=False,
            )
            
            return Response({"detail": "Transfer request rejected."})
        
        return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
    
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

