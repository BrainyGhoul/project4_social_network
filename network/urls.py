
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r"posts", views.load_posts, basename="posts")

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following", views.following_view, name="following"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit_post"),

    # APIs
    path("post", views.post_content, name="post"),
    path("posts/<str:posts_type>/<int:page>", views.load_posts, name="posts"),
    # path("posts/<str:posts_type>/<int:page>", views.load_posts, name="posts"),
    # path("posts/{posts_type}/{int:page}", include("rest_framework.urls", namespace="rest_framework"))
]
