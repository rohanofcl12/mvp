from rest_framework import serializers
from .models import Lead, ActivityLog
from accounts.models import Agent

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'name', 'email', 'phone', 'role']

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'action', 'timestamp', 'notes']

class LeadSerializer(serializers.ModelSerializer):
    assigned_agent = AgentSerializer(read_only=True)
    assigned_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.filter(is_active=True),
        source='assigned_agent',
        write_only=True,
        required=False,
        allow_null=True
    )
    score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lead
        fields = ['id', 'name', 'phone', 'email', 'source', 'stage', 'assigned_agent', 'assigned_agent_id', 'created_at', 'notes', 'score']

class LeadAssignSerializer(serializers.Serializer):
    agent_id = serializers.PrimaryKeyRelatedField(queryset=Agent.objects.filter(is_active=True), source='assigned_agent')

class StageUpdateSerializer(serializers.Serializer):
    stage = serializers.ChoiceField(choices=['NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'VISIT_DONE', 'CLOSED', 'LOST'])