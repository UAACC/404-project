from rest_framework import serializers
from .models import Node, Author, Post, Comment, Like, FriendRequest, Likes, Inbox


class NodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Node
        fields = ['id', 'domain','auth']


class LikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Like
        fields = ['id', 'author', 'post', 'comment', 'published']


class CommentSerializer(serializers.ModelSerializer):

    # likes = LikeSerializer(many=True, required=False)

    class Meta:
        model = Comment
        # fields = ['id', 'content', 'author', 'post', 'likes', 'published']
        fields = ['type', 'author', 'post', 'comment', 'contentType', 'published', 'id']

class Author_neat_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('type','id', 'host', 'displayName', 'url', 'github')


class AuthorSerializer(serializers.ModelSerializer):

    #posts = PostSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
    #comments = CommentSerializer(many=True, required=False)

    class Meta:
        model = Author
        fields = ('id','type', 'host', 'displayName', 'url', 'github','email','username','password','is_approved')
        

class PostSerializer(serializers.ModelSerializer):

    # comments = CommentSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
    author = AuthorSerializer(many=False, required=True)
    
    class Meta:
        model = Post
        fields = ['id','type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories','comment', 'published', 'visibility', 'unlisted']

class Post_response_Serializer(serializers.ModelSerializer):

    # comments = CommentSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
    author = AuthorSerializer(many=False, required=True)
    
    class Meta:
        model = Post
        fields = ['id','type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories','count', 'size','comment', 'published', 'visibility', 'unlisted']

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['actor', 'object', 'status']


class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = ['type', 'context', 'summary', 'author', 'object']


class InboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = ['type', 'author', 'items']

# class ItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Inbox
#         fields = ['type', 'author', 'items']


