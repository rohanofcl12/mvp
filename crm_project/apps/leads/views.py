from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Lead, ActivityLog
from apps.accounts.models import Agent
from .serializers import LeadSerializer, LeadCreateUpdateSerializer

class LeadListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LeadSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            agent = Agent.objects.get(user=user)
            # Agents can see leads assigned to them or all if admin/manager
            if agent.role in ['admin', 'manager']:
                return Lead.objects.all()
            return Lead.objects.filter(assigned_agent=agent)
        except Agent.DoesNotExist:
            return Lead.objects.none()

    def perform_create(self, serializer):
        lead = serializer.save()
        # Log activity
        ActivityLog.objects.create(
            lead=lead,
            action='created',
            notes=f"Lead created with source: {lead.source}",
            performed_by=Agent.objects.get(user=self.request.user) if hasattr(self.request.user, 'agent_profile') else None
        )

class LeadDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LeadSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        try:
            agent = Agent.objects.get(user=user)
            if agent.role in ['admin', 'manager']:
                return Lead.objects.all()
            return Lead.objects.filter(assigned_agent=agent)
        except Agent.DoesNotExist:
            return Lead.objects.none()

    def perform_update(self, serializer):
        lead = serializer.save()
        # Log activity if stage changed
        if 'stage' in serializer.validated_data:
            action_map = {
                'CONTACTED': 'contacted',
                'VISIT_SCHEDULED': 'visit_scheduled',
                'VISIT_DONE': 'visit_completed',
                'CLOSED': 'closed',
                'LOST': 'lost'
            }
            action = action_map.get(lead.stage)
            if action:
                ActivityLog.objects.create(
                    lead=lead,
                    action=action,
                    notes=f"Stage updated to {lead.get_stage_display()}",
                    performed_by=Agent.objects.get(user=self.request.user) if hasattr(self.request.user, 'agent_profile') else None
                )

class AssignAgentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        lead = get_object_or_404(Lead, pk=pk)
        agent_id = request.data.get('agent_id')
        agent = get_object_or_404(Agent, pk=agent_id)

        lead.assigned_agent = agent
        lead.save()

        # Log activity
        ActivityLog.objects.create(
            lead=lead,
            action='assigned',
            notes=f"Assigned to {agent.name}",
            performed_by=Agent.objects.get(user=request.user) if hasattr(request.user, 'agent_profile') else None
        )

        serializer = LeadSerializer(lead)
        return Response(serializer.data)

class UpdateStageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        lead = get_object_or_404(Lead, pk=pk)
        stage = request.data.get('stage')
        if stage not in dict(Lead.STAGE_CHOICES).keys():
            return Response(
                {'error': 'Invalid stage'},
                status=status.HTTP_400_BAD_REQUEST
            )

        lead.stage = stage
        lead.save()

        # Log activity
        action_map = {
            'CONTACTED': 'contacted',
            'VISIT_SCHEDULED': 'visit_scheduled',
            'VISIT_DONE': 'visit_completed',
            'CLOSED': 'closed',
            'LOST': 'lost'
        }
        action = action_map.get(stage)
        if action:
            ActivityLog.objects.create(
                lead=lead,
                action=action,
                notes=f"Stage updated to {lead.get_stage_display()}",
                performed_by=Agent.objects.get(user=request.user) if hasattr(request.user, 'agent_profile') else None
            )

        serializer = LeadSerializer(lead)
        return Response(serializer.data)
