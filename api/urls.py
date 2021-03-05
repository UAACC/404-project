from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import AuthorViewSet, CommentViewSet, LikeViewSet
from .views import PostList, PostDetail, UpdatePost, PostCreate, DeletePost
from .views import CategoryDetail, CategoryList # PostSearchList
from .views import FriendRequestViewSet
from . import views

router = routers.DefaultRouter()
router.register('authors', AuthorViewSet)
router.register('comments', CommentViewSet)
router.register('likes', LikeViewSet)
router.register('friendrequest', FriendRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # POST
    path('posts/<int:pk>/', PostDetail.as_view()),
    path('posts/<int:pk>/edit/', UpdatePost.as_view()),
    path('posts/create/', PostCreate.as_view()),
    path('posts/<int:pk>/delete/', DeletePost.as_view()),
    path('posts/', PostList.as_view()),
    #path('posts/search', PostSearchList.as_view()),
    path('categories/<int:pk>/', CategoryDetail.as_view()),
    path('categories/', CategoryList.as_view()),


    # Friend
    # 1. Create Friend Request(from_user --> to_user)
    # Example: Request: localhost:8000/api/friendrequest/  Method: POST  
    #          Body: Key1: from_user, Value1: <user_id>, key2: to_user, Value2: <user_id>
    path("friendrequest", FriendRequestViewSet.as_view({"post": "create"})),
    # 2. Accept incoming friend request
    # Example: Request: localhost:8000/api/friendrequest/accept  Method: PATCH 
    #          Body: Key1: from_user, Value1: <user_id>, key2: to_user, Value2: <user_id>
    #          from_user is the user send request, to_user is the current login user
    path("friendrequest/accept", FriendRequestViewSet.as_view({"patch": "accept_incoming_request"})),
    # 3. Decline incoming friend request
    # Example: Request: localhost:8000/api/friendrequest/decline  Method: PATCH 
    #          Body: Key1: from_user, Value1: <user_id>, key2: to_user, Value2: <user_id>
    #          from_user is the user send request, to_user is the current login user
    path("friendrequest/decline", FriendRequestViewSet.as_view({"patch": "decline_incoming_request"})),
    # 4. Delete friend
    # Example: Request: localhost:8000/api/friendrequest/delete  Method: PATCH 
    #          Body: Key1: from_user or to_user, Value1: <user_id>, key2: to_user or from_user, Value2: <user_id>
    path("friendrequest/delete", FriendRequestViewSet.as_view({"patch": "delete"}))
]
