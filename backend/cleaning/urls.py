from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.CleaningDepartmentView.as_view()),  
    path('lanes/', views.CleaningLanesByUserDepotView.as_view()),
]