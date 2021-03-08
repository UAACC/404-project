from rest_framework import viewsets, status,generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .serializers import AuthorSerializer, PostSerializer, CommentSerializer, LikeSerializer,UpdateSerializer,PostCreateSerializer,CategorySerializer
from .models import Author, Post, Category, Like, Comment, FriendRequest
from .serializers import FriendRequestSerializer
from django.http import JsonResponse, HttpResponse
from .permissions import IsOwnerOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = (AllowAny, )

    def create(self, request):
        try:
            author = Author.objects.get(username=request.data['username'])
            token = Token.objects.get(user=author)
            response = {'id': author.id, 'username': author.username, 'password': author.password, 'token': token.key}
            return JsonResponse(response)
        except:
            author = Author.objects.create(
                username=request.data['username'],
                password=request.data['password'],
            )
            token = Token.objects.create(user=author)
            response = {'id': author.id, 'username': author.username, 'password': author.password, 'token': token.key}
            return JsonResponse(response)


# Like & Comment
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )

    def create(self, request):
        author = Author.objects.get(username=request.user)
        try:
            commentId = request.data['comment']
            comment = Comment.objects.get(id=commentId)
            try:
                like = Like.objects.get(author=author, comment=comment)
                like.delete()
                return HttpResponse('Good request, like is deleted')
            except:
                Like.objects.create(author=author, comment=comment)
                return HttpResponse('Good request, like is created')
        except:
            try:
                postId = request.data['post']
                post = Post.objects.get(id=postId)
                try:
                    like = Like.objects.get(author=author, post=post)
                    like.delete()
                    return HttpResponse('Good request, like is deleted')
                except:
                    Like.objects.create(author=author, post=post)
                    return HttpResponse('Good request, like is created')
            except:
                return HttpResponse('Bad request')



class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )

    def create(self, request):
        author = Author.objects.get(username=request.user)
        content = request.data['content']
        post = Post.objects.get(id=request.data['post'])
        Comment.objects.create(author=author, post=post, content=content)
        return HttpResponse('Good request, comment created!')


# Post
class PostList(generics.ListAPIView):
    
    serializer_class = PostSerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        #import pdb; pdb.set_trace()
        public_posts = Post.postobjects.filter(publicity = True)
        return public_posts

class PostCreate(generics.CreateAPIView):
    queryset = Post.postobjects.all()
    serializer_class = PostCreateSerializer
    # authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveAPIView):
    queryset = Post.postobjects.all()
    serializer_class = PostSerializer
    # authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

class UpdatePost(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.postobjects.all()
    serializer_class = UpdateSerializer
    
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)


class DeletePost(generics.DestroyAPIView):
    queryset = Post.postobjects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, )
    

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)


# Friend Request
class FriendRequestViewSet(viewsets.ModelViewSet):
    serializer_class = FriendRequestSerializer
    queryset = FriendRequest.objects.all()

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        return super(FriendRequestViewSet, self).get_permissions()

    def create(self, request, *args, **kwargs):
    # create friend request
        from_user_id = Author.objects.get(id=request.data["from_user"])
        to_user_id = Author.objects.get(id=request.data["to_user"])

        if FriendRequest.objects.filter(from_user=from_user_id, to_user=to_user_id, status="R").exists():
        # Check if the request alreay exists and status is "requested".
            return Response("Unable to send friend request because the friend request alreay exists!")
        elif FriendRequest.objects.filter(from_user=from_user_id, to_user=to_user_id, status="A").exists():
        # Check if the request exists and status is "A"
            return Response("Unable to send friend request because you have already become friends!")
        elif FriendRequest.objects.filter(from_user=from_user_id, to_user=to_user_id, status="D").exists():
        # If your reuqest was declined and send again
            FriendRequest.objects.update(from_user=from_user_id, to_user=to_user_id, status='R')
            return Response("Successfully create the friend request!")

        elif FriendRequest.objects.filter(from_user=to_user_id, to_user=from_user_id, status="R").exists():
        # if he already send the request to you and status is R, then you become friend automatically
            FriendRequest.objects.update(from_user=to_user_id, to_user=from_user_id, status='A')
            return Response("He/She had sent the request to you and you become friend automatically!")
        elif FriendRequest.objects.filter(from_user=to_user_id, to_user=from_user_id, status="A").exists():
            return Response("Unable to send friend request because you have already become friends!")
        elif FriendRequest.objects.filter(from_user=to_user_id, to_user=from_user_id, status="D").exists():
            FriendRequest.objects.update(from_user=to_user_id, to_user=from_user_id, status='R')
            return Response("Successfully create the friend request!")

        else:
            friend_request = FriendRequest.objects.create(from_user=from_user_id, to_user=to_user_id, status='R')
            return Response("Successfully create the friend request!")
        
    def accept_incoming_request(self, request, *args, **kwargs):
    # accept incoming friend request
        request_from_user_id = Author.objects.get(id=request.data["from_user"])
        current_user_id = Author.objects.get(id=request.data["to_user"])
        if FriendRequest.objects.filter(from_user=request_from_user_id, to_user=current_user_id, status='A').exists():
        # Check if the request has already been accepted
            return Response("Unable to accept, because you had already accepted it!")
        elif FriendRequest.objects.filter(from_user=request_from_user_id, to_user=current_user_id, status='D').exists():
        # Check if the request has already been declined
            return Response("Unable to accept, because you had already declined it!")
        elif FriendRequest.objects.filter(from_user=request_from_user_id, to_user=current_user_id, status='R').exists():
        # If request exists and status is Requested, then able to accept:
            FriendRequest.objects.update(from_user=request_from_user_id, to_user=current_user_id, status='A')
            return Response("Successfully accept the friend request!")
        else:
            return Response("Unable to accept because this request does not exist.")
        
    def decline_incoming_request(self, request, *args, **kwargs):
    # decline incoming friend request
        request_from_user_id = Author.objects.get(id=request.data["from_user"])
        current_user_id = Author.objects.get(id=request.data["to_user"])
        if FriendRequest.objects.filter(from_user=request_from_user_id, to_user=current_user_id, status='A').exists():
        # Check if the request has already been accepted
            return Response("Unable to decline because you had already accepted it!")
        elif FriendRequest.objects.filter(from_user=request_from_user_id, to_user=current_user_id, status='D').exists():
        # Check if the request has already been delined
            return Response("Unable to decline because you had already declined it!")
        elif FriendRequest.objects.filter(from_user=request_from_user_id, to_user=current_user_id, status='R').exists():
        # Successfully decline this friend request
            FriendRequest.objects.update(from_user=request_from_user_id, to_user=current_user_id, status='D')
            return Response("Successfully decline this friend request!")
        else:
        # Request does not exist
            return Response("Unable to decline because this request does not exist.")
    
    def delete(self, request, *args, **kwargs):
    # delete friend(only available when the status of request is 'Accepted')
        user_1 = Author.objects.get(id=request.data["from_user"])
        user_2 = Author.objects.get(id=request.data["to_user"])
        if FriendRequest.objects.filter(from_user=user_1, to_user=user_2, status='A').exists():
        # user1 create the friend request and user1 delete 
            FriendRequest.objects.filter(from_user=user_1, to_user=user_2, status='A').delete()
            return Response("Successfully delete this friend!")
        elif FriendRequest.objects.filter(from_user=user_2, to_user=user_1, status='A').exists():
        # user2 create the friend request and userr1 delete
            FriendRequest.objects.filter(from_user=user_2, to_user=user_1, status='A').delete()
            return Response("Successfully delete this friend!")
        else:
            return Response("Unable to delete because you are not friends.")

    