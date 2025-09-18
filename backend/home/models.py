from django.db import models
from django.utils import timezone

class Depot(models.Model):
    depot_name = models.CharField(max_length=255)
    number_of_standing_lanes = models.BigIntegerField()
    number_of_cleaning_lanes = models.BigIntegerField()
    number_of_maintainance_lanes = models.BigIntegerField()

    def __str__(self):
        return self.depot_name

# ---- Custom User + Designation ----
class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
class role(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class DesignedUser(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    Department = models.ForeignKey(Department, on_delete=models.CASCADE, blank=True, null=True)
    designation = models.ForeignKey(role, on_delete=models.CASCADE,blank=True, null=True)
    depot = models.ForeignKey(Depot,on_delete=models.CASCADE, default=1)
    active = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.user.username}-{self.designation.name}"


# ---- Other Tables ----
class BrandingDeal(models.Model):
    name = models.CharField(max_length=255)
    end_date = models.DateTimeField()
    start_date = models.DateTimeField()
    exposure = models.BigIntegerField(help_text="Exposure per week")

    def __str__(self):
        return self.name


class Trainset(models.Model):
    train_id = models.BigIntegerField()
    total_distance_travelled = models.BigIntegerField()
    distance_travelled_since_last_service = models.BigIntegerField()

    def __str__(self):
        return f"Trainset {self.id}"


class Timetable(models.Model):
    date = models.DateTimeField()
    day = models.BigIntegerField()
    train_number = models.BigIntegerField()
    starting_point = models.CharField(max_length=255)
    starting_time = models.DateTimeField()
    ending_point = models.CharField(max_length=255, null=True, blank=True)
    ending_time = models.DateTimeField()

    def __str__(self):
        return f"Train {self.train_number} - {self.date}"


class TrainScheduled(models.Model):
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE)
    slot = models.OneToOneField(Timetable, on_delete=models.CASCADE, unique=True)

    def __str__(self):
        return f"TrainScheduled {self.id}"





class ParkingBay(models.Model):
    depot = models.ForeignKey(Depot, on_delete=models.CASCADE)
    lane_number = models.BigIntegerField()

    def __str__(self):
        return f"Parking Bay {self.lane_number} ({self.depot.depot_name})"


class CleaningBay(models.Model):
    depot = models.ForeignKey(Depot, on_delete=models.CASCADE)
    bay_number = models.BigIntegerField()

    def __str__(self):
        return f"Cleaning Bay {self.bay_number} ({self.depot.depot_name})"


class MaintainanceBay(models.Model):
    depot = models.ForeignKey(Depot, on_delete=models.CASCADE)
    lane_number = models.BigIntegerField()

    def __str__(self):
        return f"Maintainance Bay {self.lane_number} ({self.depot.depot_name})"


class InspectionBay(models.Model):
    depot = models.ForeignKey(Depot, on_delete=models.CASCADE)
    lane_number = models.BigIntegerField()

    def __str__(self):
        return f"Inspection Bay {self.lane_number} ({self.depot.depot_name})"


class ParkingTrainEntry(models.Model):
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE)
    lane = models.ForeignKey(ParkingBay, on_delete=models.CASCADE)
    scheduledStart = models.DateTimeField(default=timezone.now)
    scheduledEnd = models.DateTimeField(default=timezone.now)
    enterd = models.DateTimeField(blank=True, null=True)
    exited = models.DateTimeField( blank=True, null=True)

    def __str__(self):
        return f"Parking Entry Train {self.train_id}"


class CleaningTrainEntry(models.Model):
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE)
    lane = models.ForeignKey(CleaningBay, on_delete=models.CASCADE)
    scheduledStart = models.DateTimeField(default=timezone.now)
    scheduledEnd = models.DateTimeField(default=timezone.now)
    enterd = models.DateTimeField(blank=True, null=True)
    exited = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Cleaning Entry Train {self.train_id}"


class MaintainanceTrainEntry(models.Model):
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE)
    lane = models.ForeignKey(MaintainanceBay, on_delete=models.CASCADE)
    scheduledStart = models.DateTimeField(default=timezone.now)
    scheduledEnd = models.DateTimeField(default=timezone.now)
    enterd = models.DateTimeField(blank=True, null=True)
    exited = models.DateTimeField( blank=True, null=True)

    def __str__(self):
        return f"Maintainance Entry Train {self.train_id}"


class InspectionBayEntry(models.Model):
    lane = models.ForeignKey(InspectionBay, on_delete=models.CASCADE,default=1)
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE,default=1)
    scheduledStart = models.DateTimeField(default=timezone.now)
    scheduledEnd = models.DateTimeField(default=timezone.now)
    enterd = models.DateTimeField(blank=True, null=True)
    exited = models.DateTimeField( blank=True, null=True)

    def __str__(self):
        return f"Inspection Entry Train {self.train_id}"


class Branded(models.Model):
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE)
    deal = models.ForeignKey(BrandingDeal, on_delete=models.CASCADE)

    def __str__(self):
        return f"Branded {self.id}"

class jobCards(models.Model):
    train = models.ForeignKey(Trainset, on_delete=models.CASCADE)
    photo = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(blank=True, null=True)
    how_closed = models.TextField(blank=True, null=True)
    def __str__(self):
        return f"Job Card Train {self.train_id}"