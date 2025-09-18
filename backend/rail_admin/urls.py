from django.urls import path
from . import views

urlpatterns = [
    
    path('users/', views.UserManagementView.as_view()),  
    path('roles/', views.RoleManagementView.as_view()),
    path('departments/', views.DepartmentManagementView.as_view()),
    # path('trainsets/', views.TrainsetCRUDView.as_view()),
]