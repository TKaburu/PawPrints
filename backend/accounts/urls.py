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
    path('current-user-details/', GetUserView.as_view(), name='user'),

    # ------------------------------------------------------------ Dashboard ------------------------------------------------------------
    path('dashboard/pet-owner/<str:username>/', PetOwnerDashboardView.as_view(), name='pet_owner_dashboard'),
    path('dashboard/vet-clinic/<str:username>/', VetClinicDashboardView.as_view(), name='vet_clinic_dashboard'),
]