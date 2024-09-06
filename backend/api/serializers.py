from rest_framework import serializers
from .models import Pet
from accounts.serializers import UserSerializer
from accounts.models import CustomUser

class PetSerializer(serializers.ModelSerializer):
    """
    This class serializes the Pet model.
    """
    pet_parent_name = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)

    class Meta:
        model = Pet
        fields = '__all__'
