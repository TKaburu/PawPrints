from django.urls import path
from .views import *

urlpatterns = [
    path('pets', pets, name='pets'),
    path('pets/<slug:slug>/', pet_detail, name='pet_detail'),
    path('search/<str:search>/', petSearch, name='petSearch'),

    # ------------------------------- Pet Ownership Views ------------------------------- #
    path('register-a-pet/', RegisterPetView.as_view(), name='register_pet'),
    path('pet/<int:pet_id>/transfer-ownership/', TransferPetOwnership.as_view(), name='transfer_pet_ownership'),
    path('check-microchip/<str:microchip_no>/', CheckMicrochipExistsView.as_view(), name='check_microchip_exists'),
]