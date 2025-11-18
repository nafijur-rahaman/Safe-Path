from django.urls import path
from .views import ReportView, AdminAcceptReportView,AdminSolveReportView,AdminRejectReportView,GetAllAcceptedReportsView,ReportStatisticsView

urlpatterns = [
    
    #report crud 
    path('report/create/', ReportView.as_view(), name='create-report'),
    path('report/get-all-reports/', ReportView.as_view(), name='get-all-reports'),
    path('report/<int:pk>/update/', ReportView.as_view(), name='update-report'),
    path('report/<int:pk>/delete/', ReportView.as_view(), name='delete-report'),
    
    #get only accepted reports
    path('report/get-all-accepted-reports/', GetAllAcceptedReportsView.as_view(), name='get-all-accepted-reports'),
    
    #get report statistics
    path('report/get-report-statistics/', ReportStatisticsView.as_view(), name='get-report-statistics'),
    
    #admin report actions
    path('admin/report/<int:pk>/accept/', AdminAcceptReportView.as_view(), name='admin-accept-report'),
    path('admin/report/<int:pk>/solve/', AdminSolveReportView.as_view(), name='admin-solve-report'),
    path('admin/report/<int:pk>/reject/', AdminRejectReportView.as_view(), name='admin-reject-report'),
    
    
    
    
]