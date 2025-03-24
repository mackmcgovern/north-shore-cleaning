import type { Handler } from '@netlify/functions'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const FormSchema = z.object({
  name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[\p{L}\p{M} \-']+$/u, {
      message: 'First name must contain only letters',
    }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().refine(
    value => {
      const cleaned = value.replace(/\D/g, '')
      return cleaned.length >= 7 && cleaned.length <= 11
    },
    { message: 'Phone number is invalid' }
  ),
  subject: z.string().nonempty({ message: 'Subject is required' }),
  message: z.string().nonempty({ message: 'Message is required' }),
})

type FormData = z.infer<typeof FormSchema>

const handler: Handler = async event => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }

  let formData
  try {
    formData = JSON.parse(event.body as string)
    console.log(`parsed form daata: ${formData}`)
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return {
      statusCode: 400,
      body: 'Invalid JSON',
    }
  }

  // Validate form data
  const result = FormSchema.safeParse(formData)
  if (!result.success) {
    console.error('Validation errors:', result.error.errors)
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: result.error.errors.map(err => err.message).join(', '),
      }),
    }
  }

  const { name, email, phone, subject, message } = result.data

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Setup email data
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: process.env.CONTACT_RECEIVE_EMAIL,
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
    <html>
      <body style="font-family: Helvetica, sans-serif; line-height: 1.6; color: #333">
        <h2 style="color: #00263e;">New Contact Form Submission</h2>
       
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; min-width: 80px;"><strong>Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; min-width: 80px;"><strong>Email</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; min-width: 80px;"><strong>Phone Number</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; min-width: 80px;"><strong>Subject</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; min-width: 80px;"><strong>Message</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
       
      </body>
    </html>
  `,
  }

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully and email sent.',
      }),
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Form submitted but failed to send email.',
      }),
    }
  }
}

export { handler }
