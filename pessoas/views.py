from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User, Group
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Pessoa


# 🔎 helper para checar se é admin ou superuser
def is_admin(user):
    return user.is_superuser or user.groups.filter(name="ADMINISTRADOR").exists()


# 📌 Listar pessoas - apenas administradores podem ver
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_pessoas(request):
    if not is_admin(request.user):
        return Response({"detail": "Acesso negado"}, status=403)

    pessoas = Pessoa.objects.select_related("user").all()
    data = []
    for p in pessoas:
        if not p.user:   # ignora registros sem usuário
            continue
        data.append({
            "id": p.id,
            "nome": p.user.first_name,
            "email": p.user.email,
            "cpf": p.cpf,
            "tipo_acesso": p.tipo_acesso,
        })
    return Response(data)


# 📌 Adicionar pessoa (registro de usuário) - apenas administradores
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adicionar_pessoa(request):
    if not is_admin(request.user):
        return Response({"detail": "Acesso negado"}, status=403)

    nome = request.data.get('nome')
    email = request.data.get('email')
    cpf = request.data.get('cpf')
    senha = request.data.get('senha')
    tipo_acesso = request.data.get('tipo_acesso')

    if not all([nome, email, cpf, senha, tipo_acesso]):
        return Response({"detail": "Todos os campos são obrigatórios"}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({"detail": "Usuário já existe"}, status=400)

    # cria User do Django
    user = User.objects.create_user(
        username=email,
        email=email,
        password=senha,
        first_name=nome
    )

    # cria perfil Pessoa
    pessoa = Pessoa.objects.create(
        user=user,
        cpf=cpf,
        tipo_acesso=tipo_acesso
    )

    # adiciona ao grupo correspondente
    grupo, _ = Group.objects.get_or_create(name=tipo_acesso)
    user.groups.add(grupo)

    return Response({
        "msg": "Usuário cadastrado com sucesso!",
        "id": pessoa.id,
        "nome": user.first_name,
        "email": user.email,
        "cpf": pessoa.cpf,
        "tipo_acesso": pessoa.tipo_acesso
    }, status=201)


# 📌 Editar pessoa - apenas administradores
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_pessoa(request, pessoa_id):
    if not is_admin(request.user):
        return Response({"detail": "Acesso negado"}, status=403)

    pessoa = get_object_or_404(Pessoa, id=pessoa_id)
    user = pessoa.user

    pessoa.cpf = request.data.get('cpf', pessoa.cpf)
    pessoa.tipo_acesso = request.data.get('tipo_acesso', pessoa.tipo_acesso)

    user.first_name = request.data.get('nome', user.first_name)
    user.email = request.data.get('email', user.email)

    if request.data.get('senha'):
        user.set_password(request.data['senha'])

    pessoa.save()
    user.save()

    return Response({"msg": "Usuário atualizado com sucesso!"})


# 📌 Excluir pessoa - apenas administradores
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def excluir_pessoa(request, pessoa_id):
    if not is_admin(request.user):
        return Response({"detail": "Acesso negado"}, status=403)

    pessoa = get_object_or_404(Pessoa, id=pessoa_id)
    user = pessoa.user

    pessoa.delete()
    user.delete()

    return Response({"msg": "Usuário excluído com sucesso!"})
