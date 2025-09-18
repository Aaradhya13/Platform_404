from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from home.models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated


class UserManagementView(APIView):
    """
    Allows Department Admin + Role Admin to create/update DesignedUser.
    """

    authentication_classes = [TokenAuthentication]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department and designed_user.designation and
            designed_user.Department.name.lower() == "admin" and
            designed_user.designation.name.lower() == "admin"
        )

    def post(self, request):
        """Create a new DesignedUser (Admin only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can create users."}, status=status.HTTP_403_FORBIDDEN)

        # Required fields
        username = request.data.get("username")
        password = request.data.get("password")
        department_id = request.data.get("department")
        role_id = request.data.get("designation")
        depot_id = request.data.get("depot")

        missing = [f for f in ["username", "password", "department", "designation", "depot"] if not request.data.get(f)]
        if missing:
            return Response({"error": f"Missing fields: {', '.join(missing)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Optional user profile fields
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        email = request.data.get("email", "")

        # Create Django User
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        department = get_object_or_404(Department, id=department_id)
        designation = get_object_or_404(role, id=role_id)
        depot = get_object_or_404(Depot, id=depot_id)
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        

        designed_user = DesignedUser.objects.create(
            user=user,
            Department=department,
            designation=designation,
            depot=depot,
            active=True
        )

        serializer = DesignedUserSerializer(designed_user)
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

    def put(self, request):
        """Update an existing DesignedUser (Admin only)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can update users."}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get("id")
        if not user_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        entry = get_object_or_404(DesignedUser, id=user_id)
        user = entry.user  # linked Django user

        # Update Django User fields if provided
        for field in ["first_name", "last_name", "email", "username"]:
            if field in request.data:
                setattr(user, field, request.data[field])
        if "password" in request.data and request.data["password"]:
            user.set_password(request.data["password"])
        user.save()

        # Update DesignedUser fields
        serializer = DesignedUserSerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        """Fetch all users (or one if id is provided)."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user:
            return Response({"error": "User profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        if not self._is_admin(designed_user):
            return Response({"error": "Only Admin can view users."}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.query_params.get("id")
        if user_id:
            entry = get_object_or_404(DesignedUser, id=user_id)
            serializer = DesignedUserSerializer(entry)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Fetch all
        entries = DesignedUser.objects.select_related("user", "Department", "designation", "depot").all()
        serializer = DesignedUserSerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RoleManagementView(APIView):
    """
    Manage Roles/Designations (Admin only).
    """

    authentication_classes = [TokenAuthentication]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department and designed_user.designation and
            designed_user.Department.name.lower() == "admin" and
            designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch all roles or single role by id."""
        designed_user = DesignedUser.objects.select_related("Department", "designation").filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admin can view roles."}, status=status.HTTP_403_FORBIDDEN)

        role_id = request.query_params.get("id")
        if role_id:
            entry = get_object_or_404(role, id=role_id)
            serializer = RoleSerializer(entry)
            return Response(serializer.data, status=status.HTTP_200_OK)

        entries = role.objects.all()
        serializer = RoleSerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new role (Admin only)."""
        designed_user = DesignedUser.objects.filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admin can create roles."}, status=status.HTTP_403_FORBIDDEN)

        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Role created successfully", "role": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update role (Admin only)."""
        designed_user = DesignedUser.objects.filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admin can update roles."}, status=status.HTTP_403_FORBIDDEN)

        role_id = request.data.get("id")
        if not role_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        entry = get_object_or_404(role, id=role_id)
        serializer = RoleSerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Role updated successfully", "role": serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request):
    #     """Delete role (Admin only)."""
    #     designed_user = DesignedUser.objects.filter(user=request.user).first()
    #     if not designed_user or not self._is_admin(designed_user):
    #         return Response({"error": "Only Admin can delete roles."}, status=status.HTTP_403_FORBIDDEN)

    #     role_id = request.query_params.get("id")
    #     if not role_id:
    #         return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

    #     entry = get_object_or_404(role, id=role_id)
    #     entry.delete()
    #     return Response({"message": "Role deleted successfully"}, status=status.HTTP_200_OK)
class DepartmentManagementView(APIView):
    """
    Manage Departments (Admin only).
    """

    authentication_classes = [TokenAuthentication]

    def _is_admin(self, designed_user):
        return (
            designed_user.Department and designed_user.designation and
            designed_user.Department.name.lower() == "admin" and
            designed_user.designation.name.lower() == "admin"
        )

    def get(self, request):
        """Fetch all departments or single one by id."""
        designed_user = DesignedUser.objects.filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admin can view departments."}, status=status.HTTP_403_FORBIDDEN)

        dept_id = request.query_params.get("id")
        if dept_id:
            entry = get_object_or_404(Department, id=dept_id)
            serializer = DepartmentSerializer(entry)
            return Response(serializer.data, status=status.HTTP_200_OK)

        entries = Department.objects.all()
        serializer = DepartmentSerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new department (Admin only)."""
        designed_user = DesignedUser.objects.filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admin can create departments."}, status=status.HTTP_403_FORBIDDEN)

        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Department created successfully", "department": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update department (Admin only)."""
        designed_user = DesignedUser.objects.filter(user=request.user).first()
        if not designed_user or not self._is_admin(designed_user):
            return Response({"error": "Only Admin can update departments."}, status=status.HTTP_403_FORBIDDEN)

        dept_id = request.data.get("id")
        if not dept_id:
            return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        entry = get_object_or_404(Department, id=dept_id)
        serializer = DepartmentSerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Department updated successfully", "department": serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request):
    #     """Delete department (Admin only)."""
    #     designed_user = DesignedUser.objects.filter(user=request.user).first()
    #     if not designed_user or not self._is_admin(designed_user):
    #         return Response({"error": "Only Admin can delete departments."}, status=status.HTTP_403_FORBIDDEN)

    #     dept_id = request.query_params.get("id")
    #     if not dept_id:
    #         return Response({"error": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

    #     entry = get_object_or_404(Department, id=dept_id)
    #     entry.delete()
    #     return Response({"message": "Department deleted successfully"}, status=status.HTTP_200_OK)

# class TrainsetCRUDView(APIView):
#     """
#     CRUD operations for Trainset.
#     - GET: any authenticated user
#     - POST/PUT/DELETE: Admin only
#     """
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def _is_admin(self, designed_user):
#         return (
#             designed_user.Department
#             and designed_user.designation
#             and designed_user.Department.name.lower() == "admin"
#             and designed_user.designation.name.lower() == "admin"
#         )

#     def get(self, request):
#         """List all trainsets (open to all authenticated users)"""
#         trainsets = Trainset.objects.all().order_by("id")
#         serializer = TrainsetSerializer(trainsets, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         """Create a trainset (Admins only)"""
#         designed_user = DesignedUser.objects.filter(user=request.user).select_related("Department", "designation").first()
#         if not designed_user or not self._is_admin(designed_user):
#             return Response({"error": "Only Admins can create trainsets."}, status=status.HTTP_403_FORBIDDEN)

#         serializer = TrainsetSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {"message": "Trainset created successfully", "trainset": serializer.data},
#                 status=status.HTTP_201_CREATED,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request):
#         """Update a trainset (Admins only)"""
#         designed_user = DesignedUser.objects.filter(user=request.user).select_related("Department", "designation").first()
#         if not designed_user or not self._is_admin(designed_user):
#             return Response({"error": "Only Admins can update trainsets."}, status=status.HTTP_403_FORBIDDEN)

#         trainset_id = request.data.get("id")
#         if not trainset_id:
#             return Response({"error": "Trainset ID is required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             trainset = Trainset.objects.get(id=trainset_id)
#         except Trainset.DoesNotExist:
#             return Response({"error": "Trainset not found."}, status=status.HTTP_404_NOT_FOUND)

#         serializer = TrainsetSerializer(trainset, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {"message": "Trainset updated successfully", "trainset": serializer.data},
#                 status=status.HTTP_200_OK,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request):
#         """Delete a trainset (Admins only)"""
#         designed_user = DesignedUser.objects.filter(user=request.user).select_related("Department", "designation").first()
#         if not designed_user or not self._is_admin(designed_user):
#             return Response({"error": "Only Admins can delete trainsets."}, status=status.HTTP_403_FORBIDDEN)

#         trainset_id = request.data.get("id")
#         if not trainset_id:
#             return Response({"error": "Trainset ID is required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             trainset = Trainset.objects.get(id=trainset_id)
#             trainset.delete()
#             return Response({"message": "Trainset deleted successfully"}, status=status.HTTP_200_OK)
#         except Trainset.DoesNotExist:
#             return Response({"error": "Trainset not found."}, status=status.HTTP_404_NOT_FOUND)