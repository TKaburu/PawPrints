from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import render, get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
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
    permission_classes = [AllowAny]

#--------------------------------------------- Reset Password ---------------------------------------------

class ForgotPasswordView(APIView):
    """	
    Send a password reset link to the user's email address.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "No account found with that email address."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a password reset token
        token = default_token_generator.make_token(user)

        # Encode user id to include in the reset URL
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Create reset URL for the frontend
        reset_url = f'http://localhost:3000/reset-password/{uid}/{token}/'

        # Send the email with reset link - using plain text instead of a template
        email_subject = 'Password Reset Request'
        email_message = f"""
            Hello {user.username},

            We received a request to reset your password. Click the link below to set a new password:

            {reset_url}

            If you didn't request this password reset, you can safely ignore this email.

            The password reset link will expire in 24 hours.

            This is an automated email, please do not reply.
        """

        send_mail(
            email_subject,
            email_message,
            'no-reply@example.com',
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent."}, status=status.HTTP_200_OK)
    
class ValidatePasswordResetTokenView(APIView):
    """
    API view to validate a password reset token before allowing a user to reset their password.
    This prevents users from filling out the reset form only to find out the token is invalid after submission.
    """
    
    def get(self, request, uidb64, token):
        try:
            # Decode the user id
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
            
            # Check if the token is valid
            if default_token_generator.check_token(user, token):
                return Response({"valid": True, "message": "Token is valid"}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"valid": False, "error": "The password reset link has expired or is invalid."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response(
                {"valid": False, "error": "Invalid user ID or token."},
                status=status.HTTP_400_BAD_REQUEST
            )
    

class ResetPasswordView(APIView):
    """"
    Reset the user's password.
    """
    permission_classes = [AllowAny]
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode('utf-8')
            user = CustomUser.objects.get(id=uid)
        except (TypeError, ValueError, CustomUser.DoesNotExist):
            return Response({"error": "Invalid token or user not found."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            new_password = request.data.get('password')

            # Hash the new password before saving
            user.password = make_password(new_password)
            user.save()

            return Response({"message": "Password has been successfully reset."}, status=status.HTTP_200_OK)


# -------------------------------------------- Dashboard Views --------------------------------------------

class PetOwnerDashboardView(APIView):
    """
    A dashboard for the pet owner user
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username):
        # Check if the user is requesting their own dashboard
        if request.user.username != username:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        # Get all pets where the current user is the pet_parent
        pets = Pet.objects.filter(pet_parent=request.user)
        serializer = PetSerializer(pets, many=True)
        
        return Response(serializer.data)

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
        pets = Pet.objects.filter(pet_parent=user)
        return pets