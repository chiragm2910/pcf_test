from django.db import models


class Customer(models.Model):
    SUBSCRIPTION_TYPES = (
        ('free', 'Free'),
        ('plus', 'Plus'),
        ('pro', 'Pro'),
    )
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subscription_type = models.CharField(max_length=5, choices=SUBSCRIPTION_TYPES)
    modified_date = models.DateTimeField(auto_now=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def to_dict(self):
        data = {}
        for field in self._meta.fields:
            data[field.attname] = getattr(self, field.attname)
        return data
