from rest_framework import viewsets, permissions
from .models import TodoItem
from .serializers import TodoItemSerializer
from rest_framework import viewsets, filters
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')
  
class TodoItemViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer
    queryset = TodoItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['completed', 'title']
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
