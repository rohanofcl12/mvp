from django.db import models

class Agent(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50, default='Agent')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name