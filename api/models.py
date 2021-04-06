from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
import uuid


class Node(models.Model):
    domain = models.CharField(max_length=256, unique=True)
    auth = models.CharField(max_length=256, unique=True, null = False)


class Author(AbstractUser):
    type = "author"
    id = models.URLField(primary_key=True, max_length=256)
    host = models.URLField(max_length=256,default='')
    url = models.URLField(max_length=256,default='')
    displayName = models.CharField(max_length=55,default='')
    username = models.CharField(max_length=300, unique=True)
    password = models.CharField(max_length=300)
    email = models.EmailField(null=True, blank=True)
    github = models.URLField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)





class Post(models.Model):


    CATE_CHOICES = (
    ('WEB', 'web'),
    ('TUTORIAL', 'tutorial'),
)
    VISIBILITY_CHOICES = (
    ('PUBLIC', 'public'),
    ('PRIVATE', 'private'),
)
    type = "post"


    id = models.URLField(primary_key=True, max_length=256)
    title = models.CharField(max_length=256)
    source = models.URLField(max_length=256, default = '')
    origin = models.URLField(max_length=256, default = '')
    description = models.CharField(max_length=256, default='')
    contentType = models.CharField(max_length=55,default = '')
    content = models.TextField(blank=True)
    visibility = models.CharField(max_length=256,
                  choices=VISIBILITY_CHOICES,
                  default="PUBLIC")
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="posts",max_length=256)
    published = models.DateTimeField(default=timezone.now)
    comment = models.URLField(max_length=256, default = '')
    categorie = models.CharField(max_length=256,
                  choices=CATE_CHOICES,
                  default="WEB")#team1 suggestion
    count = models.IntegerField(default=0,blank=True)
    size = models.IntegerField(default=0)
    unlisted = models.BooleanField(default = False)


    # image = models.ImageField(null = True, blank = True, upload_to= "images/")

    def __str__(self):
        return self.title + ' | ' + str(self.id)


class Comment(models.Model):
    content = models.CharField(max_length=256, default="")
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments")
    published = models.DateTimeField(default=timezone.now)


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
        unique_together = (("from_user", "to_user"),)

    Friendship_status = (("R", "Requested"),
                         ("A", "Accepted"), ("D", "Declined"))
    from_user = models.ForeignKey(
        Author, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        Author, related_name='to_user', on_delete=models.CASCADE)
    status = models.CharField(
        choices=Friendship_status, default="Requested", max_length=1)
