from django.shortcuts import render, redirect
from .models import ChatHistory
from .forms import ChatForm
from .gemini import generate_therapist_response

def chat_view(request):
    user_id = "test_user"  # Replace with actual user login if needed
    if request.method == "POST":
        form = ChatForm(request.POST)
        if form.is_valid():
            prompt = form.cleaned_data['prompt']
            response_text = generate_therapist_response(user_id, prompt)
            # Save chat
            ChatHistory.objects.create(user_id=user_id, prompt=prompt, response=response_text)
            return redirect('chat')  # reload page to show new message
    else:
        form = ChatForm(initial={'user_id': user_id})

    history = ChatHistory.objects.filter(user_id=user_id).order_by('timestamp')
    return render(request, 'newchatbot/index.html', {'form': form, 'history': history})
