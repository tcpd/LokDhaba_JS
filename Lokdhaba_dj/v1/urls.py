from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('tasks/', views.tasks),
    path('getDerivedData/',views.get_derived_data),
    path('getVizLegend/',views.get_viz_legend),
    path('getMapYear/',views.get_map_year),
    path('getMapYearParty/',views.get_year_party),
    path('getVizData/',views.get_viz_data),
    path('DataDownload/',views.get_download_data),
    path('DirectDownload/',views.get_direct_download_data),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)