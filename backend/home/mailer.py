from django.core.mail import send_mail
from django.conf import settings

def send_jobcard_mail(jobcard):
    subject = f"New Job Card Created for Train {jobcard.train.train_id}"
    message = (
        f"A new job card has been created.\n\n"
        f"Train: {jobcard.train.train_id}\n"
        f"Description: {jobcard.description}\n"
        f"Created At: {jobcard.created_at}\n"
    )
    
    # Collect recipients → all Admin + Maintenance Supervisors
    from home.models import DesignedUser
    admins_and_maintenance = DesignedUser.objects.filter(
        Department__name__in=["admin", "Maintainance"], active=True
    ).select_related("user")
    print(admins_and_maintenance)
    recipient_list = [du.user.email for du in admins_and_maintenance if du.user.email]

    if recipient_list:  # only send if valid emails exist
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False,
        )
