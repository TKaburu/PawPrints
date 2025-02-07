from rest_framework import serializers
from .models import *

class CustomUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField( write_only=True)
    class Meta:
        model = CustomUser
        fields = ["id","email", "username","password", "confirm_password", "user_type"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'password': 'Password fields did not match'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
        return user
    