import json

from django.conf import settings
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views import View

from customers.forms import CustomerForm
from customers.models import Customer


class CustomerView(View):
    model = Customer
    paginate_list = True
    page_size = 10

    def get_queryset(self):
        return self.model.objects.all().order_by('id')

    def get_page_number(self, request):
        return request.GET.get('page', 1)

    def get_page(self, request, queryset):
        page_size = getattr(self, 'page_size', settings.DEFAULT_PAGE_SIZE)
        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(self.get_page_number(request))
        return page

    def get_serialized_data(self, request, queryset):
        if getattr(self, 'paginate_list', False):
            page = self.get_page(request, queryset)
            return {
                "count": page.paginator.count,
                "page_size": page.paginator.per_page,
                "page_count": page.paginator.num_pages,
                "page_number": page.number,
                "results": [instance.to_dict() for instance in page.object_list],
            }

        return {'results': [instance.to_dict() for instance in queryset]}

    def get(self, request, *args, **kwargs):
        data = self.get_serialized_data(request, self.get_queryset())
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        form = CustomerForm(json.loads(request.body))
        if form.is_valid():
            form.save()
            return JsonResponse(form.instance.to_dict(), status=201)
        return JsonResponse(form.errors, status=400)