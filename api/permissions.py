from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    messages = 'You are not the owner of this object'
    def has_object_permission(self,request, view, obj):
        return obj.author == request.user
