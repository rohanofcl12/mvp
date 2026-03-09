from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Agent
from .serializers import AgentSerializer

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.filter(is_active=True)
    serializer_class = AgentSerializer
    permission_classes = [permissions.AllowAny]