# CMPUT404 Win21 Project (Team 20)

## Description
CMPUT404-project-socialdistribution, a distributed social network.<br/>
Professor's project repository: https://github.com/abramhindle/CMPUT404-project-socialdistribution<br/>
See project.org (plain-text/org-mode) for a description of the project.<br/>

## Deployment
* Frontend: https://social-distribution-app.herokuapp.com/signin <br/>
* Backend: https://nofun.herokuapp.com/admin/ <br/>

## Application Credentials 
* Application Credentials: https://github.com/UAACC/404-project/wiki/Application-Credentials <br/>

## Installation

### Run Frontend Locally:
* $ git clone https://github.com/UAACC/404-project.git frontend<br/>
* $ cd frontend<br/>
* $ git fetch origin<br/>
* $ git checkout frontend<br/>
* $ cd client<br/>
* $ npm install<br/>
* $ npm run start<br/>
* $ Open frontend URL: http://127.0.0.1:3000/ <br/>

### Run Backend Locally:
* $ git clone https://github.com/UAACC/404-project.git backend<br/>
* $ cd backend<br/>
* $ git fetch<br/>
* $ git checkout backend<br/>
// optional: use your VM<br/>
* $ pip install -r requirements.txt
* $ python manage.py makemigrations<br/>
* $ python manage.py migrate<br/>
* $ python manage.py migrate --run-syncdb<br/>
* $ python manage.py runserver<br/>
* $ Open backend URL: http:/127.0.0.1:8000/admin/ <br/>
// We use local database when you run backend locally, it's different with our deployed backend, so create superuser by: python manage.py createsuperuser

## API documentation
* API Documentation: https://github.com/UAACC/404-project/wiki/API-Documentation <br/>

## Run Test
* $ python manage.py test

## Demo Video
* Demo Video Link: https://www.youtube.com/watch?v=jYmuWyZ6V6I <br/>

## About AJAX
* Our AJAX Wiki Link: https://github.com/UAACC/404-project/wiki/About-AJAX <br/>

## Contributors
* Yanlin Chen - Frontend Main page, Post Detail page, Comment and header components, Video Demo <br/>
* Peiran Yu- Signin page, Signup page, Main page, User Profile Page <br/>
* Xutong Li- Friend Request/Follower, Comment and Likes/Liked, API documentations, Test <br/>
* Dongheng Li- Post, Author API ,and backend deploy,admin page, authentications, API documentations <br/>
* Qi Song - FRONT END detail functions applications and connections to other group API and forntend deploy <br/>



