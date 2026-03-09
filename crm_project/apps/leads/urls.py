from django.urls import path
from . import views

urlpatterns = [
    path('leads/', views.LeadListCreateView.as_view(), name='lead-list-create'),
    path('leads/<int:pk>/', views.LeadDetailView.as_view(), name='lead-detail'),
    path('leads/<int:pk>/assign/', views.AssignAgentView.as_view(), name='assign-agent'),
    path('leads/<int:pk>/stage/', views.UpdateStageView.as_view(), name='update-stage'),
]
