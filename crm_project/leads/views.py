from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Lead, ActivityLog
from .serializers import LeadSerializer, LeadAssignSerializer, StageUpdateSerializer, ActivityLogSerializer
from datetime import datetime

def log_activity(lead, action, notes=''):
    ActivityLog.objects.create(lead=lead, action=action, notes=notes)

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().select_related('assigned_agent').prefetch_related('activities')
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        lead = serializer.save()
        log_activity(lead, 'Lead Created', f'Lead {lead.name} was created')

    def perform_update(self, serializer):
        lead = self.get_object()
        old_stage = lead.stage
        old_agent = lead.assigned_agent
        lead = serializer.save()
        new_stage = lead.stage
        new_agent = lead.assigned_agent

        if old_agent != new_agent and new_agent:
            log_activity(lead, 'Agent Assigned', f'Assigned to {new_agent.name}')
        if old_stage != new_stage:
            log_activity(lead, 'Stage Updated', f'Changed from {old_stage} to {new_stage}')

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        lead = self.get_object()
        serializer = LeadAssignSerializer(data=request.data)
        if serializer.is_valid():
            agent = serializer.validated_data['assigned_agent']
            lead.assigned_agent = agent
            lead.save()
            log_activity(lead, 'Agent Assigned', f'Lead assigned to {agent.name}')
            return Response({'status': 'assigned', 'agent': agent.name})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def stage(self, request, pk=None):
        lead = self.get_object()
        serializer = StageUpdateSerializer(data=request.data)
        if serializer.is_valid():
            old_stage = lead.stage
            new_stage = serializer.validated_data['stage']
            lead.stage = new_stage
            lead.save()
            log_activity(lead, 'Stage Updated', f'Changed from {old_stage} to {new_stage}')
            return Response({'status': 'stage updated', 'stage': new_stage})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def timeline(self, request, pk=None):
        lead = self.get_object()
        activities = lead.activities.all()
        serializer = ActivityLogSerializer(activities, many=True)
        return Response(serializer.data)