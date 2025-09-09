# projeto_correios/views.py
from django.shortcuts import render

def home(request):
    """
    View para a página inicial do sistema Correios FAAMA.
    """
    return render(request, 'home.html')
