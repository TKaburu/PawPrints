from rest_framework import serializers
from .models import *

class CustomUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = [
                    "id", "email", "username", "password", 
                    "confirm_password", "user_type", "first_name", "last_name", 
                    "phone_number", "location"
                  ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'password': 'Password fields did not match'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user_type = validated_data.get('user_type')

        if user_type == 'pet_owner':
            # You can handle validation logic specific to pet owners here
            first_name = validated_data.get('first_name')
            last_name = validated_data.get('last_name')
            if not first_name or not last_name:
                raise serializers.ValidationError({'first_name': 'First name is required for pet owners', 'last_name': 'Last name is required for pet owners'})
        
        user = CustomUser.objects.create_user(**validated_data)
        return user
