from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    pass


class Post(models.Model):
    content = models.CharField(max_length=280)
    created_date = models.DateTimeField(default=timezone.now)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="get_all_posts")
    likes = models.ManyToManyField(User, blank=True, related_name="get_all_liked_posts")

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_date": self.created_date.strftime("%b %#d %Y, %#I:%M %p"),
            "creator_id": self.creator.id,
            "creator_userName": self.creator.username,
            "likes": self.likes.count()
        }


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name="get_followed_profiles")

    def serialize(self):
        return {
            "profile_id": self.user.id,
            "profile_username": self.user.username,
            "followers": self.followers.count(),
            "following": self.user.get_followed_profiles.count()
            
        }
    
    def __str__(self):
        followers_str = ""
        for follower in self.followers.all():
            followers_str+= " " + follower.username
        return self.user.username + " - followed by " + followers_str
    