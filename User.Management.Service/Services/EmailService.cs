using User.Management.Service.Models;
using User.Management.Service.Services;
using MimeKit;

namespace User.Management.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _emailConfiguration;

        public EmailService(EmailConfiguration emailConfiguration)
        {
            this._emailConfiguration = emailConfiguration;
        }

        public void SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress("email", _emailConfiguration.From));
            foreach (var to in message.To)
            {
                mimeMessage.To.Add(to);
            }
            mimeMessage.Subject = message.Subject;
            mimeMessage.Body = new TextPart("plain") { Text = message.Content };
            return mimeMessage;

        }
        private void Send(MimeMessage emailMessage)
        {
            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                client.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.Port, MailKit.Security.SecureSocketOptions.StartTls);
                client.AuthenticationMechanisms.Remove("XOAUTH2"); // Remove XOAUTH2 if not needed
                client.Authenticate(_emailConfiguration.Username, _emailConfiguration.Password);
                client.Send(emailMessage);
                client.Disconnect(true);
            }
        }

    }
}

