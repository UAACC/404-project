from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import NodeViewSet, AuthorViewSet, CommentViewSet, PostViewSet, LikesViewSet, InboxViewSet
# from .views import PostList, PostDetail, UpdatePost, PostCreate, DeletePost
# PostSearchList
from .views import FriendRequestViewSet
from . import views

router = routers.DefaultRouter()    # Xutong
router.register('nodes', NodeViewSet)  # usful
#router.register('author', AuthorViewSet)
#router.register('posts', PostViewSet)
# router.register('comments', CommentViewSet)      # Xutong
# router.register('likes', LikeViewSet)      # Xutong
# router.register('friendrequest', FriendRequestViewSet)      # Xutong

urlpatterns = [
    path('', include(router.urls)),


    # POST/Author
    # path('posts/<int:pk>/', PostDetail.as_view()),
    # path('posts/<int:pk>/edit/', UpdatePost.as_view()),
    # path('posts/create/', PostCreate.as_view()),
    # path('posts/<int:pk>/delete/', DeletePost.as_view()),
    # path('posts/', PostList.as_view()),
    #path('posts/search', PostSearchList.as_view()),
    path('all-authors/', AuthorViewSet.as_view({'get': 'all_users'})),
    path('post-list/', PostViewSet.as_view({'get': "all_posts"})),
    path('author/login/', AuthorViewSet.as_view({'post': 'author_login'})),
    path(
        'author/', AuthorViewSet.as_view({'post': 'create_1', 'get': "all_users"})),
    path('author/<str:author_uid>/',
         AuthorViewSet.as_view({'get': 'retrive', 'post': 'update'})),
     path('author/<str:author_uid>/friendposts/', PostViewSet.as_view({'get': 'all_friends_posts'})),
     
    path('author/<str:author_uid>/posts/',
         PostViewSet.as_view({'get': 'post_list', 'post': 'create_1'})),
    path('author/<str:author_uid>/posts/<str:post_id>/',
         PostViewSet.as_view({'get': 'post_list_id', 'put': 'edit', 'delete': 'delete', 'post': 'create_2'})),


    # Comments:
    path('author/<str:author_uid>/posts/<str:post_id>/comments/',
         CommentViewSet.as_view({'get': 'get_comment_list', 'post': 'post_new_comment'})),
    path('author/<str:author_uid>/posts/<str:post_id>/comments/<str:comment_id>/',
         CommentViewSet.as_view({'get': 'retrive_a_comment'})),


    # Like/Likes/Liked
    path("author/<str:author_id>/posts/<str:post_id>/likes/",
         LikesViewSet.as_view({'post': 'create_likes', 'get': 'get_postLike_list'})),
    path("author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes/",
         LikesViewSet.as_view({'post': 'create_likes', 'get': 'get_commentLike_list'})),
    path("author/<str:author_id>/liked/", views.likedList),


    # Friend/Follower
    path("friendrequest/", FriendRequestViewSet.as_view({"post": "create"})),
    path("friendrequest/accept/",
         FriendRequestViewSet.as_view({"patch": "accept_incoming_request"})),
    path("friendrequest/decline/",
         FriendRequestViewSet.as_view({"patch": "decline_incoming_request"})),
    path("friendrequest/delete/",
         FriendRequestViewSet.as_view({"patch": "delete"})),
    path("author/<str:author_id>/followers/",
         FriendRequestViewSet.as_view({"get": "get_follower_list"})),
    path("author/<str:author_id>/followers/<str:foreign_author_id>/", FriendRequestViewSet.as_view(
         {"get": "is_follower", "put": "put_follower", "delete": "remove_follower"})),
    path("author/<str:author_id>/friends/",
         FriendRequestViewSet.as_view({"get": "get_friend_list"})),

    # Inbox URL
    path("author/<str:author_id>/inbox/", InboxViewSet.as_view(
         {"get": "all_info_list", "post": "send_into_inbox", "delete": "clear"})),
    path("author/<str:author_id>/inbox/request-list/",
         InboxViewSet.as_view({"get": "current_user_requests"})),  # for test

]
