from rest_framework.permissions import BasePermission
from home.models import DesignedUser


class IsDepartmentSupervisor(BasePermission):
    """
    Generic permission class for checking if a user is a supervisor
    for a given department OR an admin with admin designation.
    """

    department_name = None  # should be overridden in subclasses

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        try:
            designed_user = DesignedUser.objects.get(user=request.user)
        except DesignedUser.DoesNotExist:
            return False

        if not designed_user.Department or not designed_user.designation:
            return False

        department_name = designed_user.Department.name.lower()
        designation_name = designed_user.designation.name.lower()

        # Condition 1: Supervisor of the required department
        is_department_supervisor = (
            department_name == self.department_name.lower()
            and designation_name == "supervisor"
        )

        # Condition 2: Full Admin (Admin dept + Admin designation)
        is_full_admin = department_name == "admin" and designation_name == "admin"

        return is_department_supervisor or is_full_admin


class IsOperationsSupervisor(IsDepartmentSupervisor):
    department_name = "Operations"


class IsMaintenanceSupervisor(IsDepartmentSupervisor):
    department_name = "Maintainance"


class IsAdminSupervisor(IsDepartmentSupervisor):
    department_name = "Admin"


class IsCleaningSupervisor(IsDepartmentSupervisor):
    department_name = "Cleaning"


class IsInspectionSupervisor(IsDepartmentSupervisor):
    department_name = "Inspection"

class IsAdminOrInspectionOrMaintenance(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False
        if user.is_superuser:
            return True

        try:
            designed_user = user.designeduser
        except Exception:
            return False

        dept_name = designed_user.Department.name.lower() if designed_user.Department else ""
        return dept_name in ["inspection", "maintainance"]