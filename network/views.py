from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators import csrf
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.paginator import Paginator
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import PostSerializer
from rest_framework.decorators import api_view
import datetime
import json

from .models import User, Post, Follower


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html")
    return HttpResponseRedirect(reverse("login"))


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
            follower = Follower(user=user)
            follower.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def post_content(request):
    if request.method != "POST":
        return JsonResponse({"error": "the request must be POST"}, status=400)

    data = json.loads(request.body)
    # if the user is creating a post(tweet)
    if data["task"] == "create_post":
        post = Post(author=request.user, text=data["post_text"], date_and_time=datetime.datetime.now())
        post.save()
        return JsonResponse({"message": "post uploaded successfully"}, status=201)

    # if a post is being liked by a user
    elif data["task"] == "like_post":
        
        post = Post.objects.get(pk=data["id"])
        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        post.save()
        return JsonResponse({"message": "request successful"})

    elif data["task"] == "follow":
        profile = User.objects.get(pk=data["id"])
        followers_of_profile = Follower.objects.get(user=profile.pk).followers
        if request.user in followers_of_profile.all():
            followers_of_profile.remove(request.user)
        else:
            followers_of_profile.add(request.user)
        profile.save()
        return JsonResponse({"message": "request successful"})

@api_view(["GET"])
def load_posts(request, posts_type, page):

    if posts_type == "index":
        posts = Post.objects.all().order_by("-date_and_time")
    elif posts_type == "following":
        posts = []
        for user in request.user.following.all().values("user"):
            posts = posts + json.loads(serializers.serialize("json", User.objects.get(pk=user["user"]).post.all()))
    else:
        posts_profile = posts_type
        posts = User.objects.get(username=posts_profile).post.all()
    posts = PostSerializer(posts, many=True)
    breakpoint()
    print(posts.data)

    return Response()

    # pagination = Paginator(posts, 10)
    # # if the posts end and no more post is remaining
    # if pagination.num_pages < page:
    #     return JsonResponse({"error": "no more posts"})

    # # changing the posts in page to a format that can be sent to client
    # posts = pagination.page(page).object_list
    # if posts_type != "following":
    #     posts = json.loads(serializers.serialize("json", posts))
    # for post in posts:
    #     author = User.objects.get(pk=post["fields"]["author"])

    #     post["same_author"] = False
    #     if request.user.pk == author.pk:
    #         post["same_author"] = True

    #     if request.user.pk in post["fields"]["likes"]:
    #         post["fields"]["is_liked"] = True
    #     else:
    #         post["fields"]["is_liked"] = False
    #     post["fields"]["author"] = author.username

    # return(JsonResponse({"posts": posts}))

@csrf_exempt
def profile(request, username):
    profile = User.objects.get(username=username)
    followers = Follower.objects.get(user=profile.pk).followers.all()
    following = profile.following.all().values("user")
    if request.method == "POST":
        data = {
            "pk": profile.pk,
            "username": profile.username,
            "following": following.count(),
            "followers": followers.count(),
            "is_following": profile in followers,
            "same_user": profile == request.user
        }
        return JsonResponse(data)

    return render(request, "network/profile.html", {
        "username": profile.username
    })

@login_required
def following_view(request):

    return render(request, "network/following.html")

@csrf_exempt
def edit_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.method == "POST":
        message = "post does not belong to the user"
        if post in Post.objects.filter(author=request.user):
            try:
                post.text = json.loads(request.body)["text"]
                post.save()
                message = "success"
            except:
                message = "could not edit post"

        return JsonResponse({"message": message, "text": post.text})