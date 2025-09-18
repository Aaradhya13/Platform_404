from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.InspectionDepartmentView.as_view()),  
    path('lanes/', views.InspectionLanesByUserDepotView.as_view()),
    path('jobcards/', views.JobCardAPIView.as_view()),
]