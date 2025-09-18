# from django.shortcuts import render

# # Create your views here.
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.authentication import TokenAuthentication
# from django.shortcuts import get_object_or_404
# from home.models import MaintainanceTrainEntry, MaintainanceBay, DesignedUser
# from .serializers import MaintainanceTrainEntrySerializer, MaintainanceBaySerializer
# from users.permissions import IsMaintenanceSupervisor


# class MaintainanceDepartmentView(APIView):
#     """
#     Allows Maintainance Supervisors to view and update maintainance train entries
#     only for trains in their assigned depot.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsMaintenanceSupervisor]

#     def get(self, request):
#         """Fetch all maintainance train entries in the user's depot"""
#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         entries = MaintainanceTrainEntry.objects.filter(lane__depot=designed_user.depot).order_by("enterd")
#         serializer = MaintainanceTrainEntrySerializer(entries, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def put(self, request):
#         """Update a maintainance train entry by id (only if in user's depot)"""
#         entry_id = request.data.get("id")
#         if not entry_id:
#             return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         # If client provided a lane to update, ensure that lane exists and belongs to the user's depot
#         if "lane" in request.data and request.data.get("lane") is not None:
#             lane_value = request.data.get("lane")
#             lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value

#             try:
#                 lane_obj = MaintainanceBay.objects.get(id=lane_id)
#             except (MaintainanceBay.DoesNotExist, ValueError, TypeError):
#                 return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

#             if lane_obj.depot_id != designed_user.depot_id:
#                 return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

#         # Ensure the entry being updated belongs to the user's depot
#         entry = get_object_or_404(MaintainanceTrainEntry, id=entry_id, lane__depot=designed_user.depot)
#         serializer = MaintainanceTrainEntrySerializer(entry, data=request.data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({
#                 "message": "Maintainance entry updated successfully",
#                 "updated_entry": serializer.data
#             }, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class MaintainanceLanesByUserDepotView(APIView):
#     """
#     Returns all maintainance lanes in the depot of the requesting user.
#     Accessible only by supervisors of the Maintainance department.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsMaintenanceSupervisor]

#     def get(self, request):
#         designed_user = DesignedUser.objects.select_related("depot", "Department").filter(user=request.user).first()
#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         if designed_user.Department.name.lower() != "maintainance":
#             return Response({"error": "You are not part of the Maintainance department."}, status=status.HTTP_403_FORBIDDEN)

#         if not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         maintainance_lanes = MaintainanceBay.objects.filter(depot=designed_user.depot).order_by("lane_number")
#         serializer = MaintainanceBaySerializer(maintainance_lanes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from home.models import *
from .serializers import MaintainanceTrainEntrySerializer, MaintainanceBaySerializer
from users.permissions import IsMaintenanceSupervisor


class MaintainanceDepartmentView(APIView):
    """
    Allows Maintenance Supervisors (or Admins) to view and update maintenance train entries.
    Admins can access/update entries from all depots.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsMaintenanceSupervisor]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department and designed_user.designation and
            designed_user.Department.name.lower() == "admin" and
            designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch all maintenance train entries in the user's depot, or all if admin."""
        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if self._is_admin(designed_user):
            entries = MaintainanceTrainEntry.objects.all().order_by("enterd")
        else:
            if not designed_user.depot:
                return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
            entries = MaintainanceTrainEntry.objects.filter(lane__depot=designed_user.depot).order_by("enterd")

        serializer = MaintainanceTrainEntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update a maintenance train entry by id (admins can update any entry, supervisors restricted to depot)."""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = self._is_admin(designed_user)

        # If lane provided, validate lane exists and belongs to same depot (unless admin)
        if "lane" in request.data and request.data.get("lane") is not None:
            lane_value = request.data.get("lane")
            lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value

            try:
                lane_obj = MaintainanceBay.objects.get(id=lane_id)
            except (MaintainanceBay.DoesNotExist, ValueError, TypeError):
                return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

            if not is_admin and lane_obj.depot_id != designed_user.depot_id:
                return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure entry belongs to user's depot (or allow admin bypass)
        if is_admin:
            entry = get_object_or_404(MaintainanceTrainEntry, id=entry_id)
        else:
            entry = get_object_or_404(MaintainanceTrainEntry, id=entry_id, lane__depot=designed_user.depot)

        serializer = MaintainanceTrainEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Maintenance entry updated successfully",
                "updated_entry": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        """Create a new maintenance train entry (Admin only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can create maintenance entries."}, status=status.HTTP_403_FORBIDDEN)

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
            lane_obj = MaintainanceBay.objects.get(id=lane_id)
        except MaintainanceBay.DoesNotExist:
            return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate train
        try:
            train_obj = Trainset.objects.get(id=train_id)
        except Trainset.DoesNotExist:
            return Response({"error": "Invalid train id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # --- Create entry ---
        entry = MaintainanceTrainEntry.objects.create(
            lane=lane_obj,
            train=train_obj,
            scheduledStart=scheduled_start,
            scheduledEnd=scheduled_end,
        )

        serializer = MaintainanceTrainEntrySerializer(entry)
        return Response({
            "message": "Maintenance entry created successfully",
            "created_entry": serializer.data
        }, status=status.HTTP_201_CREATED)
    def delete(self, request):
        """Delete a maintenance train entry by id (Admin only)."""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can delete maintenance entries."}, status=status.HTTP_403_FORBIDDEN)

        entry = get_object_or_404(MaintainanceTrainEntry, id=entry_id)
        entry.delete()

        return Response({"message": f"Maintenance entry {entry_id} deleted successfully"}, status=status.HTTP_200_OK)

# class MaintainanceLanesByUserDepotView(APIView):
#     """
#     Returns all maintenance lanes in the user's depot, or all if admin.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsMaintenanceSupervisor]

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
#             maintainance_lanes = MaintainanceBay.objects.all().order_by("lane_number")
#         else:
#             if designed_user.Department.name.lower() != "maintainance":
#                 return Response({"error": "You are not part of the Maintainance department."}, status=status.HTTP_403_FORBIDDEN)
#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
#             maintainance_lanes = MaintainanceBay.objects.filter(depot=designed_user.depot).order_by("lane_number")

#         serializer = MaintainanceBaySerializer(maintainance_lanes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     def post(self, request):
#         """Create a new maintenance lane"""
#         designed_user = DesignedUser.objects.filter(
#             user=request.user
#         ).select_related("depot", "Department", "designation").first()

#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         # Supervisors can only create in their depot
#         if self._is_admin(designed_user):
#             serializer = MaintainanceBaySerializer(data=request.data)
#         else:
#             if designed_user.Department.name.lower() != "maintainance":
#                 return Response({"error": "You are not part of the Maintainance department."}, status=status.HTTP_403_FORBIDDEN)
#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#             data = request.data.copy()
#             data["depot"] = designed_user.depot.id
#             serializer = MaintainanceBaySerializer(data=data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request):
#         """Update a maintenance lane (id required in payload)"""
#         designed_user = DesignedUser.objects.filter(
#             user=request.user
#         ).select_related("depot", "Department", "designation").first()

#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         lane_id = request.data.get("id")
#         if not lane_id:
#             return Response({"error": "Lane id is required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             lane = MaintainanceBay.objects.get(pk=lane_id)
#         except MaintainanceBay.DoesNotExist:
#             return Response({"error": "Lane not found."}, status=status.HTTP_404_NOT_FOUND)

#         # Check permissions
#         if not self._is_admin(designed_user):
#             if designed_user.Department.name.lower() != "maintainance":
#                 return Response({"error": "You are not part of the Maintainance department."}, status=status.HTTP_403_FORBIDDEN)
#             if lane.depot != designed_user.depot:
#                 return Response({"error": "You cannot update lanes outside your depot."}, status=status.HTTP_403_FORBIDDEN)

#         serializer = MaintainanceBaySerializer(lane, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request):
#         """Delete a maintenance lane (id required in payload)"""
#         designed_user = DesignedUser.objects.filter(
#             user=request.user
#         ).select_related("depot", "Department", "designation").first()

#         if not designed_user:
#             return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#         lane_id = request.data.get("id")
#         if not lane_id:
#             return Response({"error": "Lane id is required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             lane = MaintainanceBay.objects.get(pk=lane_id)
#         except MaintainanceBay.DoesNotExist:
#             return Response({"error": "Lane not found."}, status=status.HTTP_404_NOT_FOUND)

#         # Check permissions
#         if not self._is_admin(designed_user):
#             if designed_user.Department.name.lower() != "maintainance":
#                 return Response({"error": "You are not part of the Maintainance department."}, status=status.HTTP_403_FORBIDDEN)
#             if lane.depot != designed_user.depot:
#                 return Response({"error": "You cannot delete lanes outside your depot."}, status=status.HTTP_403_FORBIDDEN)

#         lane.delete()
#         return Response({"message": "Lane deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class MaintainanceLanesByUserDepotView(APIView):
    """
    View Maintainance Lanes:
      - Maintenance users: only their depot.
      - Admin (Department=Admin + Role=Admin): all depots + can create/update/delete.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsMaintenanceSupervisor]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch maintenance lanes (restricted by depot unless admin)."""
        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(
            user=request.user
        ).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if self._is_admin(designed_user):
            lanes = MaintainanceBay.objects.all().order_by("lane_number")
        else:
            if designed_user.Department.name.lower() != "maintainance":
                return Response(
                    {"error": "You are not part of the Maintainance department."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if not designed_user.depot:
                return Response(
                    {"error": "User has no depot assigned."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            lanes = MaintainanceBay.objects.filter(depot=designed_user.depot).order_by("lane_number")

        serializer = MaintainanceBaySerializer(lanes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a maintenance lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can create maintenance lanes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = MaintainanceBaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Maintenance lane created successfully", "lane": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update a maintenance lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can update maintenance lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(MaintainanceBay, id=lane_id)
        serializer = MaintainanceBaySerializer(lane, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Maintenance lane updated successfully", "lane": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete a maintenance lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can delete maintenance lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(MaintainanceBay, id=lane_id)
        lane.delete()
        return Response({"message": "Maintenance lane deleted successfully"}, status=status.HTTP_200_OK)
