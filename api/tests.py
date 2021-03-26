from django.test import TestCase, override_settings
from rest_framework.authtoken.models import Token, TokenProxy
from rest_framework.test import APIClient, APITestCase 
from .models import Author
from rest_framework import status


# CreateAuthor Testcase here
class AuthorAndAuthenticationTestCase(APITestCase):
    def setUp(self):
        # create several users:
        self.author1 = Author.objects.create(username="user1", email="user1@gmail.com", password="user1")
        self.author2 = Author.objects.create(username="user2", email="user2@gmail.com", password="user2")
        self.author3 = Author.objects.create(username="user3", email="user3@gmail.com", password="user3")
        self.response_code = 200
    
    def test_create_author(self):
        self.assertTrue(self.author1.id)
        self.assertTrue(self.author2.id)
        self.assertTrue(self.author3.id)

    def test_register(self):
        request_body  ={
            "Username": [str(self.author1.username)],
            "Password": [str(self.author1.password)]
        }
        response = self.client.post("/api/authors", request_body)
        self.assertEqual(self.response_code, status.HTTP_200_OK)

    def test_login(self):
        request_body  ={
            "Username": [str(self.author1.username)],
            "Password": [str(self.author1.password)]
        }
        response = self.client.post("/api/authors", request_body)
        self.assertEqual(self.response_code, status.HTTP_200_OK)

    def test_get_profile(self):
        response = self.client.get("/api/authors/" + str(self.author1.id))
        self.assertEqual(self.response_code, status.HTTP_200_OK)

    def test_update_profile(self):
        request_body  ={
            "Username": [str(self.author1.username)],
            "Password": [str(self.author1.password)]
        }
        response = self.client.get("/api/authors/" + str(self.author1.id), request_body)
        self.assertEqual(self.response_code, status.HTTP_200_OK)


# Posts Testcase here
class PostsTestCase(APITestCase):
    def setUp(self):  
        # create several users:
        self.post_tes_author1 = Author.objects.create(username="post_tes_user1", email="post_tes_user1@gmail.com", password="post_tes_user1")
        self.post_tes_author2 = Author.objects.create(username="post_tes_user2", email="post_tes_user2@gmail.com", password="post_tes_user2")
        self.post_tes_author3 = Author.objects.create(username="post_tes_user3", email="post_tes_user3@gmail.com", password="post_tes_user3")
    
    def test_create_post(self):
        # test create post API:
        response_code = 201
        request_body = {
            "title": "test_title1",
            "description": "test_description1"
        }
        response = self.client.post("/api/posts/create", request_body)
        self.assertEqual(response_code, status.HTTP_201_CREATED)

    def test_delete_post(self):
        # test delete post:
        # create a new post and then test delete
        response_code = 202
        request_body = {
            "title": "test_title1",
            "description": "test_description1"
        }
        postid = '1'
        self.client.post("/api/posts/create", request_body)
        response = self.client.delete("api/posts/delete/" + str(postid))
        self.assertEqual(response_code, status.HTTP_202_ACCEPTED)

    def test_update_update_post(self):
        # test update post
        response_code = 200
        request_body = {
            "id" : "1",
            "title": "test_title1",
            "description": "test_description1"
        }
        self.client.post("/api/posts/create", request_body)
        request_body2 = {
            "id" : "1",
            "title": "update_title",
            "description": "update_description"
        }
        postid = 1
        response = self.client.post("api/posts/" + str(postid) + "/edit", request_body2)
        self.assertEqual(response_code, status.HTTP_200_OK)

    def test_get_all_posts(self):
        # test get all posts
        response_code = 200
        request_body = {
            "id" : "1",
            "title": "test_title1",
            "description": "test_description1"
        }
        self.client.post("/api/posts/create", request_body)
        request_body = {
            "id" : "2",
            "title": "test_title2",
            "description": "test_description2"
        }
        self.client.post("/api/posts/create", request_body)
        request_body = {
            "id" : "3",
            "title": "test_title3",
            "description": "test_description3"
        }
        self.client.post("/api/posts/create", request_body)
        response = self.client.post("/api/posts")
        self.assertEqual(response_code, status.HTTP_200_OK)


# Comments & Like Testcase here
class CommentsAndLikeTestCase(APITestCase):
    def setUp(self):
        # create several users:
        self.response_code = 200
        self.author1 = Author.objects.create(username="user1", email="user1@gmail.com", password="user1")
        self.author2 = Author.objects.create(username="user2", email="user2@gmail.com", password="user2")
        self.author3 = Author.objects.create(username="user3", email="user3@gmail.com", password="user3")

    def test_create_comment(self):
        # create a post and then test to create a comment
        request_body = {
            "id" : "1",
            "title": "test_title1",
            "description": "test_description1"
        }
        self.client.post("/api/posts/create", request_body)
        request_body2 = {
            "content": "this is the comment of post id = 1",
            "post": "1",
            "comment_id": "1"
        }
        response = self.client.post("/api/comment/", request_body2)
        self.assertEqual(self.response_code, status.HTTP_200_OK)

    def test_delete_comment(self):
        request_body = {
            "content": "this is the comment of post id = 1",
            "post": "1",
            "comment_id": "1"
        }
        self.client.post("/api/comment/", request_body)
        response = self.client.delete("/api/comment/" + "1", request_body)
        self.assertEqual(self.response_code, status.HTTP_200_OK)

    def test_update_comment(self):
        request_body = {
            "id" : "1",
            "title": "test_title1",
            "description": "test_description1"
        }
        self.client.post("/api/posts/create", request_body)
        request_body = {
            "id" : "1",
            "title": "update_1",
            "description": "update_1"
        }
        response = self.client.patch("/api/comment/" + "1", request_body)
        self.assertEqual(self.response_code, status.HTTP_200_OK)

    def test_create_like(self):
        request_body = {
            "id" : "1"
        }
        response = self.client.post("/api/likes", request_body)
        self.assertEqual(self.response_code, status.HTTP_200_OK)
    def test_delete_like(self):
        request_body = {
            "id" : "1"
        }
        self.client.post("/api/likes", request_body)
        request_body2 = {
            "id" : "1"
        }
        response = self.client.delete("/api/likes", request_body2)
        self.assertEqual(self.response_code, status.HTTP_200_OK)


# FriendRequest Testcase here
class FriendRequestTestCase(APITestCase):
    def setUp(self):
        # create several users:
        self.friend_test_user1 = Author.objects.create(username="friend_test_user1", email="friend_test_user1@gmail.com", password="friend_test_user1")
        self.friend_test_user2 = Author.objects.create(username="friend_test_user2", email="friend_test_user2@gmail.com", password="friend_test_user2")
        self.friend_test_user3 = Author.objects.create(username="friend_test_user3", email="friend_test_user3@gmail.com", password="friend_test_user3")
    
    def test_create_friend_request(self):
        # test creating a new friend request
        request_body = {
            "from_user": [str(self.friend_test_user1.id)], 
            "to_user": [str(self.friend_test_user2.id)]
            }
        response = self.client.post("/api/friendrequest", request_body)
        self.assertEqual(response.status_code, 200)

    def test_accept_incoming_request(self):
        # test to accept a new friend request from others
        request_body = {
            "from_user": [str(self.friend_test_user1.id)], 
            "to_user": [str(self.friend_test_user2.id)]
            }
        response = self.client.post("/api/friendrequest", request_body)

        request_body2 = {
            "from_user": [str(self.friend_test_user1.id)], 
            "to_user": [str(self.friend_test_user2.id)]
            }
        response2 = self.client.patch("/api/friendrequest/accept", request_body2)
        self.assertEqual(response2.status_code, 200)

    def test_decline_incoming_request(self):
        # test to decline a new friend request from others
        request_body = {
            "from_user": [str(self.friend_test_user1.id)], 
            "to_user": [str(self.friend_test_user2.id)]
            }
        response = self.client.post("/api/friendrequest", request_body)

        request_body2 = {
            "from_user": [str(self.friend_test_user2.id)], 
            "to_user": [str(self.friend_test_user1.id)]
            }
        response2 = self.client.post("/api/friendrequest/decline", request_body2)
        self.assertEqual(response.status_code, 200)


    def test_delete(self):
        # test to delete friendship
        request_body = {
            "from_user": [str(self.friend_test_user1.id)], 
            "to_user": [str(self.friend_test_user2.id)]
            }
        response = self.client.post("/api/friendrequest", request_body)

        request_body2 = {
            "from_user": [str(self.friend_test_user1.id)], 
            "to_user": [str(self.friend_test_user2.id)]
            }
        response2 = self.client.post("/api/friendrequest/delete", request_body2)
        self.assertEqual(response.status_code, 200)




