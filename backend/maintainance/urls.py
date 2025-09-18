from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.MaintainanceDepartmentView.as_view()),  
    path('lanes/', views.MaintainanceLanesByUserDepotView.as_view()),
]