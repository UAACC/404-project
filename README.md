# 404-project



## Run online?
frontend: https://social-distribution-app.herokuapp.com/<br/>
backend: https://nofun.herokuapp.com/admin/<br/>
username:auth
password:123


## Run locally?
git clone https://github.com/UAACC/404-project.git frontend <br/>
cd frontend<br/>
git fetch<br/>
git checkout frontend<br/>
cd client<br/>
npm install<br/>
cd ..<br/>
npm install<br/>
npm run dev<br/>

cd ..<br/>
git clone https://github.com/UAACC/404-project.git backend<br/>
cd backend<br/>
git fetch<br/>
git checkout backend<br/>
// optional: use your VM<br/>
pip install -r requirements_backend.txt( only if you start with an empty virtual environments, for any environments requirements issue you can also chekc with environment.yml which i use for my conda environment)
python manage.py makemigrations<br/>
python manage.py migrate<br/>
python manage.py migrate --run-syncdb<br/>
python manage.py runserver<br/>



## Project1 Contributors- Tasks
Yanlin - Frontend:  Main page, Post Detail page, Comment and header components <br />
Peiran - Frontend: Signin page, Signup page, Main page, User Profile Page<br />
Xutong - Backend: Friend Request, Comment and Like,API documentations <br />
Dongheng - Backend: Post, Author API ,viedo demo and backend deploy<br />
Qi Song - Frontend: All FRONT END  detail functions applications and connections to other group API and forntend deploy. <br />


SPECIAL THANKS TO :
TEAM 1
Bowei Li	Weida Wang	Xuechun Qiu	Zihao Huang	Zijian Xi

## Frontend
React
library: axios, redux
structure: index.js, app.js /pages, /components, /assets


## Backend
Django
library: Django REST framework

## API documentations
https://docs.google.com/document/d/1-ALGeKC2WyRux0hKx5JKX2xbHC6qUVyiySFOQevU79w/edit#

## Vieo demo url:



