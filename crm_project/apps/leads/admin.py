from django.contrib import admin
from .models import Lead, ActivityLog

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'source', 'stage', 'assigned_agent', 'created_at']
    list_filter = ['stage', 'source', 'assigned_agent']
    search_fields = ['name', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at', 'intelligence_score']

    def intelligence_score(self, obj):
        return obj.intelligence_score
    intelligence_score.short_description = 'Score'

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['lead', 'action', 'timestamp', 'performed_by']
    list_filter = ['action', 'timestamp']
    search_fields = ['lead__name', 'notes']
