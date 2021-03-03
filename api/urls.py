from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import UserViewSet, AuthorViewSet, PostViewSet, CommentViewSet, LikeViewSet,PostDetail,UpdatePost
from . import views
router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('authors', AuthorViewSet)
router.register('posts', PostViewSet)

router.register('comments', CommentViewSet)
router.register('likes', LikeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/', PostDetail.as_view()),#router?
    path('edit/<int:pk>/', UpdatePost.as_view()),
    
]
