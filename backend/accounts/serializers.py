from .models import CustomUser
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """
    serializer for the User model
    """

    class Meta:
        model = CustomUser
        fields = fields = ['first_name', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        """
        Validates if both passswords match
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """
        Creates a new user
        """
        validated_data.pop('confirm_password')
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type=validated_data['user_type']
        )
        user.set_password(validated_data['password'])  # This is the line that hashes the password
        user.save()
        return user

