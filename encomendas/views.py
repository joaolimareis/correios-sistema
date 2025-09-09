from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Encomenda
from .forms import EncomendaForm
from .permissions import IsFuncionario, IsSecretaria, IsAdmin


# 📌 Listar encomendas - qualquer usuário logado pode ver
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_encomendas(request):
    encomendas = Encomenda.objects.all()
    data = [
        {
            "id": e.id,
            "codigo": e.codigo,
            "status": e.status,
            "destinatario": e.nome_destinatario,
            "cadastrado_por": e.cadastrado_por.username if e.cadastrado_por else None,
        }
        for e in encomendas
    ]
    return Response(data)


# 📌 Criar encomenda - apenas Funcionário pode cadastrar
@api_view(['POST'])
@permission_classes([IsFuncionario])
def criar_encomenda(request):
    form = EncomendaForm(request.data, request.FILES)
    if form.is_valid():
        encomenda = form.save(commit=False)
        encomenda.cadastrado_por = request.user
        encomenda.save()
        return Response({"msg": "Encomenda cadastrada com sucesso!"}, status=201)
    return Response(form.errors, status=400)


# 📌 Editar encomenda - apenas Funcionário e Secretaria podem editar
@api_view(['PUT'])
@permission_classes([IsFuncionario | IsSecretaria])
def editar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)
    form = EncomendaForm(request.data, request.FILES, instance=encomenda)
    if form.is_valid():
        form.save()
        return Response({"msg": "Encomenda atualizada com sucesso!"})
    return Response(form.errors, status=400)


# 📌 Deletar encomenda - apenas Administrador pode excluir
@api_view(['DELETE'])
@permission_classes([IsAdmin])
def deletar_encomenda(request, pk):
    encomenda = get_object_or_404(Encomenda, pk=pk)
    encomenda.delete()
    return Response({"msg": "Encomenda deletada com sucesso!"})
