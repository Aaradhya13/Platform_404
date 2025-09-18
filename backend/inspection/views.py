from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from home.models import *
from .serializers import *
from users.permissions import *


# class InspectionDepartmentView(APIView):
#     """
#     Allows Inspection Supervisors to view and update inspection train entries
#     only for trains in their assigned depot.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsInspectionSupervisor]

#     def get(self, request):
#         """Fetch all inspection entries in the user's depot"""
#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         entries = InspectionBayEntry.objects.filter(lane__depot=designed_user.depot).order_by("scheduledStart")
#         serializer = InspectionTrainEntrySerializer(entries, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def put(self, request):
#         """Update an inspection bay entry by id (only if in user's depot)"""
#         entry_id = request.data.get("id")
#         if not entry_id:
#             return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         designed_user = DesignedUser.objects.select_related("depot").filter(user=request.user).first()
#         if not designed_user or not designed_user.depot:
#             return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#         # Check if lane provided is valid and belongs to user's depot
#         if "lane" in request.data and request.data.get("lane") is not None:
#             lane_value = request.data.get("lane")
#             lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value

#             try:
#                 lane_obj = InspectionBay.objects.get(id=lane_id)
#             except (InspectionBay.DoesNotExist, ValueError, TypeError):
#                 return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

#             if lane_obj.depot_id != designed_user.depot_id:
#                 return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

#         # Ensure the entry belongs to user's depot
#         entry = get_object_or_404(InspectionBayEntry, id=entry_id, lane__depot=designed_user.depot)
#         serializer = InspectionTrainEntrySerializer(entry, data=request.data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({
#                 "message": "Inspection entry updated successfully",
#                 "updated_entry": serializer.data
#             }, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class InspectionDepartmentView(APIView):
    """
    Allows Inspection Supervisors to view, update, create, and delete inspection train entries.
    Supervisors can view and update only trains in their assigned depot.
    Admin users (Admin department + Admin role) can view/update/create/delete all.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsInspectionSupervisor]

    def get(self, request):
        """Fetch all inspection entries (Admin sees all, supervisors see depot-specific)"""
        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )

        if is_admin:
            entries = InspectionBayEntry.objects.all().order_by("scheduledStart")
        else:
            if not designed_user.depot:
                return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
            entries = InspectionBayEntry.objects.filter(lane__depot=designed_user.depot).order_by("scheduledStart")

        serializer = InspectionTrainEntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update an inspection bay entry by id"""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )

        # Validate lane if provided
        if "lane" in request.data and request.data.get("lane") is not None:
            lane_value = request.data.get("lane")
            lane_id = lane_value.get("id") if isinstance(lane_value, dict) else lane_value
            try:
                lane_obj = InspectionBay.objects.get(id=lane_id)
            except (InspectionBay.DoesNotExist, ValueError, TypeError):
                return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

            if not is_admin and lane_obj.depot_id != designed_user.depot_id:
                return Response({"error": "Provided lane does not belong to your depot."}, status=status.HTTP_403_FORBIDDEN)

        if is_admin:
            entry = get_object_or_404(InspectionBayEntry, id=entry_id)
        else:
            if not designed_user.depot:
                return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)
            entry = get_object_or_404(InspectionBayEntry, id=entry_id, lane__depot=designed_user.depot)

        serializer = InspectionTrainEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Inspection entry updated successfully",
                "updated_entry": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """Create a new inspection bay entry (Admin only, with explicit validation)"""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )
        if not is_admin:
            return Response({"error": "Only Admin can create inspection entries."}, status=status.HTTP_403_FORBIDDEN)

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
            lane_obj = InspectionBay.objects.get(id=lane_id)
        except InspectionBay.DoesNotExist:
            return Response({"error": "Invalid lane id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate train exists
        try:
            train_obj = Trainset.objects.get(id=train_id)
        except Trainset.DoesNotExist:
            return Response({"error": "Invalid train id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # --- Manual creation ---
        entry = InspectionBayEntry.objects.create(
            lane=lane_obj,
            train=train_obj,
            scheduledStart=scheduled_start,
            scheduledEnd=scheduled_end,
        )

        # Return serialized response
        serializer = InspectionBayEntrySerializer(entry)
        return Response({
            "message": "Inspection entry created successfully",
            "created_entry": serializer.data
        }, status=status.HTTP_201_CREATED)



    def delete(self, request):
        """Delete an inspection bay entry by id (Admin only)"""
        entry_id = request.data.get("id")
        if not entry_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )
        if not is_admin:
            return Response({"error": "Only Admin can delete inspection entries."}, status=status.HTTP_403_FORBIDDEN)

        entry = get_object_or_404(InspectionBayEntry, id=entry_id)
        entry.delete()
        return Response({"message": "Inspection entry deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# class InspectionLanesByUserDepotView(APIView):
#     """
#     Returns all inspection lanes in the depot of the requesting user.
#     Accessible only by supervisors of the Inspection department.
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsInspectionSupervisor]

#     def get(self, request):
#         try:
#             designed_user = DesignedUser.objects.select_related("depot", "Department").filter(user=request.user).first()
#             if not designed_user:
#                 return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#             if designed_user.Department.name.lower() != "inspection":
#                 return Response({"error": "You are not part of the Inspection department."}, status=status.HTTP_403_FORBIDDEN)

#             if not designed_user.depot:
#                 return Response({"error": "User has no depot assigned."}, status=status.HTTP_400_BAD_REQUEST)

#             inspection_lanes = InspectionBay.objects.filter(depot=designed_user.depot).order_by("lane_number")
#             serializer = InspectionBaySerializer(inspection_lanes, many=True)

#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InspectionLanesByUserDepotView(APIView):
    """
    View Inspection Lanes:
      - Inspection users: only their depot.
      - Admin (Department=Admin + Role=Admin): all depots + can create/update/delete.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsInspectionSupervisor]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department
            and designed_user.designation
            and designed_user.Department.name.lower() == "admin"
            and designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch inspection lanes (restricted by depot unless admin)."""
        designed_user = DesignedUser.objects.select_related("depot", "Department", "designation").filter(
            user=request.user
        ).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if self._is_admin(designed_user):
            lanes = InspectionBay.objects.all().order_by("lane_number")
        else:
            if designed_user.Department.name.lower() != "inspection":
                return Response(
                    {"error": "You are not part of the Inspection department."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if not designed_user.depot:
                return Response(
                    {"error": "User has no depot assigned."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            lanes = InspectionBay.objects.filter(depot=designed_user.depot).order_by("lane_number")

        serializer = InspectionBaySerializer(lanes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create an inspection lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can create inspection lanes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = InspectionBaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Inspection lane created successfully", "lane": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update an inspection lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can update inspection lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(InspectionBay, id=lane_id)
        serializer = InspectionBaySerializer(lane, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Inspection lane updated successfully", "lane": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete an inspection lane (Admins only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admins can delete inspection lanes."}, status=status.HTTP_403_FORBIDDEN)

        lane_id = request.data.get("id")
        if not lane_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        lane = get_object_or_404(InspectionBay, id=lane_id)
        lane.delete()
        return Response({"message": "Inspection lane deleted successfully"}, status=status.HTTP_200_OK)

class JobCardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrInspectionOrMaintenance]

    def get(self, request):
        """
        Get job cards.
        If 'id' is in body → return single job card.
        Else → return all job cards.
        """
        job_id = request.data.get("id")
        if job_id:
            try:
                job = jobCards.objects.get(id=job_id)
                serializer = JobCardSerializer(job)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except jobCards.DoesNotExist:
                return Response({"error": "Job card not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            jobs = jobCards.objects.all().order_by("-created_at")
            serializer = JobCardSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """ Create a new job card """
        serializer = JobCardSerializer(data=request.data)
        if serializer.is_valid():
            jobcard = serializer.save()
            print(jobcard)
            from home.mailer import send_jobcard_mail
            send_jobcard_mail(jobcard)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """ Update an existing job card (id must be in body) """
        job_id = request.data.get("id")
        if not job_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job = jobCards.objects.get(id=job_id)
        except jobCards.DoesNotExist:
            return Response({"error": "Job card not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobCardSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """ Delete an existing job card (id must be in body) """
        job_id = request.data.get("id")
        if not job_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job = jobCards.objects.get(id=job_id)
            job.delete()
            return Response({"message": "Job card deleted"}, status=status.HTTP_204_NO_CONTENT)
        except jobCards.DoesNotExist:
            return Response({"error": "Job card not found"}, status=status.HTTP_404_NOT_FOUND)