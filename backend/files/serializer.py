from files.models import File
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.http import Http404

from rest_framework import serializers

class SignInSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password2"]

    def validate_email(self, value):
        validate_email(value)
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
    
class LogInSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            'password': {'write_only': True}
        }


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id","title","file","created_at"]

class FileWithUserSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True)
    class Meta:
        model = User
        fields = ["id","username","email","files"]
            
