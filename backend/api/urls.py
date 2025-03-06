from django.urls import path
from .views import *

urlpatterns = [
    path('pets/', PetsListView.as_view(), name='pets'),

    # ------------------------------- Pet Views / CRUD ------------------------------- #

    path('register-a-pet/', RegisterPetView.as_view(), name='register_pet'),
    path('pets/<slug:slug>/', PetDetailsView.as_view(), name='pet_detail'),
    path('pets/<slug:slug>/update/', UpdatePetInforView.as_view(), name='update_pet_info'),
    path('pets/<slug:slug>/delete/', DeletePetView.as_view(), name='delete_pet'),

    # ------------------------------- Pet Search Views ------------------------------- #

    path('search/<str:search>/', PetSearchView.as_view(), name='pet_search'),

    # ------------------------------- Pet Ownership Views ------------------------------- #
    
    path('pet/<int:pet_id>/transfer-ownership/', TransferPetOwnership.as_view(), name='transfer_pet_ownership'),
    path('check-microchip/<str:microchip_no>/', CheckMicrochipExistsView.as_view(), name='check_microchip_exists'),
    path('pet/<int:pet_id>/transfer-request/', RequestTransferOwnership.as_view(), name='transfer_request'),
]