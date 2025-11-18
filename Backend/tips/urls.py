from django.urls import path
from .views import TipView,GetAllTipsView

urlpatterns = [
    path('tips/create-tip/', TipView.as_view(), name='tip-list-create'),
    path('tips/get-all-tips/', GetAllTipsView.as_view(), name='get-all-tips'),
    path('tips/<int:pk>/update/', TipView.as_view(), name='tip-update'),
    path('tips/<int:pk>/delete/', TipView.as_view(), name='tip-delete'),

    
]