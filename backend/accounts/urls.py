from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *


urlpatterns = [
    # ------------------------------- Auth URLs ------------------------------- #

    path('register/pet-owner/', registerPetOwner, name='register_pet_owner'),
    path('register/vet-clinic/', registerVetClinic, name='register _vet_clinic'),
    path('register/vet/', registerVet, name='register_vet'),
    path('register/welfare-org/', registerWelfare, name='register_welfare'),

    # path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ------------------------------- Profile URLs ------------------------------- #
    path('get-user/', getUser, name='get-user'),
    path('user-dashboard/', userDashboard, name='user_dashboard'),
    path('profile/', userProfile, name='user_profile'),

    # ------------------------------- Dashboard URLs ------------------------------- #
    path('pet-owner-dashboard/<str:username>/', pet_owner_dashboard, name='pet_owner_dashboard'),
    path('vet-clinic-dashboard/<slug:slug>/', vet_clinic_dashboard, name='vet_clinic_dashboard'),
    path('check-user/', checkUserExists, name='check_user_exists'),

    path('contact/', contact, name='contact'),
]