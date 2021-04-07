from rest_framework import serializers
from .models import Node, Author, Post, Comment, Like, FriendRequest


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






class AuthorSerializer(serializers.ModelSerializer):

    #posts = PostSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
    #comments = CommentSerializer(many=True, required=False)

    class Meta:
        model = Author
        fields = ('id','type', 'host', 'displayName', 'url', 'github','email','username','password','is_approved')
        
class PostSerializer(serializers.ModelSerializer):

    comments = CommentSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
    author = AuthorSerializer(many=False, required=True)
    
    class Meta:
        model = Post
        fields = ['id','type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categorie', 'count', 'size','comments' , 'published', 'visibility', 'unlisted']

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['from_user', 'to_user', 'status']
