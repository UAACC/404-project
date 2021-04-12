# 404-project
## Run online?
frontend: https://social-distribution-app.herokuapp.com/<br/>
backend: https://nofun.herokuapp.com/admin/<br/>


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
python3 manage.py makemigrations<br/>
python3 manage.py migrate<br/>
python3 manage.py migrate --run-syncdb<br/>
python3 manage.py runserver<br/>

open frontend URL http://127.0.0.1:3000/<br/>
open backend URL http:/127.0.0.1:8000/admin/<br/>

## Project1 - Tasks
Yanlin - Frontend:  Main page, Post Detail page, Comment and header components <br />
Peiran - Frontend: Signin page, Signup page, Main page, User Profile Page<br />
Xutong - Backend: Friend Request, Comment and Like  API<br />
Dongheng - Backend: Post Author API and backend deploy<br />
Qi Song - Backend: All FRONT END  detail functions applications and connections to other group(main contributor)API <br />

## Frontend
React
library: axios, redux
structure: index.js, app.js /pages, /components, /assets


## Backend
Django
library: Django REST framework

