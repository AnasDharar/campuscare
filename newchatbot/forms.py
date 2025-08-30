from django import forms

class ChatForm(forms.Form):
    user_id = forms.CharField(widget=forms.HiddenInput())  # hidden field, or can be from login
    prompt = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3, 'cols': 50, 'placeholder': 'Type your message here...'}),
        label='Your Message'
    )
