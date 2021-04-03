# 404-project

## Run online?
frontend: https://social-distribution-app.herokuapp.com/
backend: https://nofun.herokuapp.com/admin/


## Run locally?
git clone https://github.com/UAACC/404-project.git frontend
cd frontend
git fetch
git checkout frontend
cd client
npm install
cd ..
npm install
npm run dev

cd ..
git clone https://github.com/UAACC/404-project.git backend
cd backend
git fetch
git checkout backend
// optional: use your VM
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py migrate --run-syncdb
python3 manage.py runserver

open frontend URL http://127.0.0.1:3000/
open backend URL http:/127.0.0.1:8000/admin/

## Project1 - Tasks
Yanlin - Frontend:  Main page, Post Detail page, Comment and header components <br />
Peiran - Frontend: Signin page, Signup page, Main page, User Profile Page<br />
Xutong - Backend: Friend Request API<br />
Dongheng - Backend: Post API<br />
Qi Song - Backend: Comment and Like API <br />

## Frontend
React
library: axios, redux
structure: index.js, app.js /pages, /components, /assets


## Backend
Django
library: Django REST framework

### API:
#### Author:
<img src="https://miscellaneous-kay.s3.ca-central-1.amazonaws.com/Author.png" />

#### POST
<img src="https://miscellaneous-kay.s3.ca-central-1.amazonaws.com/Post.png" />

#### Comment & Like 
<img src="https://miscellaneous-kay.s3.ca-central-1.amazonaws.com/Comment%26Like.png" />
