from django.urls import path
from . import views

urlpatterns = [
    path('visits/', views.VisitListCreateView.as_view(), name='visit-list-create'),
    path('visits/<int:pk>/', views.VisitDetailView.as_view(), name='visit-detail'),
]
