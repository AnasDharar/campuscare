from django.shortcuts import redirect, render

# Create your views here.

def landing(request):
    user = request.user
    if user.is_authenticated:
        return redirect('/dashboard/')
    return render(request, 'index.html')
