from django.urls import path

from customers.views import CustomerView

urlpatterns = [
    path('', CustomerView.as_view()),
]