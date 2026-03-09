from django.db import models

# Lead stages as choices
STAGE_CHOICES = [
    ('NEW', 'New'),
    ('CONTACTED', 'Contacted'),
    ('VISIT_SCHEDULED', 'Visit Scheduled'),
    ('VISIT_DONE', 'Visit Done'),
    ('CLOSED', 'Closed'),
    ('LOST', 'Lost'),
]

# Lead sources for scoring
SOURCE_SCORES = {
    'REFERRAL': 10,
    'WEBSITE': 7,
    'FACEBOOK': 5,
    'INSTAGRAM': 5,
    'OTHER': 3,
}

class Lead(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    source = models.CharField(max_length=50, default='OTHER')
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='NEW')
    assigned_agent = models.ForeignKey('accounts.Agent', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    @property
    def score(self):
        """Calculate intelligence score based on source"""
        return SOURCE_SCORES.get(self.source.upper(), 3)

    def __str__(self):
        return self.name

class ActivityLog(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.lead.name} - {self.action}"