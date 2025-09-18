# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.authentication import TokenAuthentication
# from django.shortcuts import get_object_or_404
# from home.models import *
# from .serializers import *
# from users.permissions import IsOperationsSupervisor
# from django.db import transaction
# from django.utils.dateparse import parse_datetime
# from rest_framework.permissions import IsAuthenticated


# class OperationsDepartmentView(APIView):
#     """
#     Allows Operations Supervisors to view and update parking train entries
#     only for trains in their assigned depot.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsOperationsSupervisor]

#     def get(self, request):
#         """Fetch all parking train entries in the user's depot"""
#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         entries = ParkingTrainEntry.objects.filter(lane__depot=designed_user.depot).order_by("enterd")
#         serializer = ParkingTrainEntrySerializer(entries, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def put(self, request):
#         """Update a parking train entry by id (only if in user's depot)"""
#         entry_id = request.data.get("id")
#         if not entry_id:
#             return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         # Validate lane if provided
#         if "lane" in request.data and request.data.get("lane") is not None:
#             lane_value = request.data.get("lane")
#             lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value

#             try:
#                 lane_obj = ParkingBay.objects.get(id=lane_id)
#             except (ParkingBay.DoesNotExist, ValueError, TypeError):
#                 return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

#             if lane_obj.depot_id != designed_user.depot_id:
#                 return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

#         # Ensure the entry belongs to the user's depot
#         entry = get_object_or_404(ParkingTrainEntry, id=entry_id, lane__depot=designed_user.depot)
#         serializer = ParkingTrainEntrySerializer(entry, data=request.data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({
#                 "message": "Parking entry updated successfully",
#                 "updated_entry": serializer.data
#             }, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ParkingLanesByUserDepotView(APIView):
#     """
#     Returns all parking lanes in the depot of the requesting user.
#     Accessible only by supervisors of the Operations department.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsOperationsSupervisor]

#     def get(self, request):
#         designed_user = DesignedUser.objects.select_related("depot", "Department").filter(user=request.user).first()
#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         if designed_user.Department.name.lower() != "operations":
#             return Response({"error": "You are not part of the Operations department."}, status=status.HTTP_403_FORBIDDEN)

#         if not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         parking_lanes = ParkingBay.objects.filter(depot=designed_user.depot).order_by("lane_number")
#         serializer = ParkingBaySerializer(parking_lanes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# class TimetableWithScheduleView(APIView):
#     """
#     GET:  return timetables grouped by date with mapped TrainScheduled + Train details.
#     PUT:  partially update a Timetable (times/fields) and update/create the TrainScheduled mapping.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def _serialize_timetable(self, tt):
#         """Return a simple dict representation of a Timetable + its schedule mapping."""
#         # Try to get TrainScheduled (reverse OneToOne). handle missing mapping gracefully.
#         try:
#             ts = tt.trainscheduled
#         except TrainScheduled.DoesNotExist:
#             ts = None

#         train_data = None
#         if ts:
#             t = ts.train
#             train_data = {
#                 "id": t.id,
#                 "train_id": t.train_id,
#                 "total_distance_travelled": t.total_distance_travelled,
#                 "distance_travelled_since_last_service": t.distance_travelled_since_last_service,
#             }

#         return {
#             "id": tt.id,
#             "date": tt.date.isoformat() if tt.date else None,
#             "day": tt.day,
#             "train_number": tt.train_number,
#             "starting_point": tt.starting_point,
#             "starting_time": tt.starting_time.isoformat() if tt.starting_time else None,
#             "ending_point": tt.ending_point,
#             "ending_time": tt.ending_time.isoformat() if tt.ending_time else None,
#             "train_schedule": {
#                 "id": ts.id,
#                 "train": train_data
#             } if ts else None
#         }

#     def get(self, request):
#         """
#         Return all Timetable rows grouped by date (YYYY-MM-DD) with TrainScheduled mapping.
#         Optional query params:
#           - start_date (ISO date) and end_date (ISO date) to filter the range.
#         """
#         qs = Timetable.objects.all().order_by("date", "starting_time")

#         # Optional filtering by date strings (YYYY-MM-DD or full ISO)
#         start = request.query_params.get("start_date")
#         end = request.query_params.get("end_date")
#         if start:
#             # parse naive ISO date/time
#             try:
#                 start_dt = parse_datetime(start) or parse_datetime(f"{start}T00:00:00")
#                 qs = qs.filter(date__gte=start_dt)
#             except Exception:
#                 return Response({"error": "invalid start_date"}, status=status.HTTP_400_BAD_REQUEST)
#         if end:
#             try:
#                 end_dt = parse_datetime(end) or parse_datetime(f"{end}T23:59:59")
#                 qs = qs.filter(date__lte=end_dt)
#             except Exception:
#                 return Response({"error": "invalid end_date"}, status=status.HTTP_400_BAD_REQUEST)

#         grouped = {}
#         for tt in qs:
#             key = tt.date.date().isoformat() if tt.date else "unscheduled"
#             grouped.setdefault(key, []).append(self._serialize_timetable(tt))

#         return Response(grouped, status=status.HTTP_200_OK)

#     @transaction.atomic
#     def put(self, request):
#         """
#         Partial update Timetable and TrainScheduled mapping without using serializers.

#         Expected payload (two top-level objects):
#         {
#           "timetable": {
#             "id": 12,                       # REQUIRED
#             "date": "2025-09-14T00:00:00Z", # optional partial fields...
#             "starting_time": "2025-09-14T09:00:00Z",
#             "ending_time": "2025-09-14T11:30:00Z",
#             "train_number": 12345,
#             "day": 2,
#             "starting_point": "Depot A",
#             "ending_point": "Depot B"
#           },
#           "train_schedule": {
#             "train": 3                       # optional: Trainset PK or train_id (we try both)
#           }
#         }

#         Only "timetable.id" is required. Everything else is optional (partial update).
#         """
#         payload = request.data or {}
#         timetable_data = payload.get("timetable") or payload
#         if not timetable_data:
#             return Response({"error": "timetable data is required"}, status=status.HTTP_400_BAD_REQUEST)

#         tt_id = timetable_data.get("id")
#         if not tt_id:
#             return Response({"error": "timetable.id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         # Load timetable object
#         timetable = get_object_or_404(Timetable, id=tt_id)

#         # ---- Update Timetable fields (partial) ----
#         # Allowed fields to update
#         allowed_fields = {
#             "date": "date",
#             "day": "day",
#             "train_number": "train_number",
#             "starting_point": "starting_point",
#             "starting_time": "starting_time",
#             "ending_point": "ending_point",
#             "ending_time": "ending_time",
#         }

#         try:
#             for key, model_field in allowed_fields.items():
#                 if key in timetable_data:
#                     val = timetable_data.get(key)
#                     # parse datetimes when needed
#                     if model_field in ("date", "starting_time", "ending_time") and val is not None:
#                         parsed = parse_datetime(val)
#                         if parsed is None:
#                             return Response({"error": f"invalid datetime for {key}"}, status=status.HTTP_400_BAD_REQUEST)
#                         setattr(timetable, model_field, parsed)
#                     elif model_field == "day" and val is not None:
#                         try:
#                             setattr(timetable, model_field, int(val))
#                         except ValueError:
#                             return Response({"error": "day must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
#                     elif val is not None:
#                         setattr(timetable, model_field, val)
#             timetable.save()
#         except Exception as e:
#             transaction.set_rollback(True)
#             return Response({"error": f"failed updating timetable: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

#         # ---- Update or create TrainScheduled mapping (partial) ----
#         ts_payload = payload.get("train_schedule")
#         trainscheduled_obj = None
#         try:
#             # try existing mapping first
#             try:
#                 trainscheduled_obj = timetable.trainscheduled
#             except TrainScheduled.DoesNotExist:
#                 trainscheduled_obj = None

#             if ts_payload:
#                 # Accept ts_payload.train as either:
#                 #  - integer primary key of Trainset, or
#                 #  - a train_id (Trainset.train_id) integer
#                 train_val = ts_payload.get("train")
#                 if train_val is not None:
#                     # find Trainset by PK first, then by train_id
#                     train_obj = None
#                     try:
#                         # if train_val is dict possibly, support both
#                         if isinstance(train_val, dict):
#                             # prefer explicit id key if present
#                             tk = train_val.get("id") or train_val.get("pk")
#                             if tk is not None:
#                                 train_obj = Trainset.objects.get(pk=int(tk))
#                             else:
#                                 # try train_id key
#                                 tr_id = train_val.get("train_id")
#                                 if tr_id is not None:
#                                     train_obj = Trainset.objects.get(train_id=int(tr_id))
#                         else:
#                             # train_val is primitive - try PK first, then train_id
#                             try:
#                                 train_obj = Trainset.objects.get(pk=int(train_val))
#                             except (ValueError, Trainset.DoesNotExist):
#                                 train_obj = Trainset.objects.get(train_id=int(train_val))
#                     except Trainset.DoesNotExist:
#                         return Response({"error": "Trainset not found for provided train value"}, status=status.HTTP_400_BAD_REQUEST)
#                     # If no existing TrainScheduled, create one, else update linking train
#                     if trainscheduled_obj:
#                         trainscheduled_obj.train = train_obj
#                         trainscheduled_obj.save()
#                     else:
#                         trainscheduled_obj = TrainScheduled.objects.create(train=train_obj, slot=timetable)

#         except Exception as e:
#             transaction.set_rollback(True)
#             return Response({"error": f"failed updating train schedule: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

#         # Return the updated timetable + trainscheduled mapping
#         return Response({
#             "message": "Timetable (and TrainScheduled mapping) updated successfully",
#             "timetable": self._serialize_timetable(timetable)
#         }, status=status.HTTP_200_OK)


# class TrainsetView(APIView):
#     """
#     Returns all Trainset entries.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         trains = Trainset.objects.all().order_by("train_id")
#         serializer = TrainsetSerializer(trains, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from home.models import *
from .serializers import *
from users.permissions import IsOperationsSupervisor
from django.db import transaction
from django.utils.dateparse import parse_datetime
from rest_framework.permissions import IsAuthenticated


class OperationsDepartmentView(APIView):
    """
    Allows Operations Supervisors (or Admins) to view and update parking train entries.
    Admins can access/update entries from all depots.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOperationsSupervisor]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department and designed_user.designation and
            designed_user.Department.name.lower() == "admin" and
            designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch all parking train entries in the user's depot, or all if admin."""
        try:
            # Optimize user lookup with select_related
            designed_user = DesignedUser.objects.select_related(
                "depot", "Department", "designation"
            ).filter(user=request.user).first()
            
            if not designed_user:
                return Response(
                    {"error": "User profile not found."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Build the base queryset with all necessary related fields prefetched
            base_queryset = ParkingTrainEntry.objects.select_related(
                'train',           # Fetch the related Trainset
                'lane',            # Fetch the related ParkingBay
                'lane__depot'      # Fetch the depot through lane
            ).order_by("scheduledStart")

            if self._is_admin(designed_user):
                entries = base_queryset.all()
            else:
                if not designed_user.depot:
                    return Response(
                        {"error": "User has no depot assigned."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                entries = base_queryset.filter(lane__depot=designed_user.depot)

            # Add pagination to prevent memory issues
            entries = entries[:500]  # Limit to 500 records

            # Use the optimized serializer
            serializer = ParkingTrainEntrySerializer(entries, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in OperationsDepartmentView.get: {str(e)}")
            return Response(
                {"error": "An error occurred while fetching data."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        """Update a parking train entry (admins can update any entry, supervisors restricted to depot)."""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = self._is_admin(designed_user)

        # Validate lane if provided
        if "lane" in request.data and request.data.get("lane") is not None:
            lane_value = request.data.get("lane")
            lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value
            try:
                lane_obj = ParkingBay.objects.get(id=lane_id)
            except (ParkingBay.DoesNotExist, ValueError, TypeError):
                return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

            if not is_admin and lane_obj.depot_id != designed_user.depot_id:
                return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure the entry belongs to the user's depot (or allow admin to bypass)
        if is_admin:
            entry = get_object_or_404(ParkingTrainEntry, id=entry_id)
        else:
            entry = get_object_or_404(ParkingTrainEntry, id=entry_id, lane__depot=designed_user.depot)

        serializer = ParkingTrainEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Parking entry updated successfully", "updated_entry": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        """Create a new parking train entry (Admin only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can create parking entries."}, status=status.HTTP_403_FORBIDDEN)

        # --- Manual validation ---
        lane_id = request.data.get("lane")
        train_id = request.data.get("train")
        scheduled_start = request.data.get("scheduledStart")
        scheduled_end = request.data.get("scheduledEnd")

        missing_fields = []
        if not lane_id:
            missing_fields.append("lane")
        if not train_id:
            missing_fields.append("train")
        if not scheduled_start:
            missing_fields.append("scheduledStart")

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate lane
        try:
            lane_obj = ParkingBay.objects.get(id=lane_id)
        except ParkingBay.DoesNotExist:
            return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate train
        try:
            train_obj = Trainset.objects.get(id=train_id)
        except Trainset.DoesNotExist:
            return Response({"error": "Invalid train id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # --- Create entry ---
        entry = ParkingTrainEntry.objects.create(
            lane=lane_obj,
            train=train_obj,
            scheduledStart=scheduled_start,
            scheduledEnd=scheduled_end,
        )

        serializer = ParkingTrainEntrySerializer(entry)
        return Response({
            "message": "Parking entry created successfully",
            "created_entry": serializer.data
        }, status=status.HTTP_201_CREATED)
    def delete(self, request):
        """Delete a parking train entry by id (Admin only)."""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can delete parking entries."}, status=status.HTTP_403_FORBIDDEN)

        entry = get_object_or_404(ParkingTrainEntry, id=entry_id)
        entry.delete()

        return Response({"message": f"Parking entry {entry_id} deleted successfully"}, status=status.HTTP_200_OK)

# class ParkingLanesByUserDepotView(APIView):
#     """
#     Returns all parking lanes in the user's depot or all if admin.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsOperationsSupervisor]

#     def _is_admin(self, designed_user):
#         return (
#             designed_user.Department and designed_user.designation and
#             designed_user.Department.name.lower() == "admin" and
#             designed_user.designation.name.lower() == "admin"
#         )

#     def get(self, request):
#         designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         if self._is_admin(designed_user):
#             parking_lanes = ParkingBay.objects.all().order_by("lane_number")
#         else:
#             if designed_user.Department.name.lower() != "operations":
#                 return Response({"error": "You are not part of the Operations department."}, status=status.HTTP_403_FORBIDDEN)
#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
#             parking_lanes = ParkingBay.objects.filter(depot=designed_user.depot).order_by("lane_number")

#         serializer = ParkingBaySerializer(parking_lanes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

class ParkingLanesByUserDepotView(APIView):
    """
    View Parking Lanes:
      - Operations Supervisors: can only view their depot's lanes.
      - Admin (Department=Admin + Role=Admin): can view/create/update/delete across all depots.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsOperationsSupervisor]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch parking lanes (restricted by depot unless admin)."""
        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(
            user=request.user
        ).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if self._is_admin(designed_user):
            parking_lanes = ParkingBay.objects.all().order_by("lane_number")
        else:
            if designed_user.Department.name.lower() != "operations":
                return Response(
                    {"error": "You are not part of the Operations department."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if not designed_user.depot:
                return Response(
                    {"error": "User has no depot assigned."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            parking_lanes = ParkingBay.objects.filter(depot=designed_user.depot).order_by("lane_number")

        serializer = ParkingBaySerializer(parking_lanes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a parking lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can create parking lanes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ParkingBaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Parking lane created successfully", "lane": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update a parking lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can update parking lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(ParkingBay, id=lane_id)
        serializer = ParkingBaySerializer(lane, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Parking lane updated successfully", "lane": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete a parking lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can delete parking lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(ParkingBay, id=lane_id)
        lane.delete()
        return Response({"message": "Parking lane deleted successfully"}, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from home.models import Timetable, TrainScheduled, Trainset


from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_datetime
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger(__name__)

class TimetableWithScheduleView(APIView):
    """
    GET:    Return timetables grouped by date with mapped TrainScheduled + Train details.
    POST:   Create a new timetable and (optionally) its TrainScheduled mapping.
    PUT:    Partially update an existing timetable and/or TrainScheduled mapping.
    DELETE: Delete a timetable and its TrainScheduled mapping (if exists).
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def _serialize_timetable(self, tt):
        """
        Serialize timetable with error handling and optimized queries.
        Assumes prefetch_related has been used on the queryset.
        """
        try:
            # Try to access the related TrainScheduled object
            ts = getattr(tt, 'trainscheduled', None)
        except AttributeError:
            ts = None
        
        train_data = None
        if ts and hasattr(ts, 'train'):
            try:
                t = ts.train
                train_data = {
                    "id": t.id,
                    "train_id": t.train_id,
                    "total_distance_travelled": t.total_distance_travelled,
                    "distance_travelled_since_last_service": t.distance_travelled_since_last_service,
                }
            except (AttributeError, ObjectDoesNotExist) as e:
                logger.warning(f"Error accessing train data for timetable {tt.id}: {str(e)}")
                train_data = None
        
        return {
            "id": tt.id,
            "date": tt.date.isoformat() if tt.date else None,
            "day": tt.day,
            "train_number": tt.train_number,
            "starting_point": tt.starting_point,
            "starting_time": tt.starting_time.isoformat() if tt.starting_time else None,
            "ending_point": tt.ending_point,
            "ending_time": tt.ending_time.isoformat() if tt.ending_time else None,
            "train_schedule": {
                "id": ts.id,
                "train": train_data
            } if ts else None
        }
    
    def get(self, request):
        try:
            # Optimize the query with select_related and prefetch_related
            qs = Timetable.objects.select_related(
                'trainscheduled',
                'trainscheduled__train'
            ).order_by("date", "starting_time")
            
            start = request.query_params.get("start_date")
            end = request.query_params.get("end_date")
            
            if start:
                try:
                    start_dt = parse_datetime(start) or parse_datetime(f"{start}T00:00:00")
                    if start_dt:
                        qs = qs.filter(date__gte=start_dt)
                    else:
                        raise ValueError("Invalid start_date format")
                except (ValueError, TypeError) as e:
                    logger.error(f"Invalid start_date parameter: {start}, error: {str(e)}")
                    return Response(
                        {"error": f"Invalid start_date format: {start}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if end:
                try:
                    end_dt = parse_datetime(end) or parse_datetime(f"{end}T23:59:59")
                    if end_dt:
                        qs = qs.filter(date__lte=end_dt)
                    else:
                        raise ValueError("Invalid end_date format")
                except (ValueError, TypeError) as e:
                    logger.error(f"Invalid end_date parameter: {end}, error: {str(e)}")
                    return Response(
                        {"error": f"Invalid end_date format: {end}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Add timeout protection for large datasets
            qs = qs[:1000]  # Limit to prevent memory issues
            
            grouped = {}
            for tt in qs:
                try:
                    key = tt.date.date().isoformat() if tt.date else "unscheduled"
                    grouped.setdefault(key, []).append(self._serialize_timetable(tt))
                except Exception as e:
                    logger.error(f"Error serializing timetable {tt.id}: {str(e)}")
                    # Continue processing other records
                    continue
            
            return Response(grouped, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Unexpected error in TimetableWithScheduleView.get: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching timetables."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def post(self, request):
        """
        Create a new timetable and (optionally) a TrainScheduled mapping.
        Expected payload:
        {
            "timetable": { ... },          # Required fields for Timetable
            "train_schedule": { "train": 3 }  # Optional
        }
        """
        payload = request.data or {}
        timetable_data = payload.get("timetable") or payload
        if not timetable_data:
            return Response({"error": "timetable data is required"}, status=status.HTTP_400_BAD_REQUEST)

        allowed_fields = ["date", "day", "train_number", "starting_point", "starting_time", "ending_point", "ending_time"]
        timetable = Timetable()
        try:
            for field in allowed_fields:
                if field in timetable_data:
                    val = timetable_data[field]
                    if field in ("date", "starting_time", "ending_time") and val is not None:
                        parsed = parse_datetime(val)
                        if parsed is None:
                            return Response({"error": f"invalid datetime for {field}"}, status=status.HTTP_400_BAD_REQUEST)
                        setattr(timetable, field, parsed)
                    else:
                        setattr(timetable, field, val)
            timetable.save()
        except Exception as e:
            transaction.set_rollback(True)
            return Response({"error": f"failed creating timetable: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Optionally create TrainScheduled mapping
        ts_payload = payload.get("train_schedule")
        if ts_payload and ts_payload.get("train") is not None:
            try:
                train_val = ts_payload["train"]
                train_obj = None
                if isinstance(train_val, dict):
                    tk = train_val.get("id") or train_val.get("pk")
                    if tk:
                        train_obj = Trainset.objects.get(pk=int(tk))
                    elif train_val.get("train_id"):
                        train_obj = Trainset.objects.get(train_id=int(train_val["train_id"]))
                else:
                    try:
                        train_obj = Trainset.objects.get(pk=int(train_val))
                    except Trainset.DoesNotExist:
                        train_obj = Trainset.objects.get(train_id=int(train_val))
                TrainScheduled.objects.create(train=train_obj, slot=timetable)
            except Trainset.DoesNotExist:
                transaction.set_rollback(True)
                return Response({"error": "Trainset not found for provided train value"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Timetable created successfully",
            "timetable": self._serialize_timetable(timetable)
        }, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request):
        payload = request.data or {}
        timetable_data = payload.get("timetable") or payload
        if not timetable_data:
            return Response({"error": "timetable data is required"}, status=status.HTTP_400_BAD_REQUEST)

        tt_id = timetable_data.get("id")
        if not tt_id:
            return Response({"error": "timetable.id is required"}, status=status.HTTP_400_BAD_REQUEST)

        timetable = get_object_or_404(Timetable, id=tt_id)

        allowed_fields = {
            "date": "date",
            "day": "day",
            "train_number": "train_number",
            "starting_point": "starting_point",
            "starting_time": "starting_time",
            "ending_point": "ending_point",
            "ending_time": "ending_time",
        }

        try:
            for key, model_field in allowed_fields.items():
                if key in timetable_data:
                    val = timetable_data.get(key)
                    if model_field in ("date", "starting_time", "ending_time") and val is not None:
                        parsed = parse_datetime(val)
                        if parsed is None:
                            return Response({"error": f"invalid datetime for {key}"}, status=status.HTTP_400_BAD_REQUEST)
                        setattr(timetable, model_field, parsed)
                    elif model_field == "day" and val is not None:
                        try:
                            setattr(timetable, model_field, int(val))
                        except ValueError:
                            return Response({"error": "day must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
                    elif val is not None:
                        setattr(timetable, model_field, val)
            timetable.save()
        except Exception as e:
            transaction.set_rollback(True)
            return Response({"error": f"failed updating timetable: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        ts_payload = payload.get("train_schedule")
        try:
            try:
                trainscheduled_obj = timetable.trainscheduled
            except TrainScheduled.DoesNotExist:
                trainscheduled_obj = None

            if ts_payload and ts_payload.get("train") is not None:
                train_val = ts_payload.get("train")
                train_obj = None
                try:
                    if isinstance(train_val, dict):
                        tk = train_val.get("id") or train_val.get("pk")
                        if tk:
                            train_obj = Trainset.objects.get(pk=int(tk))
                        elif train_val.get("train_id"):
                            train_obj = Trainset.objects.get(train_id=int(train_val["train_id"]))
                    else:
                        try:
                            train_obj = Trainset.objects.get(pk=int(train_val))
                        except Trainset.DoesNotExist:
                            train_obj = Trainset.objects.get(train_id=int(train_val))
                except Trainset.DoesNotExist:
                    return Response({"error": "Trainset not found for provided train value"}, status=status.HTTP_400_BAD_REQUEST)

                if trainscheduled_obj:
                    trainscheduled_obj.train = train_obj
                    trainscheduled_obj.save()
                else:
                    trainscheduled_obj = TrainScheduled.objects.create(train=train_obj, slot=timetable)

        except Exception as e:
            transaction.set_rollback(True)
            return Response({"error": f"failed updating train schedule: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Timetable (and TrainScheduled mapping) updated successfully",
            "timetable": self._serialize_timetable(timetable)
        }, status=status.HTTP_200_OK)

    @transaction.atomic
    def delete(self, request):
        """
        Delete a timetable and its TrainScheduled mapping.
        Expected payload:
        { "id": 12 }
        """
        tt_id = request.data.get("id")
        if not tt_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        timetable = get_object_or_404(Timetable, id=tt_id)

        try:
            # delete TrainScheduled first if exists
            try:
                timetable.trainscheduled.delete()
            except TrainScheduled.DoesNotExist:
                pass
            timetable.delete()
        except Exception as e:
            transaction.set_rollback(True)
            return Response({"error": f"failed deleting timetable: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Timetable and mapping deleted successfully"}, status=status.HTTP_200_OK)


class TrainsetView(APIView):
    """
    Returns all Trainset entries.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trains = Trainset.objects.all().order_by("train_id")
        serializer = TrainsetSerializer(trains, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)