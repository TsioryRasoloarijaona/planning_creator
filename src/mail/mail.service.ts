import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendAccountCreated(params: {
    to: string;
    fullName: string;
    email: string;
    tempPassword: string;
    loginUrl: string;
    setPasswordUrl?: string;
    appName?: string;
    supportEmail?: string;
  }) {
    const {
      to,
      fullName,
      email,
      tempPassword,
      loginUrl,
      setPasswordUrl,
      appName = 'callinOut',
      supportEmail = 'support@callinout.io',
    } = params;

    const textFallback = [
      `Bienvenue sur ${appName}, ${fullName}`,
      ``,
      `Votre compte a été créé.`,
      `Adresse e-mail : ${email}`,
      `Mot de passe temporaire : ${tempPassword}`,
      ``,
      `Se connecter : ${loginUrl}`,
      setPasswordUrl ? `Définir mon mot de passe : ${setPasswordUrl}` : '',
      ``,
      `Support : ${supportEmail}`,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
            <tr>
              <td>
                <h1 style="margin:0 0 8px;font-size:18px;">Bienvenue ${fullName} 👋</h1>
                <p style="margin:0 0 12px;font-size:14px;line-height:1.6;">
                  Votre compte <strong>${appName}</strong> a été créé.
                </p>

                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:16px;">
                  <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">Adresse e-mail</p>
                  <p style="margin:0 0 12px;font-size:14px;"><strong>${email}</strong></p>
                  <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">Mot de passe temporaire</p>
                  <p style="margin:0;font-size:14px;"><strong>${tempPassword}</strong></p>
                </div>

                <div style="margin:14px 0;">
                  <a href="${loginUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;font-weight:700;text-decoration:none;background:linear-gradient(90deg,#f97316,#8b5cf6);color:#fff;">
                    Se connecter
                  </a>
                </div>

                ${
                  setPasswordUrl
                    ? `<p style="margin:8px 0 0;font-size:12px;">
                         Ou définir votre mot de passe : 
                         <a href="${setPasswordUrl}" style="color:#7c3aed;text-decoration:none;font-weight:600;">cliquez ici</a>
                       </p>`
                    : ''
                }

                <p style="margin:16px 0 0;font-size:12px;color:#6b7280;">
                  Besoin d’aide ? <a href="mailto:${supportEmail}" style="color:#7c3aed;text-decoration:none;">${supportEmail}</a>
                </p>
              </td>
            </tr>
          </table>

          <p style="max-width:560px;margin:12px auto 0;font-size:11px;color:#9ca3af;">
            Conseil sécurité : changez votre mot de passe après connexion.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    await this.mailer.sendMail({
      to,
      subject: `Bienvenue à ${appName} – Votre compte est prêt`,
      html,
      text: textFallback,
    });

    return { ok: true };
  }

  // À ajouter dans ton MailService
  async sendLeaveRequest(params: {
    to: string;
    name: string; // nom de la personne
    startDate: string | Date; // date de début
    endDate: string | Date; // date de fin
    appName?: string;
  }) {
    const { to, name, startDate, endDate, appName = 'callinOut' } = params;

    // Petit formateur de date (JJ/MM/AAAA)
    const fmt = (d: string | Date) => {
      const date = typeof d === 'string' ? new Date(d) : d;
      const day = `${date.getDate()}`.padStart(2, '0');
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const start = fmt(startDate);
    const end = fmt(endDate);

    const textFallback = `${name} vient de faire une demande de congé du ${start} au ${end}.`;

    const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
            <tr>
              <td>
                <h1 style="margin:0 0 8px;font-size:18px;">Demande de congé</h1>
                <p style="margin:0 0 12px;font-size:14px;line-height:1.6;">
                  <strong>${name}</strong> vient de faire une demande de congé.
                </p>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;">
                  <p style="margin:0;font-size:14px;">Période : <strong>du ${start} au ${end}</strong></p>
                </div>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:12px auto 0;font-size:11px;color:#9ca3af;">
            Notification automatique — ${appName}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    await this.mailer.sendMail({
      to,
      subject: `[${appName}] Demande de congé – ${name}`,
      html,
      text: textFallback,
    });

    return { ok: true };
  }
}
