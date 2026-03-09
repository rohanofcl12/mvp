from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Visit
from .serializers import VisitSerializer
from leads.models import Lead

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all().select_related('lead', 'agent')
    serializer_class = VisitSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(visit_date=date)
        return queryset

    def perform_create(self, serializer):
        visit = serializer.save()
        lead = visit.lead
        # Update lead stage to VISIT_SCHEDULED if not already done
        if lead.stage == 'CONTACTED':
            lead.stage = 'VISIT_SCHEDULED'
            lead.save()

    @action(detail=False, methods=['get'])
    def today(self, request):
        from datetime import date
        today = date.today()
        visits = self.get_queryset().filter(visit_date=today)
        serializer = self.get_serializer(visits, many=True)
        return Response(serializer.data)