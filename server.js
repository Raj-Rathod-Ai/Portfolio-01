require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets from current directory
app.use(express.static(__dirname));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.warn('Backend will continue running in OFFLINE fallback mode.');
  });

// Schema definition
const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  review: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// Preset Default Reviews to seed if database is empty
const DEFAULT_PRESETS = [
  {
    name: 'Prof. K. R. Patel',
    rating: 5,
    review: 'Raj is a highly competent machine learning developer. His work on predictive models shows clean styling, sound architecture, and solid execution. Excellent engineering mindset!',
    date: '12 Jun 2026'
  },
  {
    name: 'Mayur (Cyber Security Teammate)',
    rating: 5,
    review: 'Worked with Raj on computer vision applications. His speed in debugging model deployments and building pipeline interfaces is exceptional. Great teammate!',
    date: '02 May 2026'
  }
];

// Seed initial database helper
async function seedDefaultReviews() {
  try {
    // Automatically migrate old Amit Shah database records to Mayur
    await Review.updateMany(
      { name: 'Amit Shah (AI Hackathon Teammate)' },
      { name: 'Mayur (Cyber Security Teammate)' }
    );
    const count = await Review.countDocuments();
    if (count === 0) {
      console.log('Seeding default professional reviews in MongoDB...');
      await Review.insertMany(DEFAULT_PRESETS);
    }
  } catch (err) {
    console.error('Database seeding warning:', err.message);
  }
}

// Trigger seeding after database connection is ready
mongoose.connection.once('open', () => {
  seedDefaultReviews();
});

// ================= API ENDPOINTS =================

// GET /api/reviews - List all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    // If Mongoose is not connected, fallback to sending default review values directly
    if (mongoose.connection.readyState !== 1) {
      return res.json(DEFAULT_PRESETS);
    }
    const reviews = await Review.find().sort({ createdAt: -1 });
    if (reviews.length === 0) {
      return res.json(DEFAULT_PRESETS);
    }
    res.json(reviews);
  } catch (err) {
    console.error('GET reviews error:', err);
    res.status(500).json({ error: 'Failed to retrieve reviews', fallback: DEFAULT_PRESETS });
  }
});

// POST /api/reviews - Add a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, review } = req.body;
    if (!name || !review) {
      return res.status(400).json({ error: 'Name and review content are required.' });
    }

    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newReviewData = {
      name,
      rating: parseInt(rating) || 5,
      review,
      date: formattedDate
    };

    // If MongoDB is not connected, simulate success by returning mock JSON
    if (mongoose.connection.readyState !== 1) {
      console.warn('Database offline. Returning mock response for review submit.');
      return res.status(201).json(newReviewData);
    }

    const newReview = new Review(newReviewData);
    await newReview.save();
    console.log(`New review saved for: ${name}`);
    res.status(201).json(newReview);
  } catch (err) {
    console.error('POST review error:', err);
    res.status(500).json({ error: 'Failed to save review to database.' });
  }
});

// POST /api/contact - Direct inquiry handler with Gemini AI assistant auto-replies via Brevo SMTP
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    console.log(`Inquiry received from: ${name} (${email})`);

    // 1. Save the inquiry to MongoDB database
    let dbSaved = false;
    try {
      if (mongoose.connection.readyState === 1) {
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        dbSaved = true;
        console.log(`Inquiry from ${name} saved successfully in MongoDB.`);
      } else {
        console.warn('MongoDB not connected. Inquiry not saved to DB.');
      }
    } catch (dbErr) {
      console.error('Error saving contact to MongoDB:', dbErr.message);
    }

    // 2. Check if we have API keys to send the auto-response
    const hasKeys = process.env.GEMINI_API_KEY && process.env.BREVO_API_KEY;
    if (!hasKeys) {
      if (dbSaved) {
        console.log('Inquiry saved to DB, but API keys are missing. Returning success.');
        return res.status(200).json({ success: true, status: 'saved_to_db_only' });
      }
      return res.status(500).json({ error: 'Database offline and API keys missing.' });
    }

    // Call Gemini API to write a customizable email response
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const promptText = `You are an advanced classification and email dispatch assistant. Your job is to analyze the incoming message details, determine the category, and write an exceptionally high-quality, human-sounding auto-acknowledgement email.

    Sender Profile:
    - Name: ${name}
    - Email: ${email}
    - Subject: ${subject}
    Message Content: "${message}"

    =========================================
    STEP 1: CLASSIFICATION (SPAM vs LEGITIMATE)
    =========================================
    Analyze the message content and email to determine the category:
    - CATEGORY A (LEGITIMATE): Technical inquiries, portfolio feedback, internship opportunities, freelance project requests, collaboration proposals, university queries, or general networking.
    - CATEGORY B (SPAM/SUSPICIOUS): Marketing pitches, SEO ranking offers, cryptocurrency/Web3 promos, unsolicited link-building requests, bulk templates, phishing, offensive language, or empty/gibberish text.

    You MUST prefix your output on the very first line with EXACTLY:
    either '[CLASSIFICATION: LEGITIMATE]' or '[CLASSIFICATION: SPAM]' followed by a line break.

    =========================================
    STEP 2: EMAIL DRAFTING REQUIREMENTS
    =========================================
    Draft the email based on the guidelines below.

    A. Tone and Persona (Rudra):
    - Speak as "Rudra", a real human personal assistant managing the inbox for Raj Rathod (who is an AI/ML developer).
    - Sound warm, polite, direct, and conversational.
    - NEVER say "I am an AI", "I am a bot", "This is an automated message", or "As an AI language model". Speak exactly like a human secretary.
    - Avoid robotic corporate clichés like "I hope this email finds you well", "Thank you for contacting us", "Your message has been logged", "We appreciate your interest". Speak naturally.

    B. Forwarding & Response Scope:
    - Acknowledge that you received their message regarding "${subject}".
    - Explain that you have forwarded the inquiry directly to Raj for review.
    - State that Raj will review it and reply directly to their address (${email}) as soon as possible.
    - CRITICAL: Do NOT attempt to answer technical questions, write code, or make business commitments. If the sender asked questions, say: "I've passed your questions on to Raj so he can give you a proper answer directly."

    C. Language Adaptability:
    - Identify the language style used by the sender and reply in the EXACT SAME style.
    - If they wrote in Hinglish (mix of Hindi & English words), reply in natural, conversational Hinglish (e.g., "Hi ${name}, reach out karne ke liye thanks! Maine aapka message Raj ko forward kar diya hai, woh aapse connect karenge.").
    - If they wrote in English, reply in English.
    - If they wrote in Hindi, reply in clean, warm Hindi.

    D. Handling Category B (Spam/Suspicious):
    - Write a short, polite, but guarded email.
    - Do NOT promise that Raj will reply.
    - State that Raj's contact portal is reserved for AI/ML collaborations and direct opportunities. Cautiously mention that the message contains promotional indicators or links, and direct them to contact Raj directly at rathodraj1504@gmail.com if this was a mistake, requesting them to avoid unsolicited bulk submissions.

    =========================================
    STEP 3: HTML STYLING & SIGN-OFF
    =========================================
    - Format with clean, responsive inline HTML and CSS inside a dark-themed card container.
    - Background: #0d1117, Text color: #e6edf3, border: 1px solid #30363d, border-radius: 12px, padding: 25px, max-width: 600px, font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
    - Include this header logo element at the top:
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #30363d; padding-bottom: 20px;">
        <div style="display: inline-block; width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-align: center; line-height: 50px; font-size: 22px; font-weight: bold;">💼</div>
        <h2 style="margin-top: 12px; margin-bottom: 4px; color: #f0f6fc; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; margin-top: 10px;">Office of Raj Rathod</h2>
        <span style="font-size: 9px; text-transform: uppercase; color: #8b949e; font-family: monospace; letter-spacing: 1.5px;">Assistant Dispatch</span>
      </div>
    - Incorporate 1 or 2 standard emojis naturally.
    - Sign off exactly as:
      Thanks,<br>
      Rudra<br>
      Assistant to Raj Rathod
    - Return ONLY the raw HTML content starting with the classification tag. Do not wrap in markdown code blocks.`;

    let htmlReply = '';
    let isSpam = false;
    try {
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }]
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        let rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        rawText = rawText.replace(/```html/gi, '').replace(/```/g, '').trim();
        
        if (rawText.startsWith('[CLASSIFICATION: SPAM]')) {
          isSpam = true;
          rawText = rawText.replace('[CLASSIFICATION: SPAM]', '').trim();
        } else if (rawText.startsWith('[CLASSIFICATION: LEGITIMATE]')) {
          rawText = rawText.replace('[CLASSIFICATION: LEGITIMATE]', '').trim();
        } else if (rawText.includes('[CLASSIFICATION: SPAM]')) {
          isSpam = true;
          rawText = rawText.replace('[CLASSIFICATION: SPAM]', '').trim();
        } else if (rawText.includes('[CLASSIFICATION: LEGITIMATE]')) {
          rawText = rawText.replace('[CLASSIFICATION: LEGITIMATE]', '').trim();
        }
        htmlReply = rawText;
      } else {
        const errText = await geminiRes.text();
        console.warn(`Gemini API failed (${geminiRes.status}): ${errText}. Falling back to default response template.`);
      }
    } catch (aiErr) {
      console.warn('Gemini AI call caught error:', aiErr.message, 'Falling back to default template.');
    }

    // Default premium HTML fallback template if Gemini failed or returned empty
    if (!htmlReply) {
      htmlReply = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 25px; background: #0d1117; color: #e6edf3; border-radius: 12px; border: 1px solid #30363d; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #30363d; padding-bottom: 20px;">
            <div style="display: inline-block; width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-align: center; line-height: 50px; font-size: 22px; font-weight: bold;">💼</div>
            <h2 style="margin-top: 12px; margin-bottom: 4px; color: #f0f6fc; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; font-family: sans-serif;">Office of Raj Rathod</h2>
            <span style="font-size: 9px; text-transform: uppercase; color: #8b949e; font-family: monospace; letter-spacing: 1.5px;">Assistant Dispatch</span>
          </div>
          <p>Hi ${name}, 👋</p>
          <p>Thank you for reaching out! I am Raj's assistant, Rudra. I wanted to let you know that I've received your message regarding <strong>"${subject}"</strong> and have forwarded it directly to Raj.</p>
          <p>He will review it and get back to you directly at this address (<strong>${email}</strong>) as soon as possible.</p>
          <p>Have a wonderful day! ✨</p>
          <br>
          <p style="border-top: 1px solid #21262d; padding-top: 15px; font-size: 12px; color: #8b949e; margin-bottom: 0;">
            Thanks,<br>
            Rudra<br>
            Assistant to Raj Rathod
          </p>
        </div>
      `;
    }

    // Setup sender email address (configurable if Brevo account uses a different primary sender)
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'rathodraj1504@gmail.com';

    // 1. Call Brevo transactional API to send notification to Raj
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: "Portfolio Notification", email: senderEmail },
          to: [{ email: "rathodraj1504@gmail.com", name: "Raj Rathod" }],
          subject: `${isSpam ? '[SPAM Blocked] ' : '[New Inquiry] '}${subject} from ${name}`,
          htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; background: #0d1117; color: #f0f6fc; border-radius: 12px; border: 1px solid #30363d; max-width: 600px; margin: auto;">
              <h2 style="color: ${isSpam ? '#f43f5e' : '#6366f1'}; border-bottom: 1px solid #30363d; padding-bottom: 10px; margin-top: 0;">
                ${isSpam ? 'Suspicious Spam Blocked' : 'New Message Logged'}
              </h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="background: #161b22; padding: 15px; border-radius: 8px; border: 1px solid #21262d; margin: 15px 0; white-space: pre-wrap; font-size: 14px; line-height: 1.5; color: #e6edf3;">${message}</div>
              <span style="font-size: 11px; color: #8b949e;">Date: ${dateStr}</span>
            </div>
          `
        })
      });
      console.log(`Notification email successfully sent to rathodraj1504@gmail.com`);
    } catch (notifyErr) {
      console.error('Failed to send notification email to Raj:', notifyErr.message);
    }

    // 2. Call Brevo transactional API to send AI reply to the user (ONLY if not classified as spam)
    if (!isSpam) {
      try {
        const plainTextReply = htmlReply.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          },
          body: JSON.stringify({
            sender: { name: "Rudra (Assistant to Raj)", email: senderEmail },
            to: [{ email: email, name: name }],
            replyTo: { email: "rathodraj1504@gmail.com", name: "Raj Rathod" },
            subject: `Regarding your inquiry: ${subject} - Raj Rathod`,
            htmlContent: htmlReply,
            textContent: plainTextReply // Standard plain-text counterpart to lower spam score
          })
        });

        if (!brevoRes.ok) {
          const errText = await brevoRes.text();
          console.warn(`Brevo auto-reply failed: ${errText}`);
        } else {
          console.log(`AI Auto-response successfully dispatched via Brevo to: ${email}`);
        }
      } catch (brevoErr) {
        console.warn('Brevo auto-reply call failed:', brevoErr.message);
      }
    } else {
      console.log(`AI Auto-response skipped because message was classified as Category B (Spam/Junk).`);
    }

    res.status(200).json({ success: true, status: isSpam ? 'spam_blocked' : 'dispatched' });

  } catch (err) {
    console.error('Contact endpoint error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/health - Diagnostic endpoint for validating configurations
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    config: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasBrevoKey: !!process.env.BREVO_API_KEY,
      senderEmail: process.env.BREVO_SENDER_EMAIL || 'rathodraj1504@gmail.com'
    }
  });
});

// Serve frontend route fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server listener
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Express server running on: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
