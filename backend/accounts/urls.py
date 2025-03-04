from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    # ------------------------------------------------------------ Authentication ------------------------------------------------------------
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ------------------------------------------------------------ User ------------------------------------------------------------
    path('get-all-users/', GetAllUsersView.as_view(), name='users'),
    path('user-details/', UserDetailView.as_view(), name='user-detail'),
    path('current-user-details/', GetCurrentUserView.as_view(), name='user'),

    path('users/check-pet-owner/', PetOwnerView.as_view(), name='check-pet-owner'),

    path('vet-clinics/', VetClinicsListView.as_view(), name='vet-clinics'),

    # ------------------------------------------------------------ Dashboard ------------------------------------------------------------
    path('dashboard/pet-owner/<str:username>/', PetOwnerDashboardView.as_view(), name='pet_owner_dashboard'),
    path('dashboard/vet-clinic/<str:username>/', VetClinicDashboardView.as_view(), name='vet_clinic_dashboard'),
    path('dashboard/welfare-organization/<str:username>/', WelfareOrganizationDashboardView.as_view(), 
         name='welfare_organization_dashboard'),
]