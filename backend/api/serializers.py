from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import *

class PetSerializer(serializers.ModelSerializer):
    """
    This class serializes the Pet model.
    """
    pet_parent_name = UserSerializer() 

    class Meta:
        model = Pet
        fields = '__all__'