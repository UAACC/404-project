from rest_framework import serializers
from .models import Node, Author, Post, Comment, Like, Category, FriendRequest


class NodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Node
        fields = ['id', 'domain']


class LikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Like
        fields = ['id', 'author', 'post', 'comment', 'published']


class CommentSerializer(serializers.ModelSerializer):

    likes = LikeSerializer(many=True, required=False)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'post', 'likes', 'published']


class CategorySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='Author.username')
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'owner', 'posts']


class PostSerializer(serializers.ModelSerializer):

    comments = CommentSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
#sadasda
    class Meta:
        model = Post
        fields = ['id','type', 'title', 'source', 'origin', 'description', 'contentType', 'content', 'author', 'categories', 'count', 'size','comments' , 'published', 'visibility', 'unlisted']


class AuthorSerializer(serializers.ModelSerializer):

    #posts = PostSerializer(many=True, required=False)
    #likes = LikeSerializer(many=True, required=False)
    #comments = CommentSerializer(many=True, required=False)

    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'displayName', 'url', 'github','email','username','password']


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['from_user', 'to_user', 'status']
