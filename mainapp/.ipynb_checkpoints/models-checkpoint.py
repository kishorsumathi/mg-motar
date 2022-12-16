from django.db import models,migrations



class voicesearch(models.Model):
    part_name= models.CharField(max_length=100)
    location= models.CharField(max_length=100)
    quantity= models.IntegerField()
    class Meta:
      db_table = "voicesearch"

# Create your models here.
