from rest_framework import serializers
from .models import Author, Post, Comment, Like,Category, FriendRequest

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
    likes = LikeSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'author', 'comments', 'likes', 'published', 'publicity','categories']

    
class PostCreateSerializer(serializers.ModelSerializer):

    comments = CommentSerializer(many=True, required=False)
    likes = LikeSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'comments', 'likes', 'published','publicity']


class UpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'published', 'publicity']


class AuthorSerializer(serializers.ModelSerializer):

    posts = PostSerializer(many=True, required=False)
    likes = LikeSerializer(many=True, required=False)
    comments = CommentSerializer(many=True, required=False)

    class Meta:
        model = Author
        fields = ('id', 'username', 'password', 'email', 'bio', 'github', 'is_approved', 'posts', 'likes', 'comments')


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['from_user', 'to_user', 'status']