# # # home/views.py
# # from django.http import JsonResponse
# # from django.utils import timezone
# # from datetime import timedelta
# # import random

# # from django.contrib.auth import get_user_model
# # from .models import (
# #     Department, DesignedUser, BrandingDeal, Trainset, Timetable,
# #     Depot, ParkingBay, CleaningBay, MaintainanceBay, InspectionBay,
# #     ParkingTrainEntry, CleaningTrainEntry, MaintainanceTrainEntry, InspectionBayEntry,
# #     Branded
# # )

# # User = get_user_model()

# # def seed_data_view(request):
# #     now = timezone.now()

# #     # ---- Departments + Users ----
# #     dept_names = [
# #         "Operations", "RollingStock", "Signalling", "Cleaning", "Marketing", "Maintenance"
# #     ]
# #     created_users = []
# #     for dn in dept_names:
# #         dept, _ = Department.objects.get_or_create(name=dn)

# #         username = {
# #             "Operations": "user_ops",
# #             "RollingStock": "user_rolling",
# #             "Signalling": "user_signalling",
# #             "Cleaning": "user_cleaning",
# #             "Marketing": "user_marketing",
# #             "Maintenance": "user_maintenance",
# #         }[dn]

# #         user, user_created = User.objects.get_or_create(
# #             username=username,
# #             defaults={"email": f"{username}@example.com"}
# #         )
# #         if user_created:
# #             user.set_password("shetty@2005")
# #             user.save()
# #         DesignedUser.objects.get_or_create(user=user, defaults={"designation": dept})
# #         created_users.append(username)

# #     # ---- Depot + Bays ----
# #     depot, _ = Depot.objects.get_or_create(
# #         depot_name="Muttom",
# #         defaults={
# #             "number_of_standing_lanes": 12,
# #             "number_of_cleaning_lanes": 2,
# #             "number_of_maintainance_lanes": 3
# #         }
# #     )

# #     # Create parking, cleaning, maintenance, inspection bays
# #     ParkingBay.objects.filter(depot=depot).delete()
# #     for i in range(1, 13):
# #         ParkingBay.objects.create(depot=depot, lane_number=i)

# #     CleaningBay.objects.filter(depot=depot).delete()
# #     for i in range(1, 3):
# #         CleaningBay.objects.create(depot=depot, bay_number=i)

# #     MaintainanceBay.objects.filter(depot=depot).delete()
# #     for i in range(1, 4):
# #         MaintainanceBay.objects.create(depot=depot, lane_number=i)

# #     InspectionBay.objects.filter(depot=depot).delete()
# #     for i in range(1, 4):
# #         InspectionBay.objects.create(depot=depot, lane_number=i)

# #     # ---- Trainsets ----
# #     for t in range(1, 26):
# #         Trainset.objects.get_or_create(
# #             train_id=t,
# #             defaults={
# #                 "total_distance_travelled": random.randint(50_000, 300_000),
# #                 "distance_travelled_since_last_service": random.randint(500, 25_000)
# #             }
# #         )

# #     # ---- Branding deals ----
# #     bd1, _ = BrandingDeal.objects.get_or_create(
# #         name="Branding_Q3_Deal",
# #         defaults={
# #             "start_date": now - timedelta(days=10),
# #             "end_date": now + timedelta(days=50),
# #             "exposure": 1000
# #         }
# #     )
# #     bd2, _ = BrandingDeal.objects.get_or_create(
# #         name="Branding_Sports_Event",
# #         defaults={
# #             "start_date": now - timedelta(days=5),
# #             "end_date": now + timedelta(days=20),
# #             "exposure": 400
# #         }
# #     )

# #     sample_trains = Trainset.objects.all()[:4]
# #     for i, t in enumerate(sample_trains):
# #         deal = bd1 if i % 2 == 0 else bd2
# #         Branded.objects.get_or_create(train=t, deal=deal)

# #     # ---- Timetable for 30 days ----
# #     days = 30
# #     half = days // 2
# #     start_date = (now - timedelta(days=half)).replace(hour=0, minute=0, second=0, microsecond=0)
# #     Timetable.objects.filter(date__gte=start_date, date__lt=start_date + timedelta(days=days)).delete()

# #     for d in range(days):
# #         day_date = start_date + timedelta(days=d)
# #         for idx, svc in enumerate([100, 101, 102, 103, 104]):
# #             dep_time = (day_date + timedelta(hours=5 + idx * 2))
# #             arr_time = dep_time + timedelta(hours=4)
# #             Timetable.objects.create(
# #                 date=day_date,
# #                 day=day_date.weekday(),
# #                 train_number=svc,
# #                 starting_point="Depot Muttom",
# #                 starting_time=dep_time,
# #                 ending_point="Depot Muttom",
# #                 ending_time=arr_time
# #             )

# #     return JsonResponse({"status": "success", "users_created": created_users, "depot": depot.depot_name})


# @require_GET
# def populate_trains_and_operations(request):
#     """
#     Populate DB with dummy train schedule + cleaning, maintenance, inspection, parking entries.
#     Accessible at /populate/.
#     """
#     try:
#         trainsets = []
#         for i in range(1, 6):  # create 5 dummy trains
#             train, created = Trainset.objects.get_or_create(
#                 train_id=i,
#                 defaults={
#                     "total_distance_travelled": 10000 * i,
#                     "distance_travelled_since_last_service": 500 * i
#                 }
#             )
#             trainsets.append(train)

#         # Create dummy timetable slots (one per train)
#         for train in trainsets:
#             timetable, created = Timetable.objects.get_or_create(
#                 train_number=train.train_id,
#                 date=now(),
#                 defaults={
#                     "day": now().weekday(),
#                     "starting_point": "Depot A",
#                     "starting_time": now(),
#                     "ending_point": "Depot B",
#                     "ending_time": now() + timedelta(hours=4),
#                 }
#             )
#             TrainScheduled.objects.get_or_create(train=train, slot=timetable)

#         # Pick the first bay of each type (you may want to pre-create them in admin)
#         parking_bay = ParkingBay.objects.first()
#         cleaning_bay = CleaningBay.objects.first()
#         maintainance_bay = MaintainanceBay.objects.first()
#         inspection_bay = InspectionBay.objects.first()

#         for train in trainsets:
#             # Parking entry
#             if parking_bay:
#                 ParkingTrainEntry.objects.create(
#                     train=train,
#                     lane=parking_bay,
#                     enterd=now(),
#                     exited=now() + timedelta(hours=6)
#                 )

#             # Cleaning entry
#             if cleaning_bay:
#                 CleaningTrainEntry.objects.create(
#                     train=train,
#                     lane=cleaning_bay,
#                     enterd=now(),
#                     exited=now() + timedelta(hours=1)
#                 )

#             # Maintenance entry (for only some trains)
#             if maintainance_bay and train.train_id % 2 == 0:
#                 MaintainanceTrainEntry.objects.create(
#                     train=train,
#                     lane=maintainance_bay,
#                     enterd=now(),
#                     exited=now() + timedelta(days=1)
#                 )

#             # Inspection entry (happens daily for all trains)
#             if inspection_bay:
#                 InspectionBayEntry.objects.create(
#                     bay=inspection_bay,
#                     train_id=train.train_id,
#                     start_time=now(),
#                     end_time=now() + timedelta(minutes=30)
#                 )

#         return JsonResponse({"success": True, "message": "Dummy data populated successfully."})

#     except Exception as e:
#         return JsonResponse({"success": False, "error": str(e)}, status=500)

from django.utils.timezone import now, timedelta
from django.contrib.auth.models import User
from django.http import JsonResponse
import random

from .models import (
    Department, role, DesignedUser, Depot,
    ParkingBay, CleaningBay, MaintainanceBay, InspectionBay,
    Trainset, Timetable, TrainScheduled,
    ParkingTrainEntry, CleaningTrainEntry, MaintainanceTrainEntry, InspectionBayEntry,
)

# def populate_demo_data(request):
#     try:
#         # 1️⃣ Departments and Roles
#         ops_dept, _ = Department.objects.get_or_create(name="Operations")
#         maint_dept, _ = Department.objects.get_or_create(name="Maintenance")

#         admin_role, _ = role.objects.get_or_create(name="Admin")
#         tech_role, _ = role.objects.get_or_create(name="Technician")

#         # 2️⃣ Users
#         for i in range(1, 4):
#             user, created = User.objects.get_or_create(
#                 username=f"user{i}",
#                 defaults={"email": f"user{i}@example.com"}
#             )
#             if created:
#                 user.set_password("shetty@2005")
#                 user.save()

#             DesignedUser.objects.get_or_create(
#                 user=user,
#                 Department=ops_dept if i % 2 else maint_dept,
#                 designation=admin_role if i == 1 else tech_role
#             )

#         # 3️⃣ Depot and Bays
#         depot, _ = Depot.objects.get_or_create(
#             depot_name="Muttom",
#             defaults={
#                 "number_of_standing_lanes": 10,
#                 "number_of_cleaning_lanes": 2,
#                 "number_of_maintainance_lanes": 2,
#             }
#         )

#         parking_bays = [ParkingBay.objects.get_or_create(depot=depot, lane_number=i)[0] for i in range(1, 11)]
#         cleaning_bays = [CleaningBay.objects.get_or_create(depot=depot, bay_number=i)[0] for i in range(1, 3)]
#         maintain_bays = [MaintainanceBay.objects.get_or_create(depot=depot, lane_number=i)[0] for i in range(1, 3)]
#         inspection_bays = [InspectionBay.objects.get_or_create(depot=depot, lane_number=i)[0] for i in range(1, 3)]

#         # 4️⃣ Trainsets
#         trains = []
#         for t in range(1, 26):
#             train, _ = Trainset.objects.get_or_create(
#                 train_id=t,
#                 defaults={"total_distance_travelled": random.randint(50000, 100000),
#                           "distance_travelled_since_last_service": random.randint(100, 1000)}
#             )
#             trains.append(train)

#         # 5️⃣ Timetable (one month)
#         today = now().date()
#         for day_offset in range(-15, 16):  # 30 days window around today
#             date = today + timedelta(days=day_offset)
#             for t in range(1, 6):  # only 5 slots per day for demo
#                 start_time = now().replace(hour=6, minute=0) + timedelta(days=day_offset, minutes=t*15)
#                 end_time = start_time + timedelta(minutes=45)
#                 timetable, _ = Timetable.objects.get_or_create(
#                     date=date,
#                     day=date.weekday(),
#                     train_number=t,
#                     starting_point="Muttom",
#                     starting_time=start_time,
#                     ending_point="Aluva",
#                     ending_time=end_time,
#                 )
#                 if not TrainScheduled.objects.filter(slot=timetable).exists():
#                     TrainScheduled.objects.create(
#                         train=random.choice(trains),
#                         slot=timetable
#                     )

#         # 6️⃣ Historical Entries
#         for train in random.sample(trains, 10):
#             CleaningTrainEntry.objects.get_or_create(
#                 train=train,
#                 lane=random.choice(cleaning_bays),
#                 enterd=now() - timedelta(hours=6),
#                 exited=now() - timedelta(hours=5)
#             )
#             InspectionBayEntry.objects.get_or_create(
#                 bay=random.choice(inspection_bays),
#                 train_id=train.id,
#                 start_time=now() - timedelta(hours=4),
#                 end_time=now() - timedelta(hours=3)
#             )
#             ParkingTrainEntry.objects.get_or_create(
#                 train=train,
#                 lane=random.choice(parking_bays),
#                 enterd=now() - timedelta(hours=8),
#                 exited=now() - timedelta(hours=7)
#             )

#         # 2 trains currently in maintenance
#         for train in random.sample(trains, 2):
#             MaintainanceTrainEntry.objects.get_or_create(
#                 train=train,
#                 lane=random.choice(maintain_bays),
#                 enterd=now() - timedelta(hours=1),
#                 exited=now() + timedelta(hours=4)  # still ongoing
#             )

#         return JsonResponse({"status": "success", "message": "Demo data populated!"})

#     except Exception as e:
#         return JsonResponse({"status": "error", "message": str(e)}, status=500)
# home/views.py
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.utils.timezone import now, timedelta
import random

from .models import (
    Department, role, DesignedUser, Depot,
    ParkingBay, CleaningBay, MaintainanceBay, InspectionBay,
    Trainset, Timetable, TrainScheduled, BrandingDeal, Branded,
    ParkingTrainEntry, CleaningTrainEntry, MaintainanceTrainEntry, InspectionBayEntry
)

User = get_user_model()

def seed_everything(request):
    """
    Combined view to seed:
    - Departments, roles, and users
    - Depot and bays
    - Trainsets, branding deals
    - Timetables + TrainScheduled
    - Historical + ongoing operations (parking, cleaning, maintenance, inspection)
    Accessible at: /
    """
    try:
        # 1️⃣ Departments & Roles
        departments = ["Operations", "RollingStock", "Signalling", "Cleaning", "Marketing", "Maintenance"]
        dept_objs = {}
        for d in departments:
            dept_objs[d], _ = Department.objects.get_or_create(name=d)

        admin_role, _ = role.objects.get_or_create(name="Admin")
        tech_role, _ = role.objects.get_or_create(name="Technician")

        created_users = []
        for i, d in enumerate(departments, start=1):
            username = f"user_{d.lower()}"
            user, created = User.objects.get_or_create(username=username, defaults={"email": f"{username}@example.com"})
            if created:
                user.set_password("shetty@2005")
                user.save()
                created_users.append(username)

            DesignedUser.objects.get_or_create(
                user=user,
                defaults={
                    "Department": dept_objs[d],
                    "designation": admin_role if i % 2 == 0 else tech_role,
                }
            )

        # 2️⃣ Depot & Bays
        depot, _ = Depot.objects.get_or_create(
            depot_name="Muttom",
            defaults={
                "number_of_standing_lanes": 12,
                "number_of_cleaning_lanes": 2,
                "number_of_maintainance_lanes": 3,
            }
        )

        parking_bays = [ParkingBay.objects.get_or_create(depot=depot, lane_number=i)[0] for i in range(1, 13)]
        cleaning_bays = [CleaningBay.objects.get_or_create(depot=depot, bay_number=i)[0] for i in range(1, 3)]
        maintain_bays = [MaintainanceBay.objects.get_or_create(depot=depot, lane_number=i)[0] for i in range(1, 4)]
        inspection_bays = [InspectionBay.objects.get_or_create(depot=depot, lane_number=i)[0] for i in range(1, 4)]

        # 3️⃣ Trainsets
        trains = []
        for t in range(1, 26):
            train, _ = Trainset.objects.get_or_create(
                train_id=t,
                defaults={
                    "total_distance_travelled": random.randint(50_000, 300_000),
                    "distance_travelled_since_last_service": random.randint(500, 25_000)
                }
            )
            trains.append(train)

        # 4️⃣ Branding Deals + Branded Trains
        bd1, _ = BrandingDeal.objects.get_or_create(
            name="Branding_Q3_Deal",
            defaults={"start_date": now() - timedelta(days=10), "end_date": now() + timedelta(days=50), "exposure": 1000}
        )
        bd2, _ = BrandingDeal.objects.get_or_create(
            name="Branding_Sports_Event",
            defaults={"start_date": now() - timedelta(days=5), "end_date": now() + timedelta(days=20), "exposure": 400}
        )

        for i, t in enumerate(trains[:4]):
            deal = bd1 if i % 2 == 0 else bd2
            Branded.objects.get_or_create(train=t, deal=deal)

        # 5️⃣ Timetables + TrainScheduled (30 days window)
        start_date = (now() - timedelta(days=15)).replace(hour=0, minute=0, second=0, microsecond=0)
        for d in range(30):
            day_date = start_date + timedelta(days=d)
            for idx, svc in enumerate([100, 101, 102, 103, 104]):
                dep_time = (day_date + timedelta(hours=5 + idx * 2))
                arr_time = dep_time + timedelta(hours=4)
                timetable, _ = Timetable.objects.get_or_create(
                    date=day_date,
                    train_number=svc,
                    defaults={
                        "day": day_date.weekday(),
                        "starting_point": "Depot Muttom",
                        "starting_time": dep_time,
                        "ending_point": "Depot Muttom",
                        "ending_time": arr_time
                    }
                )
                TrainScheduled.objects.get_or_create(train=random.choice(trains), slot=timetable)

        # 6️⃣ Historical Operations (past) + Ongoing Maintenance
        for train in random.sample(trains, 10):
            ParkingTrainEntry.objects.get_or_create(
                train=train,
                lane=random.choice(parking_bays),
                enterd=now() - timedelta(hours=8),
                exited=now() - timedelta(hours=7)
            )
            CleaningTrainEntry.objects.get_or_create(
                train=train,
                lane=random.choice(cleaning_bays),
                enterd=now() - timedelta(hours=6),
                exited=now() - timedelta(hours=5)
            )
            InspectionBayEntry.objects.get_or_create(
                bay=random.choice(inspection_bays),
                train_id=train.train_id,
                start_time=now() - timedelta(hours=4),
                end_time=now() - timedelta(hours=3)
            )

        for train in random.sample(trains, 2):
            MaintainanceTrainEntry.objects.get_or_create(
                train=train,
                lane=random.choice(maintain_bays),
                enterd=now() - timedelta(hours=1),
                exited=now() + timedelta(hours=4)  # still ongoing
            )

        return JsonResponse({
            "status": "success",
            "message": "Seeding completed successfully",
            "users_created": created_users,
            "depot": depot.depot_name,
            "train_count": len(trains)
        })

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
