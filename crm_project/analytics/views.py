from datetime import date, timedelta
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from leads.models import Lead
from visits.models import Visit

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    total_leads = Lead.objects.count()
    leads_by_stage = Lead.objects.values('stage').annotate(count=Count('stage')).order_by('stage')
    today = date.today()
    visits_today = Visit.objects.filter(visit_date=today).count()
    closed_deals = Lead.objects.filter(stage='CLOSED').count()
    lost_deals = Lead.objects.filter(stage='LOST').count()

    # Prepare leads_by_stage dict
    stage_dict = {choice[0]: 0 for choice in Lead._meta.get_field('stage').choices}
    for item in leads_by_stage:
        stage_dict[item['stage']] = item['count']

    # Daily inflow (last 7 days)
    inflow_data = {}
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        count = Lead.objects.filter(created_at__date=d).count()
        inflow_data[d.strftime('%Y-%m-%d')] = count

    return Response({
        'total_leads': total_leads,
        'leads_by_stage': stage_dict,
        'visits_today': visits_today,
        'closed_deals': closed_deals,
        'lost_deals': lost_deals,
        'daily_inflow': inflow_data,
    })