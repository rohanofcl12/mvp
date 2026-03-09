from django.db import models
from django.contrib.auth.models import User

class Agent(models.Model):
    ROLE_CHOICES = [
        ('agent', 'Agent'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent_profile')
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='agent')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def assigned_leads_count(self):
        return self.leads.count()

    @property
    def closed_deals_count(self):
        from apps.leads.models import Lead
        return Lead.objects.filter(assigned_agent=self, stage='CLOSED').count()
