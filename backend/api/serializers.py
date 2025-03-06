from rest_framework import serializers
from .models import *
from accounts.models import *

class PetSerializer(serializers.ModelSerializer):
    # Ensure primary_vet and secondary_vet only accept users with 'vet_clinic' user_type
    pet_parent_first_name = serializers.CharField(source='pet_parent.first_name', read_only=True)
    pet_parent_last_name = serializers.CharField(source='pet_parent.last_name', read_only=True)
    transfer_status = serializers.SerializerMethodField()

    primary_vet = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(user_type='vet_clinic'), required=False)
    secondary_vet = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(user_type='vet_clinic'), required=False)


    class Meta:
        model = Pet
        fields = '__all__'


    def get_transfer_status(self, obj):
        transfer_request = TransferRequest.objects.filter(pet=obj, status='pending').first()
        return transfer_request.status if transfer_request else 'none'