export const prerender = false;

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject') || 'Website Contact Form',
      message: formData.get('message')
    };

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Name, email, and message are required fields.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Send to external API
    const response = await fetch(`${import.meta.env.BE_API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${import.meta.env.BE_API_TOKEN}`
      },
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      const result = await response.json();
      return new Response(JSON.stringify({
        success: true,
        message: 'Message sent successfully!'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send message. Please try again.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred. Please try again later.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}