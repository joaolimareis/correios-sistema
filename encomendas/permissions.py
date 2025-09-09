from rest_framework.permissions import BasePermission


class IsFuncionario(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="FUNCIONARIO").exists()


class IsSecretaria(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="SECRETARIA").exists()


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.groups.filter(name="ADMINISTRADOR").exists()
