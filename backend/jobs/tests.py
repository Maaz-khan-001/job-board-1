from django.test import TestCase
from django.contrib.auth.models import User
from .models import Company, Job, Application


class JobModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.company = Company.objects.create(
            name='Test Company',
            description='A test company'
        )

    def test_job_creation(self):
        job = Job.objects.create(
            title='Software Engineer',
            company=self.company,
            description='A great job opportunity',
            requirements='Python, Django',
            location='New York',
            employment_type='full_time',
            experience_level='mid',
            posted_by=self.user
        )
        self.assertEqual(job.title, 'Software Engineer')
        self.assertEqual(job.company, self.company)
        self.assertEqual(job.status, 'draft')

    def test_application_creation(self):
        job = Job.objects.create(
            title='Software Engineer',
            company=self.company,
            description='A great job opportunity',
            requirements='Python, Django',
            location='New York',
            employment_type='full_time',
            experience_level='mid',
            posted_by=self.user
        )
        
        application = Application.objects.create(
            job=job,
            applicant=self.user,
            cover_letter='I am interested in this position'
        )
        self.assertEqual(application.status, 'pending')
        self.assertEqual(application.job, job)