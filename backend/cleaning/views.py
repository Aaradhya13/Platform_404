# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.authentication import TokenAuthentication
# from django.shortcuts import get_object_or_404
# from home.models import *
# from .serializers import *
# from users.permissions import IsCleaningSupervisor


# class CleaningDepartmentView(APIView):
#     """
#     Allows Cleaning Supervisors to view and update cleaning train entries
#     only for trains in their assigned depot.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsCleaningSupervisor]

#     def get(self, request):
#         """Fetch all cleaning train entries in the user's depot"""
#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         entries = CleaningTrainEntry.objects.filter(lane__depot=designed_user.depot).order_by("enterd")
#         serializer = CleaningTrainEntrySerializer(entries, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def put(self, request):
#         """Update a cleaning train entry by id (only if in user's depot)"""
#         entry_id = request.data.get("id")
#         if not entry_id:
#             return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         # If client provided a lane to update, ensure that lane exists and belongs to the user's depot
#         if "lane" in request.data and request.data.get("lane") is not None:
#             lane_value = request.data.get("lane")
#             # support either an id or a nested object like {"id": 3}
#             lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value

#             try:
#                 lane_obj = CleaningBay.objects.get(id=lane_id)
#             except (CleaningBay.DoesNotExist, ValueError, TypeError):
#                 return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

#             if lane_obj.depot_id != designed_user.depot_id:
#                 return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

#         # Ensure the entry being updated belongs to the user's depot
#         entry = get_object_or_404(CleaningTrainEntry, id=entry_id, lane__depot=designed_user.depot)
#         serializer = CleaningTrainEntrySerializer(entry, data=request.data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({
#                 "message": "Cleaning entry updated successfully",
#                 "updated_entry": serializer.data
#             }, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class CleaningLanesByUserDepotView(APIView):
#     """
#     Returns all cleaning lanes in the depot of the requesting user.
#     Accessible only by supervisors of the Cleaning department.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsCleaningSupervisor]

#     def get(self, request):
#         try:
#             # Get DesignedUser profile
#             designed_user = DesignedUser.objects.select_related("depot", "Department").filter(user=request.user).first()
#             if not designed_user:
#                 return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#             # Ensure user belongs to Cleaning department
#             if designed_user.Department.name.lower() != "cleaning":
#                 return Response({"error": "You are not part of the Cleaning department."}, status=status.HTTP_403_FORBIDDEN)

#             # Ensure the user has a depot assigned
#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#             # Get all cleaning lanes for the user's depot
#             cleaning_lanes = CleaningBay.objects.filter(depot=designed_user.depot).order_by("bay_number")
#             serializer = CleaningBaySerializer(cleaning_lanes, many=True)

#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from home.models import DesignedUser, CleaningTrainEntry, CleaningBay
from .serializers import CleaningTrainEntrySerializer, CleaningBaySerializer
from users.permissions import IsCleaningSupervisor


# class CleaningDepartmentView(APIView):
#     """
#     Allows Cleaning Supervisors to view and update cleaning train entries
#     only for trains in their assigned depot.
#     Admin users (Admin department + Admin role) can view/update all.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsCleaningSupervisor]

#     def get(self, request):
#         """Fetch all cleaning train entries in the user's depot (or all if Admin)"""
#         designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         is_admin = (
#             designed_user.Department
#             and designed_user.designation
#             and designed_user.Department.name.lower() == "admin"
#             and designed_user.designation.name.lower() == "admin"
#         )

#         if is_admin:
#             entries = CleaningTrainEntry.objects.all().order_by("enterd")
#         else:
#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
#             entries = CleaningTrainEntry.objects.filter(lane__depot=designed_user.depot).order_by("enterd")

#         serializer = CleaningTrainEntrySerializer(entries, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def put(self, request):
#         """Update a cleaning train entry by id (only if in user's depot or Admin)"""
#         entry_id = request.data.get("id")
#         if not entry_id:
#             return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         is_admin = (
#             designed_user.Department
#             and designed_user.designation
#             and designed_user.Department.name.lower() == "admin"
#             and designed_user.designation.name.lower() == "admin"
#         )

#         # If lane is provided, validate it (even for admin, to ensure lane exists)
#         if "lane" in request.data and request.data.get("lane") is not None:
#             lane_value = request.data.get("lane")
#             lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value

#             try:
#                 lane_obj = CleaningBay.objects.get(id=lane_id)
#             except (CleaningBay.DoesNotExist, ValueError, TypeError):
#                 return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

#             if not is_admin and lane_obj.depot_id != designed_user.depot_id:
#                 return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

#         # Get entry (filter by depot if not admin)
#         if is_admin:
#             entry = get_object_or_404(CleaningTrainEntry, id=entry_id)
#         else:
#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
#             entry = get_object_or_404(CleaningTrainEntry, id=entry_id, lane__depot=designed_user.depot)

#         serializer = CleaningTrainEntrySerializer(entry, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({
#                 "message": "Cleaning entry updated successfully",
#                 "updated_entry": serializer.data
#             }, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from home.models import CleaningTrainEntry, CleaningBay, Trainset, DesignedUser
from .serializers import CleaningTrainEntrySerializer
from users.permissions import IsCleaningSupervisor


class CleaningDepartmentView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsCleaningSupervisor]

    def get_user_and_admin_flag(self, request):
        designed_user = DesignedUser.objects.select_related(
            "depot", "Department", "designation"
        ).filter(user=request.user).first()

        if not designed_user:
            return None, False

        is_admin = (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )
        return designed_user, is_admin

    def get(self, request):
        designed_user, is_admin = self.get_user_and_admin_flag(request)
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if is_admin:
            entries = CleaningTrainEntry.objects.all().order_by("enterd")
        else:
            if not designed_user.depot:
                return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
            entries = CleaningTrainEntry.objects.filter(lane__depot=designed_user.depot).order_by("enterd")

        serializer = CleaningTrainEntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update cleaning entry (Admin can update any, Supervisor can only update their depot's)"""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user, is_admin = self.get_user_and_admin_flag(request)
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if is_admin:
            entry = get_object_or_404(CleaningTrainEntry, id=entry_id)
        else:
            if not designed_user.depot:
                return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
            entry = get_object_or_404(CleaningTrainEntry, id=entry_id, lane__depot=designed_user.depot)

        serializer = CleaningTrainEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated successfully", "updated_entry": serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """Create a new cleaning bay entry (Admin only, with explicit validation)"""
        designed_user, is_admin = self.get_user_and_admin_flag(request)
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not is_admin:
            return Response({"error": "Only Admins can create cleaning entries."}, status=status.HTTP_403_FORBIDDEN)

        # --- Manual validation ---
        lane_id = request.data.get("lane")
        train_id = request.data.get("train")
        scheduled_start = request.data.get("scheduledStart")
        scheduled_end = request.data.get("scheduledEnd")

        # Check required fields
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

        # Validate lane exists
        try:
            lane_obj = CleaningBay.objects.get(id=lane_id)
        except CleaningBay.DoesNotExist:
            return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate train exists
        try:
            train_obj = Trainset.objects.get(id=train_id)
        except Trainset.DoesNotExist:
            return Response({"error": "Invalid train id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # --- Manual creation ---
        entry = CleaningTrainEntry.objects.create(
            lane=lane_obj,
            train=train_obj,
            scheduledStart=scheduled_start,
            scheduledEnd=scheduled_end,
        )

        # Return serialized response
        serializer = CleaningTrainEntrySerializer(entry)
        return Response({
            "message": "Cleaning entry created successfully",
            "created_entry": serializer.data
        }, status=status.HTTP_201_CREATED)


    def delete(self, request):
        """Delete cleaning entry (Admin only)"""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user, is_admin = self.get_user_and_admin_flag(request)
        if not is_admin:
            return Response({"error": "Only Admins can delete cleaning entries."}, status=status.HTTP_403_FORBIDDEN)

        entry = get_object_or_404(CleaningTrainEntry, id=entry_id)
        entry.delete()

        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)


# class CleaningLanesByUserDepotView(APIView):
#     """
#     Returns all cleaning lanes in the depot of the requesting user.
#     Admin users (Admin department + Admin role) can view lanes from all depots.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsCleaningSupervisor]

#     def get(self, request):
#         try:
#             designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
#             if not designed_user:
#                 return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#             is_admin = (
#                 designed_user.Department
#                 and designed_user.designation
#                 and designed_user.Department.name.lower() == "admin"
#                 and designed_user.designation.name.lower() == "admin"
#             )

#             if is_admin:
#                 cleaning_lanes = CleaningBay.objects.all().order_by("bay_number")
#             else:
#                 if designed_user.Department.name.lower() != "cleaning":
#                     return Response({"error": "You are not part of the Cleaning department."}, status=status.HTTP_403_FORBIDDEN)
#                 if not designed_user.depot:
#                     return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#                 cleaning_lanes = CleaningBay.objects.filter(depot=designed_user.depot).order_by("bay_number")

#             serializer = CleaningBaySerializer(cleaning_lanes, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class CleaningLanesByUserDepotView(APIView):
    """
    View Cleaning Lanes:
      - Cleaning Supervisors: only their depot.
      - Admin (Department=Admin + Role=Admin): all depots + can create/update/delete.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsCleaningSupervisor]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch cleaning lanes (restricted by depot unless admin)."""
        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(
            user=request.user
        ).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if self._is_admin(designed_user):
            cleaning_lanes = CleaningBay.objects.all().order_by("bay_number")
        else:
            if designed_user.Department.name.lower() != "cleaning":
                return Response(
                    {"error": "You are not part of the Cleaning department."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if not designed_user.depot:
                return Response(
                    {"error": "User has no depot assigned."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cleaning_lanes = CleaningBay.objects.filter(depot=designed_user.depot).order_by("bay_number")

        serializer = CleaningBaySerializer(cleaning_lanes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a cleaning lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can create cleaning lanes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CleaningBaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Cleaning lane created successfully", "lane": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update a cleaning lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can update cleaning lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(CleaningBay, id=lane_id)
        serializer = CleaningBaySerializer(lane, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Cleaning lane updated successfully", "lane": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete a cleaning lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can delete cleaning lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(CleaningBay, id=lane_id)
        lane.delete()
        return Response({"message": "Cleaning lane deleted successfully"}, status=status.HTTP_200_OK)
