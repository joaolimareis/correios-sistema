from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Encomenda
from .serializers import EncomendaSerializer
from .permissions import IsFuncionario, IsSecretaria, IsAdmin


# 📌 Listar encomendas - qualquer usuário logado pode ver
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_encomendas(request):
    encomendas = Encomenda.objects.all()
    serializer = EncomendaSerializer(encomendas, many=True)
    return Response(serializer.data)


# 📌 Criar encomenda - Secretaria, Funcionário ou Admin
@api_view(['POST'])
@permission_classes([IsSecretaria | IsFuncionario | IsAdmin])
def criar_encomenda(request):
    serializer = EncomendaSerializer(data=request.data)
    if serializer.is_valid():
        encomenda = serializer.save(cadastrado_por=request.user)
        return Response({"msg": "Encomenda cadastrada com sucesso!", "id": encomenda.id}, status=201)
    return Response(serializer.errors, status=400)


# 📌 Editar encomenda - Secretaria ou Admin
@api_view(['PUT'])
@permission_classes([IsSecretaria | IsAdmin])
def editar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)
    serializer = EncomendaSerializer(encomenda, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"msg": "Encomenda atualizada com sucesso!"})
    return Response(serializer.errors, status=400)


# 📌 Deletar encomenda - Secretaria ou Admin
@api_view(['DELETE'])
@permission_classes([IsSecretaria | IsAdmin])
def deletar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)
    encomenda.delete()
    return Response({"msg": "Encomenda deletada com sucesso!"})
