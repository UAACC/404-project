from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .serializers import NodeSerializer, AuthorSerializer, PostSerializer, CommentSerializer, LikeSerializer, CategorySerializer
from .models import Node, Author, Post, Category, Like, Comment, FriendRequest
from .serializers import FriendRequestSerializer
from django.http import JsonResponse, HttpResponse
from .permissions import IsOwnerOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.decorators import api_view
import uuid

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = (AllowAny, )

#URL: ://service/author/{AUTHOR_ID}/
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = (AllowAny, )

    def all_users(self, request, *args, **kwargs):
        return Response(AuthorSerializer(self.queryset, many=True).data)

    def retrieve(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]
        queryset = Author.objects.get(id=author_id)
        serializer = AuthorSerializer(queryset)
        return Response(serializer.data)

    def create_1(self, request, *args, **kwargs):
        display_name = request.data.get('displayName', None)
        github = request.data.get('github', None)
        if not github:
            github = "https://github.com/changeme"

        author_uid = str(uuid.uuid4().hex)
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        url = author_id
        email = request.data.get('email', None)
        username = request.data.get('username')
        password = request.data.get('password')
        author_data = {'id': author_id, 'host': host, 'url': url,
                       'displayName': display_name, 'github': github,'email':email,'username':username,'password':password}
        serializer = self.serializer_class(data=author_data)
        if serializer.is_valid():
            serializer.save()
        
        


        



    def create(self, request):
        try:
            author = Author.objects.get(username=request.data['username'])
            token = Token.objects.get(user=author)
            response = {'id': author.id, 'username': author.username,
                        'password': author.password, 'token': token.key}
            return JsonResponse(response)
        except:
            author = Author.objects.create(
                username=request.data['username'],
                password=request.data['password'],
            )
            token = Token.objects.create(user=author)
            response = {'id': author.id, 'username': author.username,
                        'password': author.password, 'token': token.key}
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

#URL: ://service/author/{AUTHOR_ID}/posts/{POST_ID}
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )

    def getFullname(self, author_id, post_id, *args, **kwargs):
        host = 'https://nofun.herokuapp.com'#自家服務器
        full_name = f'{host}/author/{author_id}/posts/{post_id}'
        return full_name

    def all_posts(self, request, *args, **kwargs):
        return Response(PostSerializer(self.queryset, many=True).data)

    

    def post_list(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]
        queryset = Post.objects.filter(author=author_id)
        return Response(PostSerializer(queryset, many=True).data)
    
    def post_list_id(self, request, *args, **kwargs):
        request_str = str(request)
        post_id = request_str.split("/")[-1]
        queryset = Post.objects.filter(id=post_id)
        serializer = PostSerializer(queryset)
        return Response(serializer.data)


    def create_1(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_str = str(request)
        author_id = request_str.split("/")[2]
        
        title = request_data.get('title', None)
        source = request_data.get('source', None)
        origin = request_data.get('origin', None)
        description = request_data.get('description', None)
        contentType = request_data.get('contentType', None)
        content = request_data.get('content', None)
        categories = request_data.get('categories', None)
        count = request_data.get('count', None)
        size = request_data.get('size', None)
        comments = request_data.get('comments', None)
        visibility = request_data.get('visibility', None)
        unlisted = request_data.get('unlisted', False)

       
        post_data = {'title': title,'source': source,
                     'origin': origin, 'description': description, 'contentType': contentType,
                     'content': content, 'author': author_id, 'categories': categories,
                     'count': count, 'size': size, 'comments': comments,
                     'visibility': visibility, 'unlisted': unlisted}

        serializer = self.serializer_class(data=post_data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
        


    def create(self, request):
        author = Author.objects.get(username=request.user)
        title = request.data['title']
        description = request.data['description']
        visibility = request.data['visibility']
        post = Post.objects.create(
            author=author, title=title, description=description, visibility=visibility)
        return HttpResponse(post.id)





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




@api_view(['GET', 'POST'])
def commentList(request, *args, **kwargs):
    request_str = str(request)
    author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
    post_id = request_str.split("/")[4]     # post_id: 1, 2, 3, ...
    if request.method == 'GET':
        if Post.objects.filter(author=author_id).exists():
            return Response(Comment.objects.filter(post=post_id).values())
        else:
            return Response("This post does not exist.")
    if request.method == 'POST':
        content = request.data['content']
        author = Author.objects.get(id=author_id)
        post = Post.objects.get(id=post_id)
        Comment.objects.create(author=author, post=post, content=content)
        return Response('Comment created!')


@api_view(['GET'])
def comment(request, *args, **kwargs):
    request_str = str(request)
    author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
    post_id = request_str.split("/")[4]     # post_id: 1, 2, 3, ...
    comment_id = request_str.split("/")[6]

    if Post.objects.filter(author=author_id).exists() and Comment.objects.filter(post=post_id).exists():
        return Response(Comment.objects.filter(post=post_id, id=comment_id).values())
    else:
        return Response("This post/comment does not exist.")


@api_view(['GET'])
def postLike(request, *args, **kwargs):
    request_str = str(request)
    # author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
    post_id = request_str.split("/")[4]     # post_id: 1, 2, 3, ...
    response_body = []
    if Like.objects.filter(post=Post.objects.get(id=post_id)).exists():
        item =  Like.objects.filter(post=Post.objects.get(id=post_id)).values()
        response_body.append(item)
        return Response(response_body)
    return Response("No like for this post")


@api_view(['GET'])
def commentLike(request, *args, **kwargs):
    request_str = str(request)
    # author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
    post_id = request_str.split("/")[4]     # post_id: 1, 2, 3, ...
    comment_id = request_str.split("/")[6]
    response_body = []
    if Like.objects.filter(post=Post.objects.get(id=post_id), comment=Comment.objects.get(id=comment_id)).exists():
        item =  Like.objects.filter(post=Post.objects.get(id=post_id), comment=Comment.objects.get(id=comment_id)).values()
        response_body.append(item)
        return Response(response_body)
    return Response("No like for this post")


@api_view(['GET'])
def likedList(request, *args, **kwargs):
    request_str = str(request)
    author_id = request_str.split("/")[2]
    if Like.objects.filter(author_id=Author.objects.get(id=author_id)).exists():
        item = Like.objects.filter(author_id=Author.objects.get(id=author_id)).values()
        return Response(item)
    return Response("You have not liked any posts. ")

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
            FriendRequest.objects.update(
                from_user=from_user_id, to_user=to_user_id, status='R')
            return Response("Successfully create the friend request!")

        elif FriendRequest.objects.filter(from_user=to_user_id, to_user=from_user_id, status="R").exists():
            # if he already send the request to you and status is R, then you become friend automatically
            FriendRequest.objects.update(
                from_user=to_user_id, to_user=from_user_id, status='A')
            return Response("He/She had sent the request to you and you become friend automatically!")
        elif FriendRequest.objects.filter(from_user=to_user_id, to_user=from_user_id, status="A").exists():
            return Response("Unable to send friend request because you have already become friends!")
        elif FriendRequest.objects.filter(from_user=to_user_id, to_user=from_user_id, status="D").exists():
            FriendRequest.objects.update(
                from_user=to_user_id, to_user=from_user_id, status='R')
            return Response("Successfully create the friend request!")

        else:
            friend_request = FriendRequest.objects.create(
                from_user=from_user_id, to_user=to_user_id, status='R')
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
            FriendRequest.objects.update(
                from_user=request_from_user_id, to_user=current_user_id, status='A')
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
            FriendRequest.objects.update(
                from_user=request_from_user_id, to_user=current_user_id, status='D')
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
            FriendRequest.objects.filter(
                from_user=user_1, to_user=user_2, status='A').delete()
            return Response("Successfully delete this friend!")
        elif FriendRequest.objects.filter(from_user=user_2, to_user=user_1, status='A').exists():
            # user2 create the friend request and userr1 delete
            FriendRequest.objects.filter(
                from_user=user_2, to_user=user_1, status='A').delete()
            return Response("Successfully delete this friend!")
        else:
            return Response("Unable to delete because you are not friends.")

@api_view(['GET'])
def getFollowers(request, *args, **kwargs):
    request = str(request)
    author_id = request.split("/")[2]   # currently the author_id is the pure UUID
    current_user = Author.objects.get(id=author_id)
    follower_list = {"type": "followers", "items": []}
    if FriendRequest.objects.filter(to_user=current_user, status='R').exists() or FriendRequest.objects.filter(to_user=current_user, status='A').exists():
        # for item in FriendRequest.objects.filter(to_user=current_user, status='R').values():
        #     follower_list["items"].append(item)
        # for item in FriendRequest.objects.filter(to_user=current_user, status='R').values():
        #     follower_list["items"].append(item)

        for item in FriendRequest.objects.filter(to_user=current_user, status='R').values():
            follower_id=item["from_user_id"]
            this_follower = Author.objects.filter(id=follower_id)
            follower_list["items"].append(this_follower.values()[0])
        for item in FriendRequest.objects.filter(to_user=current_user, status='A').values():
            follower_id=item["from_user_id"]
            this_follower = Author.objects.filter(id=follower_id)
            follower_list["items"].append(this_follower.values()[0])
        return Response(follower_list)
    else:
        return Response("You doesn't have any followers.")


@api_view(['GET', 'PUT', 'DELETE'])
def operateFollowers(request, *args, **kwargs):
    request_str = str(request)
    author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
    foreign_id = request_str.split("/")[4]   # currently the author_id is the pure UUID
    current_user = Author.objects.get(id=author_id)
    checking_user = Author.objects.get(id=foreign_id)
    if request.method == 'GET':
        if FriendRequest.objects.filter(to_user=current_user, from_user=checking_user, status='R').exists():
            return Response({'exist': True})
        elif FriendRequest.objects.filter(to_user=current_user, from_user=checking_user, status='A').exists():
            # return Response("This author is your follower. ")
            return Response({'exist': True})
        elif FriendRequest.objects.filter(to_user=checking_user, from_user=current_user, status='A').exists():
            # return Response("This author is your follower. ")
            return Response({'exist': True})
        else:
            # return Response("This author is not your follower! ")
            return Response({'exist': False})

    if request.method == 'DELETE':
        FriendRequest.objects.filter(from_user=current_user, to_user=checking_user, status='A').delete()
        FriendRequest.objects.filter(from_user=checking_user, to_user=current_user, status='A').delete()
        FriendRequest.objects.filter(from_user=checking_user, to_user=current_user, status='R').delete()
        return Response("Successfully removed this follower.")

    if request.method == 'PUT':
        FriendRequest.objects.filter(from_user=checking_user, to_user=current_user, status='R').update()
        return Response("Successfully add this follower.")


@api_view(['GET'])
def friendList(request, *args, **kwargs):
    request = str(request)
    author_id = request.split("/")[2]   # currently the author_id is the pure UUID
    current_user = Author.objects.get(id=author_id)
    friend_list = []
    if FriendRequest.objects.filter(to_user=current_user, status='A').exists() or FriendRequest.objects.filter(from_user=current_user, status='A').exists():
        for item in FriendRequest.objects.filter(to_user=current_user, status='A').values():
            this_friend_id=item["from_user_id"]
            this_friend = Author.objects.filter(id=this_friend_id).values()
            friend_list.append(this_friend)
        for item in FriendRequest.objects.filter(from_user=current_user, status='A').values():
            this_friend_id=item["to_user_id"]
            this_friend = Author.objects.filter(id=this_friend_id).values()
            friend_list.append(this_friend)
        return Response(friend_list)
    else:
        return Response("You doesn't have any friends.")

    