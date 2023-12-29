import re
from email.utils import parseaddr


from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.core.mail.backends.smtp import EmailBackend
from django.template.loader import get_template
from django.utils.html import strip_tags
from premailer import transform

_email_regex = re.compile(
    "([a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\\/=?^_`"
    r"{|}~-]+)*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(\.|"
    "\\sdot\\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"
)


def remove_accents(input_str):
    """_summary_

    Args:
        input_str (_type_): _description_

    Returns:
        _type_: _description_
    """
    return input_str.replace("é", "e").replace("è", "e").replace("ê", "e")


__all__ = ["create_email", "send_emails", "valid_email", "is_valid_email"]


class EmailStagingBackend(EmailBackend):
    def route_recipients(self, recipients):
        """_summary_

        Args:
            recipients (_type_): _description_

        Returns:
            _type_: _description_
        """
        return [email for name, email in settings.ADMINS]

    def _send(self, message):
        """_summary_

        Args:
            message (_type_): _description_
        """
        orginial_receiver = ", ".join(message.to)
        message.to = self.route_recipients(message.to)
        message.cc = self.route_recipients(message.cc)
        message.bcc = self.route_recipients(message.bcc)
        message.subject += " <TESTFOR : %s>" % orginial_receiver
        super()._send(message)


class EmailProductionBackend(EmailBackend):
    def route_recipients(self, recipients):
        """_summary_

        Args:
            recipients (_type_): _description_

        Returns:
            _type_: _description_
        """
        return recipients

    def _send(self, message):
        """_summary_

        Args:
            message (_type_): _description_
        """
        super()._send(message)


def extract_emails(text):
    """_summary_

    Args:
        text (_type_): _description_

    Returns:
        _type_: _description_
    """
    if text is not None:
        return list(
            set(
                (
                    email[0]
                    for email in _email_regex.findall(text)
                    if not email[0].startswith("//")
                )
            )
        )
    else:
        return []


def emails_to_html(emails, reverse=True, classname=None, divider="<br />"):
    """_summary_

    Args:
        emails (_type_): _description_
        reverse (bool, optional): _description_. Defaults to True.
        classname (_type_, optional): _description_. Defaults to None.
        divider (str, optional): _description_. Defaults to "<br />".

    Returns:
        _type_: _description_
    """
    emails = [
        '<a href="mailto:%s" %s/>%s</a>'
        % (
            email,
            ('class="%s" ' % classname) if classname else "",
            email.strip("/"),
        )
        for email in emails
    ]
    if reverse:
        emails.reverse()
    html = divider.join(emails)
    return html


def extract_emails_to_html(text, **kwargs):
    """_summary_

    Args:
        text (_type_): _description_

    Returns:
        _type_: _description_
    """
    return emails_to_html(extract_emails(text), **kwargs)


def valid_email(email):
    """_summary_

    Args:
        email (_type_): _description_

    Returns:
        _type_: _description_
    """
    if not isinstance(email, str):
        raise Exception("Invalid email")
    result = parseaddr(email.strip().lower())

    if "@" in result[1]:
        return result[1]
    else:
        raise Exception("Invalid email")


def is_valid_email(email):
    try:
        return bool(valid_email(email))
    except Exception:
        return False


class ContentEmail(EmailMultiAlternatives):
    def __init__(
        self,
        subject,
        content,
        sender,
        receivers,
        content_type=None,
        context={},
        files=[],
        **kwargs,
    ):
        """_summary_

        Args:
            subject (_type_): _description_
            content (_type_): _description_
            sender (_type_): _description_
            receivers (_type_): _description_
            content_type (_type_, optional): _description_. Defaults to None.
            context (dict, optional): _description_. Defaults to {}.
            files (list, optional): _description_. Defaults to [].
        """
        self.is_sent = False

        subject = " ".join(subject.splitlines())
        content = kwargs.pop("body", content)

        if isinstance(receivers, (str, bytes)):
            receivers = [receivers]

        if content_type:
            super(ContentEmail, self).__init__(
                subject, "", sender, receivers, **kwargs
            )
        else:
            super(ContentEmail, self).__init__(
                subject, content, sender, receivers, **kwargs
            )

        if content_type:
            self.attach_alternative(content, content_type)
        if files:
            for file in files:
                # (nom de fichier, contenu, type mime)
                self.attach(*file)


class HtmlTemplateEmail(EmailMultiAlternatives):
    def __init__(
        self, subject, html, sender, receivers, context={}, files=[], **kwargs
    ):
        """_summary_

        Args:
            subject (_type_): _description_
            html (_type_): _description_
            sender (_type_): _description_
            receivers (_type_): _description_
            context (dict, optional): _description_. Defaults to {}.
            files (list, optional): _description_. Defaults to [].
        """
        self.is_sent = False
        self.html = html

        if isinstance(receivers, (str, bytes)):
            receivers = [receivers]

        subject = " ".join(subject.splitlines())
        text_template = strip_tags(html)
        if kwargs.get("clean_html"):
            kwargs.pop("clean_html")
            self.html = clean_html_for_email(self.html)
        super().__init__(subject, text_template, sender, receivers, **kwargs)
        self.attach_alternative(self.html, "text/html")
        if files:
            for file in files:
                self.attach(*file)


def EmailException(Exception):
    pass


def create_email(
    subject: str,
    receivers: list[str],
    sender: str = settings.EMAIL_SENDER,
    html: str = None,
    template: str = None,
    content: str = None,
    context: dict = {},
    content_type: str = None,
    files=[],
    **kwargs,
) -> ContentEmail | HtmlTemplateEmail:
    if not valid_email(sender):
        raise EmailException(f'"{sender}" is not a valid email')

    receivers = [remove_accents(r) for r in receivers]
    if template:
        html_template = get_template(template)
        html = transform(html_template.render(context))
        message = HtmlTemplateEmail(
            subject, html, sender, receivers, context, files=files, **kwargs
        )
    elif html:
        message = HtmlTemplateEmail(
            subject, html, sender, receivers, context, files=files, **kwargs
        )
    elif content:
        message = ContentEmail(
            subject,
            content,
            sender,
            receivers,
            content_type=content_type,
            files=files,
            **kwargs,
        )

    return message


def send_emails(emails, fail_silently=False) -> bool:
    """_summary_

    Args:
        emails (_type_): _description_
        fail_silently (bool, optional): _description_. Defaults to False.

    Returns:
        bool: _description_
    """
    connection = get_connection()
    connection.open()
    check = connection.send_messages(emails, fail_silently=fail_silently)
    connection.close()
    return check
