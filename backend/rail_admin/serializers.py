from rest_framework import serializers
from home.models import *
from django.contrib.auth.models import User

class DesignedUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = DesignedUser
        fields = ["id", "username", "first_name", "last_name", "email", "Department", "designation", "depot", "active"]
        depth = 1


# ---- Role Serializer ----
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = role
        fields = ["id", "name"]


# ---- Department Serializer ----
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name"]


# ---- User Serializer ----
class UserSerializer(serializers.ModelSerializer):
    """Base Django User serializer for nested representation"""
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


# ---- Designed User Serializer ----
class DesignedUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(source="Department", read_only=True)
    designation = RoleSerializer(read_only=True)

    class Meta:
        model = DesignedUser
        fields = ["id", "user", "department", "designation", "depot", "active"]


class TrainsetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainset
        fields = "__all__"