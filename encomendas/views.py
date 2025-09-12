from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Encomenda
from django.utils import timezone
from .serializers import EncomendaSerializer
from .permissions import IsFuncionario, IsSecretaria, IsAdmin
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.dateparse import parse_datetime
from django.db.models import Q
from datetime import datetime, timedelta
from datetime import datetime, timedelta
from django.utils.dateparse import parse_datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    grupos = list(user.groups.values_list("name", flat=True))
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_superuser": user.is_superuser,
        "groups": grupos
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filtrar_encomendas(request):
    nome = request.GET.get("nome")
    status = request.GET.get("status")
    data_inicial = request.GET.get("data_inicial")
    data_final = request.GET.get("data_final")

    qs = Encomenda.objects.all()

    if nome:
        qs = qs.filter(nome_destinatario__icontains=nome)
    if status:
        qs = qs.filter(status=status)

    if data_inicial:
        # transforma yyyy-mm-dd em datetime no início do dia
        di = datetime.strptime(data_inicial, "%Y-%m-%d")
        qs = qs.filter(data_chegada__gte=di)

    if data_final:
        # transforma yyyy-mm-dd em datetime no fim do dia
        df = datetime.strptime(data_final, "%Y-%m-%d") + timedelta(days=1) - timedelta(seconds=1)
        qs = qs.filter(data_chegada__lte=df)

    serializer = EncomendaSerializer(qs, many=True)
    return Response(serializer.data)


# 📌 Listar encomendas - qualquer usuário logado pode ver
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_encomendas(request):
    encomendas = Encomenda.objects.all()
    serializer = EncomendaSerializer(encomendas, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsSecretaria | IsFuncionario | IsAdmin])
@parser_classes([MultiPartParser, FormParser])
def criar_encomenda(request):
    if "foto_encomenda_recebida" not in request.FILES:
        return Response({"erro": "É obrigatório enviar a foto da encomenda recebida!"}, status=400)

    serializer = EncomendaSerializer(data=request.data)
    if serializer.is_valid():
        encomenda = serializer.save(
            cadastrado_por=request.user,
            status="RECEBIDO"
        )
        return Response({"msg": "Encomenda cadastrada com sucesso!", "id": encomenda.id}, status=201)
    return Response(serializer.errors, status=400)




@api_view(['PUT'])
@permission_classes([IsSecretaria | IsAdmin])
@parser_classes([MultiPartParser, FormParser])   
def editar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)

    # ⚡️ Flags de remoção
    if request.data.get("remove_foto_encomenda_recebida") == "true":
        if encomenda.foto_encomenda_recebida:
            encomenda.foto_encomenda_recebida.delete(save=False)
        encomenda.foto_encomenda_recebida = None

    if request.data.get("remove_foto_encomenda_entregue") == "true":
        if encomenda.foto_encomenda_entregue:
            encomenda.foto_encomenda_entregue.delete(save=False)
        encomenda.foto_encomenda_entregue = None

    # ⚡️ Validação obrigatória
    novo_status = request.data.get("status", encomenda.status)
    if novo_status == "RECEBIDO" and not (
        request.FILES.get("foto_encomenda_recebida") or encomenda.foto_encomenda_recebida
    ):
        return Response(
            {"erro": "📸 Ops! Para salvar como RECEBIDO, adicione uma foto de recebimento."},
            status=400
        )

    if novo_status == "ENTREGUE" and not (
        request.FILES.get("foto_encomenda_entregue") or encomenda.foto_encomenda_entregue
    ):
        return Response(
            {"erro": "📸 Ops! Para salvar como ENTREGUE, adicione uma foto de entrega."},
            status=400
        )

    # ⚡️ Atualização pelo serializer
    serializer = EncomendaSerializer(encomenda, data=request.data, partial=True)
    if serializer.is_valid():
        # Se usuário mandou nova foto recebida
        if "foto_encomenda_recebida" in request.FILES:
            encomenda.foto_encomenda_recebida = request.FILES["foto_encomenda_recebida"]

        # Se usuário mandou nova foto entregue
        if "foto_encomenda_entregue" in request.FILES:
            encomenda.foto_encomenda_entregue = request.FILES["foto_encomenda_entregue"]

        # ⚡️ Salva usando o serializer (inclui observacao, nome, status, etc.)
        encomenda = serializer.save()

        return Response({
            "msg": "Encomenda atualizada com sucesso!",
            "data": EncomendaSerializer(encomenda).data
        })
    
    return Response(serializer.errors, status=400)




# 📌 Deletar encomenda - Secretaria ou Admin
@api_view(['DELETE'])
@permission_classes([IsSecretaria | IsAdmin])
def deletar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)
    encomenda.delete()
    return Response({"msg": "Encomenda deletada com sucesso!"})



# 📌 Buscar encomendas pelo nome, código ou status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buscar_encomenda(request):
    termo = request.GET.get("nome", "").strip()

    if not termo:
        # Retorna as 4 mais recentes
        encomendas = Encomenda.objects.all().order_by("-id")[:4]
    else:
        # Busca por nome, código ou status
        encomendas = Encomenda.objects.filter(
            Q(nome_destinatario__icontains=termo) |
            Q(codigo__icontains=termo) |
            Q(status__icontains=termo)
        )

    serializer = EncomendaSerializer(encomendas, many=True)
    return Response(serializer.data)



# 📌 Entregar encomenda - Secretaria ou Admin
@api_view(['PUT'])
@permission_classes([IsSecretaria | IsAdmin])
@parser_classes([MultiPartParser, FormParser])   
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
