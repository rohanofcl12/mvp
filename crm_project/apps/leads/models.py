from django.db import models
from apps.accounts.models import Agent

STAGE_CHOICES = [
    ('NEW', 'New'),
    ('CONTACTED', 'Contacted'),
    ('VISIT_SCHEDULED', 'Visit Scheduled'),
    ('VISIT_DONE', 'Visit Done'),
    ('CLOSED', 'Closed'),
    ('LOST', 'Lost'),
]

SOURCE_CHOICES = [
    ('website', 'Website'),
    ('referral', 'Referral'),
    ('facebook', 'Facebook'),
    ('instagram', 'Instagram'),
    ('linkedin', 'LinkedIn'),
    ('email', 'Email'),
    ('phone', 'Phone'),
    ('other', 'Other'),
]

class Lead(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='other')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='NEW')
    assigned_agent = models.ForeignKey(
        Agent,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='leads'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    # Lead intelligence score based on source
    @property
    def intelligence_score(self):
        scores = {
            'referral': 10,
            'website': 7,
            'linkedin': 7,
            'email': 6,
            'facebook': 5,
            'instagram': 5,
            'phone': 8,
            'other': 3,
        }
        return scores.get(self.source, 3)

    def __str__(self):
        return f"{self.name} - {self.get_stage_display()}"

    class Meta:
        ordering = ['-created_at']

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('created', 'Lead Created'),
        ('assigned', 'Agent Assigned'),
        ('contacted', 'Contacted'),
        ('visit_scheduled', 'Visit Scheduled'),
        ('visit_completed', 'Visit Completed'),
        ('closed', 'Deal Closed'),
        ('lost', 'Deal Lost'),
        ('note_added', 'Note Added'),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    performed_by = models.ForeignKey(
        Agent,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='performed_actions'
    )

    def __str__(self):
        return f"{self.lead.name} - {self.action}"

    class Meta:
        ordering = ['-timestamp']
