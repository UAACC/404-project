from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import NodeViewSet, AuthorViewSet, CommentViewSet, LikeViewSet, PostViewSet, LikesViewSet, InboxViewSet
# from .views import PostList, PostDetail, UpdatePost, PostCreate, DeletePost
# PostSearchList
from .views import FriendRequestViewSet
from . import views

router = routers.DefaultRouter()    # Xutong
router.register('nodes', NodeViewSet)      #usful
#router.register('author', AuthorViewSet)
#router.register('posts', PostViewSet)
# router.register('comments', CommentViewSet)      # Xutong
# router.register('likes', LikeViewSet)      # Xutong
# router.register('friendrequest', FriendRequestViewSet)      # Xutong

urlpatterns = [
    path('', include(router.urls)),

    

    # POST
    # path('posts/<int:pk>/', PostDetail.as_view()),
    # path('posts/<int:pk>/edit/', UpdatePost.as_view()),
    # path('posts/create/', PostCreate.as_view()),
    # path('posts/<int:pk>/delete/', DeletePost.as_view()),
    # path('posts/', PostList.as_view()),
    #path('posts/search', PostSearchList.as_view()),
    path('all-authors/',AuthorViewSet.as_view({'get':'all_users'})),
    path('post-list/',PostViewSet.as_view({'get':"all_posts"})),
    path('author/login/', AuthorViewSet.as_view({'post':'author_login'})),
    path('author/', AuthorViewSet.as_view({'post':'create_1', 'get':"all_users"})),
    path('author/<str:author_uid>/', AuthorViewSet.as_view({'get':'retrive', 'put':'update'})),
    path('author/<str:author_uid>/posts/',
         PostViewSet.as_view({'get': 'post_list','post':'create_1'})),
    path('author/<str:author_uid>/posts/<str:post_id>/',
         PostViewSet.as_view({'get': 'post_list_id','put':'edit','delete':'delete','post':'create_2'})),



     # # Comments URL
     # path("author/<str:author_id>/posts/<str:post_id>/comments/", views.commentList),
     # path("author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/", views.comment),

     # new Comments URL:
     path('author/<str:author_uid>/posts/<str:post_id>/comments/',
         CommentViewSet.as_view({'get': 'get_comment_list', 'post': 'post_new_comment'})),
     path('author/<str:author_uid>/posts/<str:post_id>/comments/<str:comment_id>/',
         CommentViewSet.as_view({'get': 'retrive_a_comment'})),
     
     # Likes URL
     path("author/<str:author_id>/posts/<str:post_id>/likes/", LikesViewSet.as_view({'post': 'create_likes'})),
     path("author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes/", LikesViewSet.as_view({'post': 'create_likes'})),

     # Liked URL
     path("author/<str:author_id>/liked/", views.likedList),

     # Friend Request
     path("friendrequest/", FriendRequestViewSet.as_view({"post": "create"})),
     path("friendrequest/accept/", FriendRequestViewSet.as_view({"patch": "accept_incoming_request"})),
     path("friendrequest/decline/", FriendRequestViewSet.as_view({"patch": "decline_incoming_request"})),
     path("friendrequest/delete/", FriendRequestViewSet.as_view({"patch": "delete"})),
     path("author/<str:author_id>/followers/", views.getFollowers),

     # Follow URL
     path("author/<str:author_id>/followers/<str:foreign_author_id>/", views.operateFollowers),
     path("author/<str:author_id>/friend-list/", views.friendList),

     # Inbox URL
     path("author/<str:author_id>/inbox/request-list", InboxViewSet.as_view({"get": "current_user_requests"}))


]
