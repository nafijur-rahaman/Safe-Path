from django.urls import path
from .views import UserLoginView,UserLogoutView


urlpatterns = [
    path('user/login/', UserLoginView.as_view(), name='user-login'),
    path('user/logout/', UserLogoutView.as_view(), name='user-logout'),
]
