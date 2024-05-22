from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoItemViewSet
from . import views

router = DefaultRouter()
router.register(r'todos', TodoItemViewSet, basename='todo')

urlpatterns = [
    path('', include(router.urls)),
    # path('one', views.index, name='index'),
]
