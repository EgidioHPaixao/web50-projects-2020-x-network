from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import *

from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            Profile(user=user).save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def save_post(request):
    form = Post(content=request.POST['content'])    
    form.creator = Profile.objects.get(user=request.user)
    form.save()
    return index(request)

@login_required
def load_followed_posts(request):
    followed_profiles = request.user.get_followed_profiles.all()
    print(followed_profiles)
    posts = Post.objects.filter(creator__in=followed_profiles).all()
    posts = posts.order_by("-created_date").all()   
    return JsonResponse([post.serialize(request.user) for post in posts], safe=False)


def load_posts(request): 
    posts = Post.objects.all()
    posts = posts.order_by("-created_date").all()   
    return JsonResponse([post.serialize(request.user) for post in posts], safe=False)

def profile(request,user_id):
    profile = Profile.objects.filter(user=user_id).first()
    return JsonResponse(profile.serialize(request.user),safe=False)    

@login_required 
def update_like(request,post_id):
    profile = Profile.objects.filter(user=request.user).first()
    post = Post.objects.get(id=post_id)
    if post in profile.get_all_liked_posts.all():
        newStatus = False
        post.likes.remove(profile)
    else:
        newStatus = True
        post.likes.add(profile)
    post.save()
    return JsonResponse({"liked": newStatus, "newAmount": post.likes.count()},status=200)