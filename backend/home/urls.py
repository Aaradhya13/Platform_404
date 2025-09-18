from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.seed_everything),  # Include URLs from the home app
]