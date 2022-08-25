from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Follower(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name='following')

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    text = models.CharField(max_length=500)
    date_and_time = models.DateTimeField()
    likes = models.ManyToManyField(User, related_name="liked_posts")
