from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .serializers import NodeSerializer, AuthorSerializer, PostSerializer, CommentSerializer, LikeSerializer, LikesSerializer, InboxSerializer,Author_neat_Serializer
from .models import Node, Author, Post, Like, Comment, FriendRequest, Likes, Inbox
from .serializers import FriendRequestSerializer
from django.http import JsonResponse, HttpResponse
from .permissions import IsOwnerOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import get_list_or_404, get_object_or_404
import uuid
from itertools import chain
import numpy as np


# =====================================================================================================================================
# Node
# =====================================================================================================================================
class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = (AllowAny, )


# =====================================================================================================================================
# Author
# =====================================================================================================================================
#URL: ://service/author/{AUTHOR_ID}/
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # permission_classes = (AllowAny, )
    #static_author_id = ''

    def all_users(self, request, *args, **kwargs):
        queryset = Author.objects.all()
        serializer = AuthorSerializer(queryset,many = True)
        return Response(serializer.data)

    def retrive(self, request, author_uid=None, *args, **kwargs):
        #request_str = str(request)
        #author_id = request_str.split("/")[2]
        #print(author_id)
        #self.static_author_id = author_id
        #give global to use
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        queryset = Author.objects.get(id=author_id)
        
        serializer = Author_neat_Serializer(queryset)
        return Response(serializer.data)#t5

    def create_1(self, request, *args, **kwargs):
        display_name = request.data.get('displayName')
        github = request.data.get('github')
        


        author_uid = str(uuid.uuid4().hex)
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        url = author_id
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        is_approved = request.data.get('is_approved')
        

        Author.objects.create(
                id = author_id,
                host = host,
                url = url,
                email = email,
                username=username,
                password=password,
                displayName = display_name,
                github = github,
                
                

                )
        #it will return true false and change true false in database and return it out to json
        if is_approved != None:
            if is_approved == 'true':
                Author.objects.filter(pk=author_id).update(is_approved=True)
        else:
           is_approved = Author._meta.get_field('is_approved').get_default()

                
            


        print(is_approved)
        author_data = {'id': author_id, 'host': host, 'url': url,
                       'displayName': display_name, 'github': github,'email':email,'username':username,'password':password,'is_approved':is_approved}

    


            #authentication:



        return JsonResponse(author_data)

    def author_login(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        
        
        try:
            
            author = Author.objects.get(username = username)
            
            
            if password == author.password:
                if author.is_approved:
                    serializer = AuthorSerializer(author)
                    return Response(serializer.data)
                    
                else:
                    return Response(False)
            else:
                return Response(None)


        except:
            return Response(None)






    def update(self, request, author_uid=None, *args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        author = Author.objects.get(id=author_id)
        #print(author.id)
        name = request.data.get('displayName', None)
        email = request.data.get('email',None)
        password = request.data.get('password',None)
        github = request.data.get('github', None)
        author.displayName = name   
        author.github = github
        author.email = email
        author.password =password
        author.save()
        #return frontend need data
        serializer = AuthorSerializer(author)
        return Response(serializer.data)

        



#havent used
    # def create(self, request):
    #     try:
    #         author = Author.objects.get(username=request.data['username'])
    #         token = Token.objects.get(user=author)
    #         response = {'id': author.id, 'username': author.username,
    #                     'password': author.password, 'token': token.key}
    #         return JsonResponse(response)
    #     except:
    #         author = Author.objects.create(
    #             username=request.data['username'],
    #             password=request.data['password'],
    #         )
    #         token = Token.objects.create(user=author)
    #         response = {'id': author.id, 'username': author.username,
    #                     'password': author.password, 'token': token.key}
    #         return JsonResponse(response)


# =====================================================================================================================================
# Post
# =====================================================================================================================================
#URL: ://service/author/{AUTHOR_ID}/posts/{POST_ID}
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    #authentication_classes = (TokenAuthentication, )
    # permission_classes = (AllowAny, )

    

    def all_posts(self, request, *args, **kwargs):
        queryset = Post.objects.all()
        serializer = PostSerializer(queryset,many = True)
        return Response(serializer.data)

    

    def post_list(self, request, author_uid=None, *args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        post = Post.objects.filter(author=Author.objects.get(id=author_id)).values()
        
        # serializer = PostSerializer(post)
        # return Response(serializer.data)
        return Response(post)
        
        #return Response(Post.objects.filter(author=author_id).values())
        

        
    
    def post_list_id(self, request, author_uid=None,  post_id = None,*args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        post_id = f'{host}/author/{author_uid}/posts/{post_id}'
        author_id= f'{host}/author/{author_uid}'
        return Response(Post.objects.filter(author=author_id, id = post_id).values())

    # DELETE a single post using post_id
    # URL: ://service/author/{AUTHOR_ID}/posts/{POST_ID}
    def delete(self, request, author_uid=None,  post_id = None, *args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        post_id = f'{host}/author/{author_uid}/posts/{post_id}'
        post = get_object_or_404(Post, id=post_id)
        
        try:
            post.delete()
        except ValueError:
            return Response("No such a post. Deletion fails.", 500)
        return Response("Delete successful")
    


    def create_1(self, request, author_uid=None,  *args, **kwargs):
        
        post_uid = str(uuid.uuid4().hex)
        host = 'https://nofun.herokuapp.com'
        #author_id = f'{host}/author/{author_id}'
        post_id= f'{host}/author/{author_uid}/posts/{post_uid}'
        author_id= f'{host}/author/{author_uid}'
        comment = f'{host}/author/{author_uid}/posts/{post_uid}/comments'

        title = request.data.get('title')
        
        if request.data.get('source'):
            source = request.data.get('source')
        else:
            source = post_id
    
        if request.data.get('origin'):
            origin = request.data.get('origin')
        else:
            origin = post_id
        description = request.data.get('description')
        contentType = request.data.get('contentType')
        content = request.data.get('content')
        categories = request.data.get('categories')
        count = request.data.get('count')
        published = request.data.get('published')
        size = request.data.get('size')
        comment = comment
        visibility = request.data.get('visibility')
        unlisted = request.data.get('unlisted')
        
        # file_1 = request.data.get('file')
        # print('file',file_1)
        # # img = request.FILES.get('image')
        # print('img',img)
        

        Post.objects.create(
            id= post_id,
            title = title,
            source = source,#fix this 
            origin = origin,#fix this
            description = description,
            contentType = contentType,
            content = content,
            count = count,
            size = size,
            categories = categories,
            comment = comment,
            visibility = visibility,
            published = published,
            unlisted = unlisted,
            author = Author.objects.get(id=author_id),
            # image = img
        )
        

       #return response
        post_data = {'title': title,'source': source,
                     'origin': origin, 'description': description, 'contentType': contentType,
                     'content': content, 'author': author_id, 'categories': categories,
                     'count': count, 'size': size, 'comment': comment,
                     'visibility': visibility, 'unlisted': unlisted, 'id':post_id}


        followers = []
        followers_request_1 = FriendRequest.objects.filter(object = author_id).values()
        for request in followers_request_1:
            followers.append(request["actor"])
        followers_request_2 = FriendRequest.objects.filter(actor = author_id, status = 'A').values()
        for request in followers_request_2:
            followers.append(request["object"])
        print(followers)

        post_data2 = {'type': 'post','title': title,'source': source,
                     'origin': origin, 'description': description, 'contentType': contentType,
                     'content': content, 'author': author_id, 'categories': categories,
                     'count': count, 'size': size, 'comment': comment,
                     'visibility': visibility, 'unlisted': unlisted, 'id':post_id}

        for follower in followers:
            Inbox.objects.create(author=follower, items=post_data2)



        return Response(post_data)
        
    def edit(self, request, author_uid=None,  post_id = None,*args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        comments_id = f'{host}/author/{author_uid}/posts/{post_id}/comments'
        post_id = f'{host}/author/{author_uid}/posts/{post_id}'
        author_id= f'{host}/author/{author_uid}'
        #post = Post.objects.get(id=post_id)
        post = get_object_or_404(Post, id=post_id)
        
        #print('correct',post.title)
        

        title = request.data.get('title')
        #print(title)
        source = request.data.get('source')
        origin = request.data.get('origin')
        description = request.data.get('description')
        contentType = request.data.get('contentType')
        content = request.data.get('content')
        categories = request.data.get('categories')
        count = request.data.get('count')
        size = request.data.get('size')
        comment = comments_id
        visibility = request.data.get('visibility')
        unlisted = post.unlisted
        # img = request.FILES.get('image')
        

        post_data = {'title': title,'source': source,
                    'origin': origin, 'description': description, 'contentType': contentType,
                    'content': content, 'author': author_id, 'categories': categories,
                    'count': count, 'size': size, 'comment': comment,
                    'visibility': visibility, 'unlisted': unlisted,'id':post_id}

        
        
        

    
        Post.objects.filter(pk=post_id).update(
            title = title
                )
        
        # if img:
        #     Post.objects.filter(pk=post_id).update(
        #         image = img
        #         )
        
        post.source = post_id#fix this 

        post.origin = post_id#fix this

        Post.objects.filter(pk=post_id).update(
            description = description
                )

            

        if contentType:
            Post.objects.filter(pk=post_id).update(
                contentType = contentType
                )
            
        
        Post.objects.filter(pk=post_id).update(
            content = content
                )

        if count:
            Post.objects.filter(pk=post_id).update(
                count = count
                )
        if size:
            Post.objects.filter(pk=post_id).update(
                size = size
                )
        

        Post.objects.filter(pk=post_id).update(
            categories = categories
                )

            

        if visibility:
            Post.objects.filter(pk=post_id).update(
                visibility = visibility
                )
           

        #post.author = Author.objects.get(id=author_id)
        
        return Response(post_data)
         

        #return Response('Author updated successfully', 204)

        


    def create_2(self, request, author_uid=None,  post_id = None,*args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        comments_id = f'{host}/author/{author_uid}/posts/{post_id}/comments'
        #author_id = f'{host}/author/{author_id}'
        post_id= f'{host}/author/{author_uid}/posts/{post_id}'
        author_id= f'{host}/author/{author_uid}'
        
        title = request.data.get('title')
        source = request.data.get('source')
        origin = request.data.get('origin')
        description = request.data.get('description')
        contentType = request.data.get('contentType')
        content = request.data.get('content')
        categories = request.data.get('categories')
        count = request.data.get('count')
        published = request.data.get('published')
        size = request.data.get('size')
        comment = comments_id
        visibility = request.data.get('visibility')
        unlisted = request.data.get('unlisted')
        # img = request.FILES.get('image')

        Post.objects.filter(pk=post_id).update(
            title = title,
            source = post_id,#fix this 
            origin = post_id,#fix this
            description = description,
            contentType = contentType,
            content = content,
            count = count,
            size = size,
            categories = categories,
            comment = comment,
            visibility = visibility,
            published = published,
            unlisted = unlisted,
            author = Author.objects.get(id=author_id),
            # image = img
        )

       #return response
        post_data = {'title': title,'source': source,
                     'origin': origin, 'description': description, 'contentType': contentType,
                     'content': content, 'author': author_id, 'categories': categories,
                     'count': count, 'size': size, 'comment': comment,
                     'visibility': visibility, 'unlisted': unlisted,'id':post_id}

        
        return Response(post_data)


# =====================================================================================================================================
# Comment
# =====================================================================================================================================
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def post_new_comment(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]   # currently the author_id is the UUID
        post_id = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        real_author_id = host + "author/" + author_id
        real_post_id = real_author_id + "/posts/" + post_id

        post_id = real_post_id
        comment_uuid = uuid.uuid4().hex
        comment_id = post_id + "/comments/" + comment_uuid
        author = request.data.get('author')
        
        comment = request.data.get('comment')
        contentType = request.data.get('contentType')

        comment_data = {'type': 'comment', 'author': author, 'post': post_id, 
                        'comment': comment, 'contentType': contentType, 'id': comment_id}

        Comment.objects.create( author= author, post= post_id, 
                        comment=comment, contentType=contentType, id=comment_id)


        # add this comment to the post's owner's inbox
        receiver_id = host + "author/" + author_id
        Inbox.objects.create(author=receiver_id, items=comment_data)

        return Response(comment_data)


    def get_comment_list(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]   # currently the author_id is the UUID
        post_id = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        real_author_id = host + "author/" + author_id
        real_post_id = real_author_id + "/posts/" + post_id
        queryset = Comment.objects.filter(post=real_post_id)
        if queryset.exists():
            return Response(list(queryset.values()))
        else:
            return Response([])


    def retrive_a_comment(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
        post_id = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        real_author_id = host + "author/" + author_id
        real_post_id = real_author_id + "/posts/" + post_id

        comment_id = request_str.split("/")[6]
        real_comment_id = real_post_id + "/comments/" + comment_id

        if Comment.objects.filter(id=real_comment_id).exists():
            return Response(Comment.objects.filter(id=real_comment_id).values())
        else:
            return Response("This comment does not exist.")


# =====================================================================================================================================
# Friend/Follower
# =====================================================================================================================================
class FriendRequestViewSet(viewsets.ModelViewSet):
    serializer_class = FriendRequestSerializer
    queryset = FriendRequest.objects.all()

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        return super(FriendRequestViewSet, self).get_permissions()

    def create(self, request, *args, **kwargs):
        # create friend request
        # from_user_id = Author.objects.get(id=request.data["actor"])
        from_user_id = request.data["actor"]
        to_user_id = request.data["object"]





        if FriendRequest.objects.filter(actor=from_user_id, object=to_user_id, status="R").exists():
            # Check if the request alreay exists and status is "requested".
            return Response("Unable to send friend request because the friend request alreay exists!")
        elif FriendRequest.objects.filter(actor=from_user_id, object=to_user_id, status="A").exists():
            # Check if the request exists and status is "A"
            return Response("Unable to send friend request because you have already become friends!")
        elif FriendRequest.objects.filter(actor=from_user_id, object=to_user_id, status="D").exists():
            # If your reuqest was declined and send again
            FriendRequest.objects.filter(actor=from_user_id, object=to_user_id, status="D").update(
                actor=from_user_id, object=to_user_id, status='R')
            return Response("Successfully create the friend request!")
        elif FriendRequest.objects.filter(actor=to_user_id, object=from_user_id, status="R").exists():
            # if he already send the request to you and status is R, then you become friend automatically
            FriendRequest.objects.filter(actor=to_user_id, object=from_user_id, status="R").update(
                actor=to_user_id, object=from_user_id, status='A')
            return Response("He/She had sent the request to you and you become friend automatically!")
        elif FriendRequest.objects.filter(actor=to_user_id, object=from_user_id, status="A").exists():
            return Response("Unable to send friend request because you have already become friends!")
        elif FriendRequest.objects.filter(actor=to_user_id, object=from_user_id, status="D").exists():
            FriendRequest.objects.filter(actor=to_user_id, object=from_user_id, status="D").update(
                actor=to_user_id, object=from_user_id, status='R')
            return Response("Successfully create the friend request!")
        else:




            friend_request = FriendRequest.objects.create(
                actor=from_user_id, object=to_user_id, status='R')
            return Response("Successfully create the friend request!")


    def accept_incoming_request(self, request, *args, **kwargs):
        # accept incoming friend request
        # request_from_user_id = Author.objects.get(id=request.data["actor"])
        request_from_user_id = request.data["actor"]
        current_user_id = request.data["object"]

        if FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='A').exists():
            # Check if the request has already been accepted
            return Response("Unable to accept, because you had already accepted it!")
        elif FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='D').exists():
            # Check if the request has already been declined
            return Response("Unable to accept, because you had already declined it!")
        elif FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='R').exists():
            # If request exists and status is Requested, then able to accept:
            FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='R').update(
                actor=request_from_user_id, object=current_user_id, status='A')
            return Response("Successfully accept the friend request!")
        else:
            return Response("Unable to accept because this request does not exist.")


    def decline_incoming_request(self, request, *args, **kwargs):
        # decline incoming friend request
        # request_from_user_id = Author.objects.get(id=request.data["actor"])
        request_from_user_id = request.data["actor"]
        current_user_id = request.data["object"]
        if FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='A').exists():
            # Check if the request has already been accepted
            return Response("Unable to decline because you had already accepted it!")
        elif FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='D').exists():
            # Check if the request has already been delined
            return Response("Unable to decline because you had already declined it!")
        elif FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='R').exists():
            # Successfully decline this friend request
            FriendRequest.objects.filter(actor=request_from_user_id, object=current_user_id, status='R').update(
                actor=request_from_user_id, object=current_user_id, status='D')
            return Response("Successfully decline this friend request!")
        else:
            # Request does not exist
            return Response("Unable to decline because this request does not exist.")


    def delete(self, request, *args, **kwargs):
        # delete friend(only available when the status of request is 'Accepted')
        # user_1 = Author.objects.get(id=request.data["actor"])
        user_1 = request.data["actor"]
        user_2 = request.data["object"]
        if FriendRequest.objects.filter(actor=user_1, object=user_2, status='A').exists():
            # user1 create the friend request and user1 delete
            FriendRequest.objects.filter(
                actor=user_1, object=user_2, status='A').delete()
            return Response("Successfully delete this friend!")
        elif FriendRequest.objects.filter(actor=user_2, object=user_1, status='A').exists():
            # user2 create the friend request and userr1 delete
            FriendRequest.objects.filter(
                actor=user_2, object=user_1, status='A').delete()
            return Response("Successfully delete this friend!")
        else:
            return Response("Unable to delete because you are not friends.")


    def get_follower_list(self, request, *args, **kwargs):
        # get list of followers and friends
        request = str(request)
        author_uuid = request.split("/")[2]
        host = "https://nofun.herokuapp.com/"
        author_id = host + "author/" + author_uuid
        #print('22222',author_id)
        #current_user = Author.objects.get(id=author_id)
        #print('1111',current_user)
        items = []
        if FriendRequest.objects.filter(object=author_id, status='R').exists():
            for item in FriendRequest.objects.filter(object=author_id, status='R').values():
            #print(item)
                items.append(item["actor"])
                #print('11111',follower_id)
                
        

        if FriendRequest.objects.filter(object=author_id, status='A').exists():
            for item in FriendRequest.objects.filter(object=author_id, status='A').values():
                items.append(item["actor"])

        if FriendRequest.objects.filter(object=author_id, status='D').exists():
            for item in FriendRequest.objects.filter(object=author_id, status='D').values():
                items.append(item["actor"])

        if FriendRequest.objects.filter(actor=author_id, status='A').exists():
            for item in FriendRequest.objects.filter(actor=author_id, status='A').values():
                items.append(item["object"])
        

        return Response({
            'type': 'followers',
            'items': items
        })


    def get_friend_list(self, request, *args, **kwargs):
        # get list of friend only
        request = str(request)
        author_uuid = request.split("/")[2]
        host = "https://nofun.herokuapp.com/"
        author_id = host + "author/" + author_uuid
        
        items = []
        # follower_list = {"type": "followers", "items": []}
        for item in FriendRequest.objects.filter(object=author_id, status='A').values():
            items.append(item["actor"])
        for item in FriendRequest.objects.filter(actor=author_id, status='A').values():
            items.append(item["object"])
        
        
        
        return Response({
            'type': 'friends',
            'items': items
        })

    
    def is_follower(self, request, *args, **kwargs):
        # check if author2 is author1's follower
        request = str(request)
        author_1_uuid = request.split("/")[2]
        author_2_uuid = request.split("/")[4]
        host = "https://nofun.herokuapp.com/"
        author_1_id = host + "author/" + author_1_uuid
        author_2_id = host + "author/" + author_2_uuid
        # current_user = Author.objects.get(id=author_1_id)
        # foreign_user = Author.objects.get(id=author_2_id)
        if FriendRequest.objects.filter(object=author_1_id, actor=author_2_id, status='R').exists():
            return Response({'is_follower': True})
        elif FriendRequest.objects.filter(object=author_1_id, actor=author_2_id, status='A').exists():
            return Response({'is_follower': True})
        elif FriendRequest.objects.filter(object=author_2_id, actor=author_1_id, status='A').exists():
            return Response({'is_follower': True})
        else:
            return Response({'is_follower': False})


    def put_follower(self, request, *args, **kwargs):
        # check if author2 is author1's follower
        request = str(request)
        author_1_uuid = request.split("/")[2]
        author_2_uuid = request.split("/")[4]
        host = "https://nofun.herokuapp.com/"
        author_1_id = host + "author/" + author_1_uuid
        author_2_id = host + "author/" + author_2_uuid
        # current_user = Author.objects.get(id=author_1_id)
        # foreign_user = Author.objects.get(id=author_2_id)
        if not FriendRequest.objects.filter(actor=author_2_id, object=author_1_id, status='R').exists():
            FriendRequest.objects.create(actor=author_2_id, object=author_1_id, status='R')
            return Response("Successfully add this follower.")
        else:
            return Response("")


    def remove_follower(self, request, *args, **kwargs):
        request = str(request)
        author_1_uuid = request.split("/")[2]
        author_2_uuid = request.split("/")[4]
        host = "https://nofun.herokuapp.com/"
        author_1_id = host + "author/" + author_1_uuid
        author_2_id = host + "author/" + author_2_uuid
        # current_user = Author.objects.get(id=author_1_id)
        # foreign_user = Author.objects.get(id=author_2_id)
        FriendRequest.objects.filter(actor=author_1_id, object=author_2_id, status='A').delete()
        FriendRequest.objects.filter(actor=author_2_id, object=author_1_id, status='A').delete()
        FriendRequest.objects.filter(actor=author_2_id, object=author_1_id, status='R').delete()
        return Response("Successfully removed this follower.")


# =====================================================================================================================================
# Like/Likes/Liked
# =====================================================================================================================================
class LikesViewSet(viewsets.ModelViewSet):
    serializer_class = LikesSerializer
    queryset = Likes.objects.all()

    # create like for the comment/post
    def create_likes(self, request, *args, **kwargs):
        request_str = str(request)
        author_uuid = request_str.split("/")[2]
        post_uuid = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"

        author_id = host + "author/" + author_uuid
        post_id = author_id + "/posts/" + post_uuid
        is_comments = False
        if '/comments/' in request_str:
            is_comments = True
            comment_uuid = request_str.split("/")[6]
            comment_id = post_id + "/comments/" + comment_uuid
            comment_author = Comment.objects.get(id = comment_id)
            comment_author_id = comment_author.author
            print(comment_author_id)

        context = ''
        actor = request.data.get('author',None)# author ID

        
        if is_comments:
            summary = str(actor) + ' liked your comment. '#actor.displayname or some name
            likes_data = {'type': 'Like', 'summary': summary, 'author': actor, 'object': comment_id, 'context': context}
            Likes.objects.create(summary=summary, author=actor, object=comment_id, context=context)#create author who is an actor
            print("111111")
            print(comment_author_id)
            # add to object author's inbox
            receiver_id = comment_author_id
            Inbox.objects.create(author=receiver_id, items=likes_data)

            return Response({
            'type': 'Like', 
            'summary': summary, 
            'author': actor, 
            'object': comment_id, 
            'context': context
            })
        else:
            summary = str(actor) + ' liked your post. ' 
            likes_data = {'type': 'Like', 'summary': summary, 'author': actor, 'object': post_id, 'context': context}
            Likes.objects.create(summary=summary, author=actor, object=post_id, context=context)

            # add to object author's inbox
            receiver_id = author_id
            Inbox.objects.create(author=receiver_id, items=likes_data)

            return Response({
                'type': 'Like', 
                'summary': summary, 
                'author': actor, 
                'object': post_id, 
                'context': context
            })
        

    # get a list of likes for this post
    def get_postLike_list(self, request, *args, **kwargs):
        request_str = str(request)
        author_uuid = request_str.split("/")[2]
        post_uuid = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"

        author_id = host + "author/" + author_uuid
        post_id = author_id + "/posts/" + post_uuid
        
        # response_body = []
        item =  Likes.objects.filter(object=post_id).values()
        # response_body.append(item)

        # return Response(response_body)
        return Response(item)


    # get a list of like for this comment
    def get_commentLike_list(self, request, *args, **kwargs):
        request_str = str(request)
        author_uuid = request_str.split("/")[2]
        post_uuid = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"

        author_id = host + "author/" + author_uuid
        post_id = author_id + "/posts/" + post_uuid
        is_comments = False
        if '/comments/' in request_str:
            is_comments = True
            comment_uuid = request_str.split("/")[6]
            comment_id = post_id + "/comments/" + comment_uuid

        # response_body = []
        item =  Likes.objects.filter(object=comment_id).values()
        # response_body.append(item)
        return Response(item)


@api_view(['GET'])
def likedList(request, *args, **kwargs):
    request_str = str(request)
    author_uuid = request_str.split("/")[2]
    host = "https://nofun.herokuapp.com/"
    author_id = host + "author/" + author_uuid

    item = Likes.objects.filter(author=author_id).values()
    return Response(item)


# =====================================================================================================================================
# Inbox
# =====================================================================================================================================
class InboxViewSet(viewsets.ModelViewSet):
    serializer_class = InboxSerializer
    def send_into_inbox(self, request, *args, **kwargs):
        request_str = str(request)
        author_uuid = request_str.split("/")[2]
        host = "https://nofun.herokuapp.com/"
        author_id = host + "author/" + author_uuid
        request_body_data = request.data
        Inbox.objects.create(author=author_id, items=request_body_data)
        return Response({
            "type": "inbox",
            "author": author_id,
            "items": request_body_data
        })


    def all_info_list(self, request, *args, **kwargs):
        request_str = str(request)
        author_uuid = request_str.split("/")[2]
        post_uuid = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        author_id = host + "author/" + author_uuid
        post_id = author_id + "/posts/" + post_uuid
        is_comments = False
        if '/comments/' in request_str:
            is_comments = True
            comment_uuid = request_str.split("/")[6]
            comment_id = post_id + "/comments/" + comment_uuid

        all_info_list = []
        # add friends requests info
        request_list = []
        if FriendRequest.objects.filter(object=author_id, status="R").exists():
            request_list = FriendRequest.objects.filter(object=author_id, status="R").values()


        #TODO get likes, comment, posts info from inbox
        item_list = Inbox.objects.filter(author=author_id).values()

        # return all info with chain(queryset1, queryset2, ...)
        return Response({
            'type': 'Inbox',
            'author': author_id,
            'items': chain(request_list, item_list)
        })

    def current_user_requests(self, request, *args, **kwargs):
    # the requests you received
        request_str = str(request)
        author_uuid = request_str.split("/")[2]
        post_uuid = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        author_id = host + "author/" + author_uuid
        post_id = author_id + "/posts/" + post_uuid
        is_comments = False
        if '/comments/' in request_str:
            is_comments = True
            comment_uuid = request_str.split("/")[6]
            comment_id = post_id + "/comments/" + comment_uuid

        # add friends requests info
        request_list = None
        if FriendRequest.objects.filter(object=author_id, status="R").exists():
            request_list = FriendRequest.objects.filter(object=author_id, status="R").values()

        # return request list
        return Response({
            'type': 'Inbox',
            'author': author_id,
            'items': request_list
        })


    def clear(self, request, *args, **kwargs):
    # clear the inbox database and decline all the requests
        pass

    

# =====================================================================================================================================
# =====================================================================================================================================