from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import TipSerializer
from .models import Tip


# ------------tip view----------------#
class TipView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        serializer = TipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            tip = Tip.objects.get(pk=pk)
            tip.delete()
            return Response({
                "success": True}, status=status.HTTP_204_NO_CONTENT)
        except Tip.DoesNotExist:
            return Response({
                "success": False}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            tip = Tip.objects.get(pk=pk)
            serializer = TipSerializer(tip, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({
                "success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Tip.DoesNotExist:
            return Response({
                "success": False}, status=status.HTTP_404_NOT_FOUND)


class GetAllTipsView(APIView):
    def get(self, request):
        tips = Tip.objects.all().order_by('-created_at')
        serializer = TipSerializer(tips, many=True)
        return Response({
            "success": True, "data": serializer.data
        }, status=status.HTTP_200_OK)