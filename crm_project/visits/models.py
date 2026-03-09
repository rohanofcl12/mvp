from django.db import models
from leads.models import Lead

class Visit(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='visits')
    agent = models.ForeignKey('accounts.Agent', on_delete=models.SET_NULL, null=True, blank=True)
    visit_date = models.DateField()
    visit_time = models.TimeField()
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('SCHEDULED', 'Scheduled'),
            ('COMPLETED', 'Completed'),
            ('CANCELLED', 'Cancelled'),
        ],
        default='SCHEDULED'
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['visit_date', 'visit_time']

    def __str__(self):
        return f"{self.lead.name} - {self.visit_date}"