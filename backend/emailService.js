const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeStr) => {
  const [h, m] = timeStr.split(':');
  return `${h}:${m} hs`;
};

const getEmailTemplate = (appointment, cancelUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Turno - Cutaneo</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f9f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9f9f9;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0a0a0a;padding:40px 48px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:8px;color:#ffffff;text-transform:uppercase;">CUTANEO</h1>
              <p style="margin:8px 0 0;font-size:11px;letter-spacing:4px;color:#888888;text-transform:uppercase;">Centro de Estética Avanzada</p>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="background:linear-gradient(90deg,#C9A882,#E8D5BB,#C9A882);height:2px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;color:#C9A882;text-transform:uppercase;font-weight:500;">Confirmación de Turno</p>
              <h2 style="margin:0 0 32px;font-size:26px;font-weight:300;color:#0a0a0a;line-height:1.3;">Hola, ${appointment.first_name} ${appointment.last_name}</h2>
              
              <p style="margin:0 0 32px;font-size:15px;color:#555555;line-height:1.7;">
                Tu turno en <strong style="color:#0a0a0a;">Cutaneo</strong> ha sido confirmado exitosamente. A continuación encontrás los detalles:
              </p>

              <!-- Appointment Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f6f3;border-radius:8px;border-left:3px solid #C9A882;">
                <tr>
                  <td style="padding:28px 32px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #eeebe7;">
                          <span style="font-size:11px;letter-spacing:2px;color:#999;text-transform:uppercase;display:block;margin-bottom:4px;">Fecha</span>
                          <span style="font-size:16px;color:#0a0a0a;font-weight:400;text-transform:capitalize;">${formatDate(appointment.appointment_date)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #eeebe7;">
                          <span style="font-size:11px;letter-spacing:2px;color:#999;text-transform:uppercase;display:block;margin-bottom:4px;">Horario</span>
                          <span style="font-size:16px;color:#0a0a0a;">${formatTime(appointment.appointment_time)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <span style="font-size:11px;letter-spacing:2px;color:#999;text-transform:uppercase;display:block;margin-bottom:4px;">Zona a tratar</span>
                          <span style="font-size:16px;color:#0a0a0a;">${appointment.treatment_zone}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 24px;font-size:14px;color:#777777;line-height:1.7;">
                Si necesitás cancelar o reprogramar tu turno, podés hacerlo hasta 24 horas antes de la cita.
              </p>

              <!-- Cancel Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:4px;border:1px solid #0a0a0a;">
                    <a href="${cancelUrl}" style="display:inline-block;padding:14px 32px;font-size:12px;letter-spacing:3px;color:#0a0a0a;text-decoration:none;text-transform:uppercase;font-weight:500;">Cancelar Turno</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f2f2f2;padding:28px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999999;letter-spacing:1px;">
                © ${new Date().getFullYear()} Cutaneo — Centro de Estética Avanzada<br>
                <span style="font-size:11px;">Este email fue enviado automáticamente. Por favor no respondas a este mensaje.</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getCancellationTemplate = (appointment) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Turno Cancelado - Cutaneo</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f9f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9f9f9;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
          <tr>
            <td style="background-color:#0a0a0a;padding:40px 48px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:8px;color:#ffffff;text-transform:uppercase;">CUTANEO</h1>
              <p style="margin:8px 0 0;font-size:11px;letter-spacing:4px;color:#888888;text-transform:uppercase;">Centro de Estética Avanzada</p>
            </td>
          </tr>
          <tr>
            <td style="background:linear-gradient(90deg,#C9A882,#E8D5BB,#C9A882);height:2px;"></td>
          </tr>
          <tr>
            <td style="padding:48px;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;color:#999;text-transform:uppercase;">Turno Cancelado</p>
              <h2 style="margin:0 0 24px;font-size:24px;font-weight:300;color:#0a0a0a;">Tu turno fue cancelado</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
                Hola <strong>${appointment.first_name}</strong>, confirmamos que tu turno del <strong style="text-transform:capitalize;">${formatDate(appointment.appointment_date)}</strong> a las <strong>${formatTime(appointment.appointment_time)}</strong> ha sido cancelado correctamente.
              </p>
              <p style="margin:0;font-size:14px;color:#777;line-height:1.7;">
                Podés reservar un nuevo turno cuando quieras desde nuestra web.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f2f2f2;padding:28px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999999;letter-spacing:1px;">© ${new Date().getFullYear()} Cutaneo — Centro de Estética Avanzada</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendConfirmationEmail = async (appointment, cancelToken) => {
  const cancelUrl = `${process.env.FRONTEND_URL}/cancelar/${cancelToken}`;
  const html = getEmailTemplate(appointment, cancelUrl);

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Cutaneo <no-reply@cutaneo.com>',
    to: appointment.email,
    subject: `✓ Turno confirmado — ${formatDate(appointment.appointment_date)}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmación enviado a ${appointment.email}`);
    return true;
  } catch (error) {
    console.error('Error enviando email de confirmación:', error.message);
    return false;
  }
};

const sendCancellationEmail = async (appointment) => {
  const html = getCancellationTemplate(appointment);

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Cutaneo <no-reply@cutaneo.com>',
    to: appointment.email,
    subject: `Turno cancelado — Cutaneo`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de cancelación enviado a ${appointment.email}`);
    return true;
  } catch (error) {
    console.error('Error enviando email de cancelación:', error.message);
    return false;
  }
};

module.exports = { sendConfirmationEmail, sendCancellationEmail };
