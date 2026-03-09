from rest_framework import serializers
from .models import Lead, ActivityLog
from apps.accounts.models import Agent

class AgentSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'name', 'email', 'phone', 'role']

class LeadSerializer(serializers.ModelSerializer):
    assigned_agent = AgentSimpleSerializer(read_only=True)
    intelligence_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'phone', 'email', 'source', 'stage',
            'assigned_agent', 'created_at', 'updated_at', 'notes',
            'intelligence_score'
        ]

class LeadCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['name', 'phone', 'email', 'source', 'stage', 'assigned_agent', 'notes']

class ActivityLogSerializer(serializers.ModelSerializer):
    performed_by = AgentSimpleSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'action', 'timestamp', 'notes', 'performed_by']
