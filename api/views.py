from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer, AuthorSerializer, PostSerializer
from .models import Author, Post
from django.http import HttpResponse

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        print("GET /api/authors/")
        username = request.user['username']
        author = Author.objects.get(username=username)
        return Response(author, status=status.HTTP_200_OK)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (AllowAny, )

# def send_friend_request(request, userID):
#     from_user = request.user
#     to_user = User.objects.get(id=userID)
#     friend_request, created = Friend_Request.objects.get_or_create(
#         from_user = from_user, to_user = to_user
#     )
#     if created:
#         return HttpResponse('Friend request sent')
#     else:
#         return HttpResponse('Friend request not accepted')


# def accept_friend_request(request, requestID):
#     friend_request = Friend_Request.objects.get(id=requestID)
#     if friend_request.to_user == request.user:
#         friend_request.to_user.friends.add(friend_request.from_user)
#         friend_request.from_user.friends.add(friend_request.to_user)
#         friend_request.delete()
#         return HttpResponse('Friend request accepted')
#     else:
#         return HttpResponse('Friend request not accepted')
