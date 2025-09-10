# projeto_correios/views.py
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

def home(request):
    """
    View para a página inicial do sistema Correios FAAMA.
    """
    return render(request, 'home.html')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # pega os grupos do usuário
        groups = [group.name for group in self.user.groups.all()]
        data['groups'] = groups
        data['username'] = self.user.username

        return data


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer