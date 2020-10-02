
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new",views.save_post, name="save_post"),
    path("load",views.load_posts,name="load_posts"),
    path("profile/<int:user_id>",views.profile,name="profile")
]
