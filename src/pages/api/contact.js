export const prerender = false;

import { query } from '../../lib/db';

export async function POST({ request }) {
  try {
    const formData = await request.formData();

    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject') || 'Website Contact Form',
      message: formData.get('message'),
    };

    if (!contactData.name || !contactData.email || !contactData.message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Name, email, and message are required fields.',
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Save to local database (primary)
    await query(
      `INSERT INTO contact_submissions (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [contactData.name, contactData.email, contactData.phone, contactData.subject, contactData.message]
    );

    // Forward to external API (secondary, fire-and-forget — don't block response)
    fetch(`${import.meta.env.BE_API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${import.meta.env.BE_API_TOKEN}`,
      },
      body: JSON.stringify(contactData),
    }).catch(err => console.error('External API forward error (non-fatal):', err));

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully!',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred. Please try again later.',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
