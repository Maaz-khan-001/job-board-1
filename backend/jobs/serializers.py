from rest_framework import serializers
from .models import Company, Job, Application, Interview
from users.serializers import UserSerializer


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    posted_by = UserSerializer(read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = ['posted_by']


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'


class ApplicationCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        exclude = ['applicant']


class InterviewSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer(read_only=True)
    interviewer = UserSerializer(read_only=True)

    class Meta:
        model = Interview
        fields = '__all__'


class InterviewCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        exclude = ['interviewer']