from django.db import models
from django.contrib.auth.models import User

class File(models.Model):
    user = models.ForeignKey(User,related_name="files",on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    file = models.FileField(upload_to="media")
    created_at = models.DateTimeField(auto_now_add=True)

