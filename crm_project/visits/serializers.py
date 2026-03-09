from rest_framework import serializers
from .models import Visit
from leads.models import Lead
from accounts.models import Agent

class VisitSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    agent_name = serializers.CharField(source='agent.name', read_only=True)

    class Meta:
        model = Visit
        fields = ['id', 'lead', 'lead_name', 'agent', 'agent_name', 'visit_date', 'visit_time', 'location', 'status', 'notes']