from django.db import models
from apps.leads.models import Lead
from apps.accounts.models import Agent

STATUS_CHOICES = [
    ('scheduled', 'Scheduled'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
    ('no_show', 'No Show'),
]

class Visit(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='visits')
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='visits')
    visit_date = models.DateField()
    visit_time = models.TimeField()
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.lead.name} - {self.visit_date} {self.visit_time}"

    class Meta:
        ordering = ['visit_date', 'visit_time']
