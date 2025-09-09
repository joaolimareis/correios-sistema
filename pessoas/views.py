# pessoas/views.py
from django.shortcuts import render, redirect, get_object_or_404
from .models import Pessoa
from django.contrib import messages

def listar_pessoas(request):
    pessoas = Pessoa.objects.all()
    return render(request, 'pessoas/pessoas.html', {'pessoas': pessoas})

def adicionar_pessoa(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        cpf = request.POST.get('cpf')
        senha = request.POST.get('senha')
        tipo_acesso = request.POST.get('tipo_acesso')

        Pessoa.objects.create(
            nome=nome,
            email=email,
            cpf=cpf,
            senha=senha,
            tipo_acesso=tipo_acesso
        )
        messages.success(request, 'Pessoa cadastrada com sucesso!')
        return redirect('pessoas')
    return redirect('pessoas')

def editar_pessoa(request, pessoa_id):
    pessoa = get_object_or_404(Pessoa, id=pessoa_id)
    if request.method == 'POST':
        pessoa.nome = request.POST.get('nome')
        pessoa.email = request.POST.get('email')
        pessoa.cpf = request.POST.get('cpf')
        pessoa.senha = request.POST.get('senha')
        pessoa.tipo_acesso = request.POST.get('tipo_acesso')
        pessoa.save()
        messages.success(request, 'Pessoa atualizada com sucesso!')
        return redirect('pessoas')
    return render(request, 'pessoas/editar_pessoa.html', {'pessoa': pessoa})

def excluir_pessoa(request, pessoa_id):
    pessoa = get_object_or_404(Pessoa, id=pessoa_id)
    pessoa.delete()
    messages.success(request, 'Pessoa excluída com sucesso!')
    return redirect('pessoas')
