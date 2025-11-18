from django.shortcuts import render


#django imports 

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

#local imports
from .serializers import LocationSerializer, ReportSerializer
from .models import Report, Location



#-----------------Report view-----------------#


class ReportView(APIView):
    def post(self, request):
        serializer = ReportSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Report created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "Report creation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        serializer = ReportSerializer(report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Report updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Report update failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def delete(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        report.delete()
        return Response({
            "success": True,
            "message": "Report deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)



#----------Get Only Accepted Reports------------#

class GetAllAcceptedReportsView(APIView):
    def get(self, request):
        reports = Report.objects.filter(
            status='accepted'
        ).order_by('-id')  

        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginator.page_size_query_param = 'page_size'
        page = paginator.paginate_queryset(reports, request)
        serializer = ReportSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)



# admin report views 

# --------admin accept report---------
class AdminAcceptReportView(APIView):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        report.status = 'accepted'
        report.save()
        return Response({
            "success": True,
            "message": "Report accepted successfully"
        }, status=status.HTTP_200_OK)
        
# --------admin solve report---------
class AdminSolveReportView(APIView):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        report.status = 'solved'
        report.save()
        return Response({
            "success": True,
            "message": "Report marked as solved successfully"
        }, status=status.HTTP_200_OK)
        
# --------admin reject report---------
class AdminRejectReportView(APIView):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        report.status = 'rejected'
        report.save()
        return Response({
            "success": True,
            "message": "Report rejected successfully"
        }, status=status.HTTP_200_OK)
        
        


# get statistics of reports

class ReportStatisticsView(APIView):
    def get(self, request):
        total_reports = Report.objects.count()
        pending_reports = Report.objects.filter(status='pending').count()
        accepted_reports = Report.objects.filter(status='accepted').count()
        solved_reports = Report.objects.filter(status='solved').count()
        rejected_reports = Report.objects.filter(status='rejected').count()
        
        return Response({
            "success": True,
            "data": {
                "total_reports": total_reports,
                "pending_reports": pending_reports,
                "accepted_reports": accepted_reports,
                "solved_reports": solved_reports,
                "rejected_reports": rejected_reports,
            }
        }, status=status.HTTP_200_OK)