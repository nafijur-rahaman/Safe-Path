from django.db import models

# Create your models here.



class Report(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class ReportFile(models.Model):
    report = models.ForeignKey(Report, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='report_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class ReportComment(models.Model):
    report = models.ForeignKey(Report, related_name='comments', on_delete=models.CASCADE)
    author = models.CharField(max_length=255)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
class ReportTag(models.Model):
    report = models.ForeignKey(Report, related_name='tags', on_delete=models.CASCADE)
    tag = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    