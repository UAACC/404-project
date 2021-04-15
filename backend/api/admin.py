from django.contrib import admin
from .models import Node, Author, Post, Comment, Likes, FriendRequest, Inbox
admin.site.register(Node)
admin.site.register(Author)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Likes)
admin.site.register(FriendRequest)
admin.site.register(Inbox)
