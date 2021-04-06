from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from .serializers import NodeSerializer, AuthorSerializer, PostSerializer, CommentSerializer, LikeSerializer
from .models import Node, Author, Post, Like, Comment, FriendRequest
from .serializers import FriendRequestSerializer
from django.http import JsonResponse, HttpResponse
from .permissions import IsOwnerOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import get_list_or_404, get_object_or_404
import uuid

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    # permission_classes = (AllowAny, )

    


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
        #self.static_author_id = author_id#give global to use
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        queryset = Author.objects.get(id=author_id)
        
        serializer = AuthorSerializer(queryset)
        return Response(serializer.data)

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
            author_id = author.id
            host = author.host
            url = author.url
            display_name = author.displayName
            github = author.github
            email =author.email
            username = author.username
            password = author.password
            is_approved = author.is_approved
            author_data = {'id': author_id, 'host': host, 'url': url,
                       'displayName': display_name, 'github': github,'email':email,'username':username,'password':password,'is_approved':is_approved}

            
            if password == author.password:
                return Response(author_data)


        except:
            return Response(None)






    def update(self, request, author_uid=None, *args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        author_id= f'{host}/author/{author_uid}'
        author = Author.objects.get(id=author_id)
        #print(author.id)
        name = request.data.get('displayName', None)
        github = request.data.get('github', None)
        author.displayName = name   
        author.github = github
        author.save()

        return Response('Author updated successfully', 204)



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


# Like & Comment
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    #authentication_classes = (TokenAuthentication, )
    # permission_classes = (AllowAny, )

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
        
        
        return Response(Post.objects.filter(author=author_id).values())
        

        
    
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
        comments_id = f'{host}/author/{author_uid}/posts/{post_uid}/comments'

        title = request.data.get('title')
        source = request.data.get('source')
        origin = request.data.get('origin')
        description = request.data.get('description')
        contentType = request.data.get('contentType')
        content = request.data.get('content')
        categories = request.data.get('categorie')
        count = request.data.get('count')
        published = request.data.get('published')
        size = request.data.get('size')
        comments = comments_id
        visibility = request.data.get('visibility')
        unlisted = request.data.get('unlisted',False)

        Post.objects.create(
            id= post_id,
            title = title,
            source = post_id,#fix this 
            origin = post_id,#fix this
            description = description,
            contentType = contentType,
            content = content,
            count = count,
            size = size,
            categorie = categories,
            comment = comments,
            visibility = visibility,
            published = published,
            unlisted = unlisted,
            author = Author.objects.get(id=author_id)
        )
        

       #return response
        post_data = {'title': title,'source': source,
                     'origin': origin, 'description': description, 'contentType': contentType,
                     'content': content, 'author': author_id, 'categories': categories,
                     'count': count, 'size': size, 'comments': comments,
                     'visibility': visibility, 'unlisted': unlisted, 'id':post_id}

        
        return Response(post_data)
        
    def edit(self, request, author_uid=None,  post_id = None,*args, **kwargs):
        host = 'https://nofun.herokuapp.com'
        comments_id = f'{host}/author/{author_uid}/posts/{post_id}/comments'
        post_id = f'{host}/author/{author_uid}/posts/{post_id}'
        author_id= f'{host}/author/{author_uid}'
        #post = Post.objects.get(id=post_id,author = author_id)
        post = get_object_or_404(Post, id=post_id)
        
        print('correct',post.title)

        title = request.data.get('title'),
        source = request.data.get('source',None)
        origin = request.data.get('origin')
        description = request.data.get('description')
        contentType = request.data.get('contentType')
        content = request.data.get('content')
        categories = request.data.get('categorie')
        count = request.data.get('count')
        size = request.data.get('size')
        comments = comments_id
        visibility = request.data.get('visibility')
        unlisted = post.unlisted
        

        post_data = {'title': title,'source': source,
                    'origin': origin, 'description': description, 'contentType': contentType,
                    'content': content, 'author': author_id, 'categories': categories,
                    'count': count, 'size': size, 'comments': comments,
                    'visibility': visibility, 'unlisted': unlisted,'id':post_id}

        
        
        

        if title:
            post.title = title
        
        post.source = post_id,#fix this 
        post.origin = post_id,#fix this
        post.description = description,
        post.contentType = contentType,
        post.content = content,
        if count:
            post.count = count
        if size:
            post.size = size
        post.categorie = categories,
        post.comment = comments,
        post.visibility = visibility,
        post.author = Author.objects.get(id=author_id)
        post.save()
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
        categories = request.data.get('categorie')
        count = request.data.get('count')
        published = request.data.get('published')
        size = request.data.get('size')
        comments = comments_id
        visibility = request.data.get('visibility')
        unlisted = request.data.get('unlisted',False)

        Post.objects.update(
            title = title,
            source = post_id,#fix this 
            origin = post_id,#fix this
            description = description,
            contentType = contentType,
            content = content,
            count = count,
            size = size,
            categorie = categories,
            comment = comments,
            visibility = visibility,
            published = published,
            unlisted = unlisted,
            author = Author.objects.get(id=author_id)
        )

       #return response
        post_data = {'title': title,'source': source,
                     'origin': origin, 'description': description, 'contentType': contentType,
                     'content': content, 'author': author_id, 'categories': categories,
                     'count': count, 'size': size, 'comments': comments,
                     'visibility': visibility, 'unlisted': unlisted,'id':post_id}

        
        return Response(post_data)




# April 6 rewrite comment ViewSet:
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def post_new_comment(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
        post_id = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        real_author_id = host + "author/" + author_id
        real_post_id = real_author_id + "/posts/" + post_id

        #---
        post_id = real_post_id
        comment_uuid = uuid.uuid4().hex
        comment_id = post_id + "/comments/" + comment_uuid
        # current_user_id = request.user.id
        
        #---
        comment = request.data.get('comment')
        contentType = request.data.get('contentType')

        comment_data = {'type': 'comment', 'author': real_author_id, 'post': post_id, 
                        'comment': comment, 'contentType': contentType, 'id': comment_id}

        Comment.objects.create( author= real_author_id, post= post_id, 
                        comment=comment, contentType=contentType, id=comment_id)
        
        # serializer = self.serializer_class(data=comment_data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data)
        # else:
        return Response(comment_data)

    
    def get_comment_list(self, request, *args, **kwargs):
        request_str = str(request)
        author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
        post_id = request_str.split("/")[4]     
        host = "https://nofun.herokuapp.com/"
        real_author_id = host + "author/" + author_id
        real_post_id = real_author_id + "/posts/" + post_id
        queryset = Comment.objects.filter(post=real_post_id)
        if queryset.exists():
            return Response(list(queryset.values()))
        else:
            return Response("No comments. ")
            # return Response(str(real_post_id) + "    " + str(real_author_id))

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



# @api_view(['GET', 'POST'])
# def commentList(request, *args, **kwargs):
#     request_str = str(request)
#     author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
#     post_id = request_str.split("/")[4]     # post_id: 1, 2, 3, ...

#     host = "https://nofun.herokuapp.com/"
#     real_author_id = host + "author/" + author_id
#     real_post_id = real_author_id + "/comments/" + post_id

#     if request.method == 'GET':
#         if Post.objects.filter(author=real_author_id).exists():
#             return Response(Comment.objects.filter(post=real_post_id).values())
#             # return Response(str(post_id))
#         else:
#             return Response("This post does not exist.")
#             # return Response(str(post_id + author_id))
#     if request.method == 'POST':
#         content = request.data.get('')
#         author = Author.objects.get(id=author_id)
#         post = Post.objects.get(id=post_id)
#         Comment.objects.create(author=author, post=post, content=content)
#         return Response('Comment created!')


# @api_view(['GET'])
# def comment(request, *args, **kwargs):
#     request_str = str(request)
#     author_id = request_str.split("/")[2]   # currently the author_id is the pure UUID
#     post_id = request_str.split("/")[4]     # post_id: 1, 2, 3, ...
#     comment_id = request_str.split("/")[6]

#     if Post.objects.filter(author=author_id).exists() and Comment.objects.filter(post=post_id).exists():
#         return Response(Comment.objects.filter(post=post_id, id=comment_id).values())
#     else:
#         return Response("This post/comment does not exist.")


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

    