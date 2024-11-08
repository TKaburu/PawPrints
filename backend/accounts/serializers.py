from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from .models import *

class UserSerializer(serializers.ModelSerializer):
    """
    This class defines the User serializer.
    """
    class Meta:
        model = CustomUser
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    This is a serializer for obtaining the access and refresh token
    using email and password instead of username and password.
    """
    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        """
        This method validates the email and password passed.
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if not user:
                raise serializers.ValidationError('No active account found with the given credentials')

            # Set the user attribute to be used by the TokenObtainPairSerializer
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "email" and "password".')
        return super().validate(attrs)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        return token

class PetOwnerSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a PetOwner profile with associated CustomUser.
    """
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(write_only=True, source='user.password')
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = PetOwner
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'confirm_password']

    def validate(self, data):
        """
        Ensure the password and confirm_password match.
        """
        if data['user']['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """
        Create a new PetOwner instance along with the associated CustomUser.
        """
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        validated_data.pop('confirm_password')

        # Create the CustomUser instance
        user = CustomUser.objects.create_user(**user_data)
        user.set_password(password)
        user.save()

        # Create the PetOwner instance associated with the user
        pet_owner = PetOwner.objects.create(user=user, **validated_data)
        return pet_owner


class VetSerializer(serializers.ModelSerializer):
    """
    This class defines the Vet serializer.
    """
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(write_only=True, source='user.password')
    confirm_password = serializers.CharField(write_only=True)
    vet_clinic = serializers.PrimaryKeyRelatedField(queryset=VetClinic.objects.all())

    class Meta:
        model = Vet
        fields = ['username', 'email', 'first_name', 'last_name', 'vet_clinic', 'password', 'confirm_password']

    def validate(self, data):
        """
        Ensure the password and confirm_password match.
        """
        if data['user']['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        """
        Create a new Vet instance along with the associated CustomUser.
        """
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        validated_data.pop('confirm_password')

        # Create the CustomUser instance
        user = CustomUser.objects.create_user(**user_data)
        user.set_password(password)
        user.save()

        # Create the Vet instance associated with the user
        vet = Vet.objects.create(user=user, **validated_data)
        return vet

class VetClinicSerializer(serializers.ModelSerializer):
    """
    This class defines the Vet Clinic serializer.
    """
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = VetClinic
        fields = ['email', 'password', 'confirm_password', 'clinic_name', 'address', 'phone']

    def validate(self, data):
        """
        Ensure the password and confirm_password match.
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    

    def create(self, validated_data):
        """
        Create a new VetClinic instance.
        """
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        
        user = CustomUser.objects.create(
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=True
        )
        
        # Create the VetClinic instance
        vet_clinic = VetClinic.objects.create(user=user, **validated_data)

        return vet_clinic

class WelfareSerializer(serializers.ModelSerializer):
    """
    This class defines the Welfare serializer.
    """
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = WelfareOrg
        fields = ['email', 'password', 'confirm_password','org_name', 'address', 'phone']


    def validate(self, data):
        """
        Ensure the password and confirm_password match.
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        """
        Create a new WelfareOrg instance.
        """
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
                                                   
        user = CustomUser.objects.create(
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=True
        )

        # Create the WelfareOrg instance
        welfare_org = WelfareOrg.objects.create(user=user, **validated_data)

        
        return welfare_org