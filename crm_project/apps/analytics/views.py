from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from datetime import date, timedelta
from apps.leads.models import Lead
from apps.visits.models import Visit
from apps.accounts.models import Agent

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Total leads
        total_leads = Lead.objects.count()

        # Leads by stage
        leads_by_stage = Lead.objects.values('stage').annotate(count=Count('id')).order_by('stage')

        # Visits today
        today = date.today()
        visits_today = Visit.objects.filter(visit_date=today).count()

        # Closed deals (last 30 days)
        thirty_days_ago = today - timedelta(days=30)
        closed_deals = Lead.objects.filter(
            stage='CLOSED',
            updated_at__date__gte=thirty_days_ago
        ).count()

        # Daily lead inflow (last 7 days)
        daily_inflow = []
        for i in range(7):
            day = today - timedelta(days=i)
            count = Lead.objects.filter(created_at__date=day).count()
            daily_inflow.append({
                'date': day.strftime('%Y-%m-%d'),
                'count': count
            })
        daily_inflow.reverse()  # Oldest first

        data = {
            'total_leads': total_leads,
            'leads_by_stage': list(leads_by_stage),
            'visits_today': visits_today,
            'closed_deals': closed_deals,
            'daily_lead_inflow': daily_inflow
        }

        return Response(data)
