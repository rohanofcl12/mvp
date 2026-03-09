from rest_framework import serializers
from .models import Visit
from apps.accounts.models import Agent

class AgentSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'name', 'email']

class VisitSerializer(serializers.ModelSerializer):
    agent = AgentSimpleSerializer(read_only=True)
    lead = serializers.StringRelatedField()

    class Meta:
        model = Visit
        fields = [
            'id', 'lead', 'agent', 'visit_date', 'visit_time',
            'location', 'status', 'notes', 'created_at', 'updated_at'
        ]

class VisitCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['lead', 'agent', 'visit_date', 'visit_time', 'location', 'status', 'notes']
