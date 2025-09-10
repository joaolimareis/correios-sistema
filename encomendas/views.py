from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Encomenda
from django.utils import timezone
from .serializers import EncomendaSerializer
from .permissions import IsFuncionario, IsSecretaria, IsAdmin
from rest_framework.parsers import MultiPartParser, FormParser


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
@parser_classes([MultiPartParser, FormParser])   # ✅ agora funciona
def criar_encomenda(request):
    serializer = EncomendaSerializer(data=request.data)
    if serializer.is_valid():
        encomenda = serializer.save(
            cadastrado_por=request.user,
            status="RECEBIDO"
        )
        return Response({"msg": "Encomenda cadastrada com sucesso!", "id": encomenda.id}, status=201)
    return Response(serializer.errors, status=400)


# 📌 Editar encomenda - Secretaria ou Admin
@api_view(['PUT'])
@permission_classes([IsSecretaria | IsAdmin])
@parser_classes([MultiPartParser, FormParser])   # 👈 necessário para aceitar upload
def editar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)

    serializer = EncomendaSerializer(
        encomenda, 
        data=request.data, 
        partial=True
    )
    if serializer.is_valid():
        # Se usuário mandou nova foto recebida
        if "foto_encomenda_recebida" in request.FILES:
            encomenda.foto_encomenda_recebida = request.FILES["foto_encomenda_recebida"]

        # Se usuário mandou nova foto entregue
        if "foto_encomenda_entregue" in request.FILES:
            encomenda.foto_encomenda_entregue = request.FILES["foto_encomenda_entregue"]

        serializer.save()
        return Response({"msg": "Encomenda atualizada com sucesso!", "data": serializer.data})
    
    return Response(serializer.errors, status=400)



# 📌 Deletar encomenda - Secretaria ou Admin
@api_view(['DELETE'])
@permission_classes([IsSecretaria | IsAdmin])
def deletar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)
    encomenda.delete()
    return Response({"msg": "Encomenda deletada com sucesso!"})


# 📌 Buscar encomendas pelo nome do destinatário
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buscar_encomenda(request):
    nome = request.GET.get("nome")
    if not nome:
        return Response({"detail": "Informe o nome do destinatário"}, status=400)

    encomendas = Encomenda.objects.filter(
        nome_destinatario__icontains=nome
    ).exclude(status="ENTREGUE")

    serializer = EncomendaSerializer(encomendas, many=True)
    return Response(serializer.data)


# 📌 Entregar encomenda - Secretaria ou Admin
@api_view(['PUT'])
@permission_classes([IsSecretaria | IsAdmin])
@parser_classes([MultiPartParser, FormParser])   # ✅ também precisa, pois tem upload
def entregar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)

    # Atualiza status e quem entregou
    encomenda.status = "ENTREGUE"
    encomenda.data_retirada = timezone.now()
    encomenda.entregue_por = request.user

    # Se veio foto de entrega
    if "foto_encomenda_entregue" in request.FILES:
        encomenda.foto_encomenda_entregue = request.FILES["foto_encomenda_entregue"]

    encomenda.save()
    serializer = EncomendaSerializer(encomenda)
    return Response({"msg": "Encomenda entregue com sucesso!", "data": serializer.data})
