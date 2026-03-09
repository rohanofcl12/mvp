from django.contrib import admin
from .models import Visit

@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ['lead', 'agent', 'visit_date', 'visit_time', 'location', 'status']
    list_filter = ['status', 'visit_date', 'agent']
    search_fields = ['lead__name', 'location']
    date_hierarchy = 'visit_date'
