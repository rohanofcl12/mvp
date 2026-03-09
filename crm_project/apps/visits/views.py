from rest_framework import generics, permissions
from .models import Visit
from apps.accounts.models import Agent
from .serializers import VisitSerializer

class VisitListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VisitSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            agent = Agent.objects.get(user=user)
            if agent.role in ['admin', 'manager']:
                return Visit.objects.all()
            return Visit.objects.filter(agent=agent)
        except Agent.DoesNotExist:
            return Visit.objects.none()

class VisitDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VisitSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        try:
            agent = Agent.objects.get(user=user)
            if agent.role in ['admin', 'manager']:
                return Visit.objects.all()
            return Visit.objects.filter(agent=agent)
        except Agent.DoesNotExist:
            return Visit.objects.none()
