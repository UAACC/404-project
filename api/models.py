from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
import uuid


def _list():
    return []


class Node(models.Model):
    domain = models.CharField(max_length=256, unique=True)
    auth = models.CharField(max_length=256, unique=True, null=False)


class Author(AbstractUser):
    type = "author"
    id = models.URLField(primary_key=True, max_length=256)
    host = models.URLField(max_length=256, default='')
    url = models.URLField(max_length=256, default='')
    displayName = models.CharField(max_length=55, default='')
    username = models.CharField(max_length=300, unique=True)
    password = models.CharField(max_length=300)
    email = models.EmailField(null=True, blank=True)
    github = models.URLField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)


class Comment(models.Model):
    type = "comment"
    author = models.CharField(max_length=256, default="")
    post = models.CharField(max_length=256, default="")
    comment = models.TextField()
    contentType = models.CharField(max_length=256, default="")
    published = models.DateTimeField(default=timezone.now)
    id = models.CharField(primary_key=True, max_length=256)


class Post(models.Model):

    type = "post"

    id = models.URLField(primary_key=True, max_length=256)
    title = models.CharField(max_length=256)
    source = models.URLField(max_length=256, default='')
    origin = models.URLField(max_length=256, default='')
    description = models.CharField(max_length=256, default='')
    contentType = models.CharField(max_length=55, default='')
    content = models.TextField(blank=True)
    visibility = models.CharField(max_length=256,
                                  default="PUBLIC")
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="posts", max_length=256)
    published = models.DateTimeField(default=timezone.now)
    comment = models.URLField(max_length=256, default='')  # it is url

    # comments = models.ForeignKey(
    #     Comment, on_delete=models.CASCADE, related_name="comments", blank=True, max_length=1024)

    categories = models.JSONField(
        default=_list, blank=True, null=True)  # team1 suggestion
    count = models.IntegerField(default=0, blank=True, null=True)
    size = models.IntegerField(default=0, blank=True, null=True)
    unlisted = models.BooleanField(default=False, blank=True, null=True)

    #image = models.ImageField(null = True, blank = True, upload_to= "images/")

    def __str__(self):
        return self.title + ' | ' + str(self.id)

    class Meta:
        ordering = ['-published']


class Like(models.Model):
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="likes", null=True)
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name="likes", null=True, blank=True)
    published = models.DateTimeField(default=timezone.now)


class FriendRequest(models.Model):
    class Meta:
        unique_together = (("actor", "object"),)

    Friendship_status = (("R", "Requested"),
                         ("A", "Accepted"), ("D", "Declined"))
    actor = models.CharField(max_length=256, blank=False)

    object = models.CharField(max_length=256, blank=False)
    status = models.CharField(
        choices=Friendship_status, default="Requested", max_length=1)

# u


class Likes(models.Model):
    type = 'Like'
    context = models.URLField(max_length=256, default='')
    summary = models.CharField(max_length=256, default='')
    author = models.URLField(max_length=256, default='')  # it is an actor
    object = models.URLField(max_length=256, default='')


class Inbox(models.Model):
    type = models.CharField(max_length=256, default='')
    author = models.CharField(max_length=256, default="")
    items = models.JSONField(null=True)


