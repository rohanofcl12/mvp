from django.contrib import admin
from .models import Agent

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['name', 'email', 'phone']
