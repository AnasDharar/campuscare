from django.shortcuts import render
from userprofile.models import Student
# Create your views here.
def dashboard(request):
    user = request.user
    student = Student.objects.get(user=user)

    context = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'college_name': student.college_name,
        'test1': student.test1,
        'test2': student.test2,
        'test3': student.test3,
        'test4': student.test4
    }
    return render(request, 'userprofile/index.html', context)