from django.shortcuts import render,get_object_or_404

from django.contrib.auth.models import User
from files.models import File

from files.serializer import SignInSerializer,LogInSerializer,FileWithUserSerializer,FileSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication,TokenAuthentication

class SignInViwe(APIView):
    throttle_classes = [UserRateThrottle]
    def post(self,request):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({"token":token.key,"data":serializer.data},status=status.HTTP_201_CREATED)
        return Response({"detail":"invalid form"},status=status.HTTP_400_BAD_REQUEST)
class LogInViwe(APIView):
    throttle_classes = [UserRateThrottle]
    def post(self,request):
        user = get_object_or_404(User,username=request.data["username"])
        if not user.check_password(request.data["password"]):
            return Response({"detail":"incrrect password"},status=status.HTTP_400_BAD_REQUEST)
        token,create=Token.objects.get_or_create(user=user)
        serializer = LogInSerializer(instance=user)
        return Response({"token":token.key,"data":serializer.data},status=status.HTTP_200_OK)
    
class GetInofByToken(APIView):
    authentication_classes = [SessionAuthentication,TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        serializer = FileWithUserSerializer(user,context={"request":request})
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request):
        serializer = FileWithUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class FileDetail(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        file = get_object_or_404(File, id=file_id, user=request.user)
        serializer = FileSerializer(file,context={"request":request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, file_id):
        file = get_object_or_404(File, id=file_id, user=request.user)
        serializer = FileSerializer(file, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, file_id):
        file = get_object_or_404(File, id=file_id, user=request.user)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

        