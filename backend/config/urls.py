from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ChangePasswordView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT Login (username va password yuborilib token olinadi)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Parolni o'zgartirish API
    path('api/change-password/', ChangePasswordView.as_view(), name='change_password'),
]