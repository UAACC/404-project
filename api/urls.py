from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import NodeViewSet, AuthorViewSet, CommentViewSet, LikeViewSet, PostViewSet
# from .views import PostList, PostDetail, UpdatePost, PostCreate, DeletePost
from .views import CategoryDetail, CategoryList  # PostSearchList
from .views import FriendRequestViewSet
from . import views

router = routers.DefaultRouter()
router.register('nodes', NodeViewSet)
router.register('author', AuthorViewSet)
router.register('posts', PostViewSet)
router.register('comments', CommentViewSet)
router.register('likes', LikeViewSet)
router.register('friendrequest', FriendRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # POST
    # path('posts/<int:pk>/', PostDetail.as_view()),
    # path('posts/<int:pk>/edit/', UpdatePost.as_view()),
    # path('posts/create/', PostCreate.as_view()),
    # path('posts/<int:pk>/delete/', DeletePost.as_view()),
    # path('posts/', PostList.as_view()),
    #path('posts/search', PostSearchList.as_view()),
    path('author/', AuthorViewSet.as_view({'post':'create_1'})),
    path('author/<str:author_id>/posts/',
         PostViewSet.as_view({'get': 'post_list','post':'create_1'})),
    path('author/<str:author_id>/posts/<str:post_id>/',
         PostViewSet.as_view({'get': 'retrieve', 'put': 'edit', 'post': 'create'})),
    path('categories/<int:pk>/', CategoryDetail.as_view()),
    path('categories/', CategoryList.as_view()),


     # Comments URL
     path("author/<str:author_id>/post/<str:post_id>/comments/", views.commentList),
     path("author/<str:author_id>/post/<str:post_id>/comments/<str:comment_id>/", views.comment),
     
     # Likes URL
     path("author/<str:author_id>/post/<str:post_id>/comments/<str:comment_id>/likes/", views.commentLike),
     path("author/<str:author_id>/post/<str:post_id>/likes", views.postLike),

     # Liked URL
     path("author/<str:author_id>/liked/", views.likedList),

     # Friend Request
     path("friendrequest", FriendRequestViewSet.as_view({"post": "create"})),
     path("friendrequest/accept", FriendRequestViewSet.as_view({"patch": "accept_incoming_request"})),
     path("friendrequest/decline", FriendRequestViewSet.as_view({"patch": "decline_incoming_request"})),
     path("friendrequest/delete", FriendRequestViewSet.as_view({"patch": "delete"})),
     path("author/<str:author_id>/followers/", views.getFollowers),

     # Follow URL
     path("author/<str:author_id>/followers/<str:foreign_author_id>/", views.operateFollowers),
     path("author/<str:author_id>/friend-list/", views.friendList)

     # Inbox URL


]
