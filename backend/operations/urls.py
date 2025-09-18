from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.OperationsDepartmentView.as_view()),  
    path('lanes/', views.ParkingLanesByUserDepotView.as_view()),
    path('timetable/', views.TimetableWithScheduleView.as_view()),
    path('trainsets/', views.TrainsetView.as_view()),
]