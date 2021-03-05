from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
import uuid

class Author(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    email = models.EmailField(null=True, blank=True)
    github = models.URLField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)


class Category(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    owner = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='categories')
    posts = models.ManyToManyField('Post', related_name='categories', blank=True)

    class Meta:
        verbose_name_plural = 'categories'


class Post(models.Model):

    class PostObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset().all()

    title = models.CharField(max_length=256)
    description = models.CharField(max_length=256, default="")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="posts")
    published = models.DateTimeField(default=timezone.now)
    # image = models.ImageField(null = True, blank = True, upload_to= "images/")
    # status = models.CharField(max_length = 10, choices = options, default = 'public')
    publicity = models.BooleanField(default=True)
    
    objects= models.Manager() #defaut
    postobjects = PostObjects()

    def __str__(self):
        return self.title +' | ' + str(self.id)


class Comment(models.Model):
    content = models.CharField(max_length=256, default="")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    published = models.DateTimeField(default=timezone.now)


class Like(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes", null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes", null=True)
    published = models.DateTimeField(default=timezone.now)


class FriendRequest(models.Model):
    class Meta:
        unique_together = (("from_user", "to_user"),)

    Friendship_status = (("R", "Requested"), ("A", "Accepted"), ("D", "Declined"))
    from_user = models.ForeignKey(Author, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(Author, related_name='to_user', on_delete=models.CASCADE)
    status = models.CharField(choices=Friendship_status, default= "Requested", max_length= 1)