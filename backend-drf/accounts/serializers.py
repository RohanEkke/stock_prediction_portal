from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already in use.")]
    )
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # User.object.create = save the password in plain text
        # User.object.create_user = automically hash the password
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password'],
        )
        # user = User.objects.create_user(**validated_data)
        return user