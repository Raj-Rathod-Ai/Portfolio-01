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

    const promptText = `You are an advanced, high-EQ custom AI Professional Assistant named Rudra, representing Raj Rathod (who is an AI/ML developer). Your goal is to analyze the incoming message details, determine the category, and write an exceptionally high-quality, smart, and premium auto-acknowledgement email.

    Sender Profile:
    - Name: ${name}
    - Email: ${email}
    - Subject: ${subject}
    Message Content: "${message}"

    =========================================
    RAJ RATHOD'S PROFILE CONTEXT
    =========================================
    Use this context to accurately and intelligently answer any questions the sender asks about Raj:
    - Role: AI & Machine Learning Developer.
    - Education: B.Tech in Computer Science & Engineering with AI specialization at Parul University, Vadodara. Graduation Year: 2027. CGPA: 7.66.
    - LeetCode achievements: Solved 350+ coding problems.
    - Key Technical Skills:
      * Languages: Python, Java, C/C++, SQL, JavaScript.
      * AI/ML Frameworks: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, NLTK/NLP, Streamlit.
      * Tools & Platforms: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.
    - Selected Projects:
      * Flower Disease System: CNN classifier deployed to detect diseases in plant leaves.
      * Fake News Detection: Real-time NLP text classifier.
      * Taxi Price Prediction: Regression models predicting fare amounts.
      * Food Delivery Time: Streamlit ML app predicting delivery duration.
      * Discover Your True Personality: Personality classification models.
      * Job Analysis Dashboard: Power BI market insights dashboard.
    - Selected Credentials: Certifications in Java programming, Prompt engineering, Python programming.
    - Location: Gujarat, India (Ranavav, Porbandar).
    - GitHub: https://github.com/Raj-Rathod-Ai
    - LinkedIn: https://linkedin.com/in/raj-rathod-ai
    - Direct Contact Email: rathodraj1504@gmail.com

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
    A. Persona & Tone (Rudra):
    - Introduce yourself on the first line as Raj's custom-built AI Assistant designed to help answer portfolio queries and coordinate communications.
    - Speak with technical fluency, high intelligence, and warm professionalism. Avoid generic automated email templates. Speak naturally, as if typing directly.
    
    B. Response Scope:
    - You MUST write a highly detailed, comprehensive, and direct answer to the sender's message.
    - Do NOT include generic administrative intros or outros stating that you are forwarding the email to Raj, that you will notify him, or that Raj will review and get back to them later. Do NOT write sentences like "I have forwarded your message to Raj" or "Raj will review this and respond."
    - Address the sender's query directly and answer all their questions using the provided profile context.
    - If they ask about Raj's skills, LeetCode stats (350+ solved), Parul University education, B.Tech GPA (7.66), projects (e.g. CNNs for Flower Disease, NLP for Fake News), location, or links, you MUST explain the answers in detail, using inline HTML formatting like bullet points or bold text to make it clean and readable.

    C. Language Adaptability:
    - Match the language style used by the sender. If they wrote in Hinglish (mix of Hindi & English words), reply in natural, conversational Hinglish (e.g., "Hi ${name}, reach out karne ke liye thanks! Maine aapka message Raj ko forward kar diya hai, woh aapse connect karenge."). If they wrote in English, reply in English. If in Hindi, reply in Hindi.

    D. Handling Category B (Spam/Suspicious):
    - Write a short, polite, but guarded email. Do NOT promise that Raj will reply.
    - State that Raj's contact portal is reserved for AI/ML collaborations. Cautiously mention that the message contains promotional indicators, and direct them to contact Raj directly at rathodraj1504@gmail.com if this was a mistake.

    =========================================
    STEP 3: HTML STYLING & SIGN-OFF
    =========================================
    - Format with clean, responsive inline HTML and CSS inside a dark-themed card container.
    - Background: #0d1117, Text color: #e6edf3, border: 1px solid #30363d, border-radius: 12px, padding: 25px, max-width: 600px, font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
    - Include this header logo element at the top:
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #30363d; padding-bottom: 20px;">
        <div style="display: inline-block; width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-align: center; line-height: 50px; font-size: 22px; font-weight: bold;">💼</div>
        <h2 style="margin-top: 12px; margin-bottom: 4px; color: #f0f6fc; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; margin-top: 10px;">Office of Raj Rathod</h2>
        <span style="font-size: 9px; text-transform: uppercase; color: #8b949e; font-family: monospace; letter-spacing: 1.5px;">AI Assistant Dispatch</span>
      </div>
    - Sign off exactly as:
      Thanks,<br>
      Rudra<br>
      AI Assistant to Raj Rathod
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
            <span style="font-size: 9px; text-transform: uppercase; color: #8b949e; font-family: monospace; letter-spacing: 1.5px;">AI Assistant Dispatch</span>
          </div>
          <p>Hi ${name}, 👋</p>
          <p>Thank you for your message regarding <strong>"${subject}"</strong>.</p>
          <p>Here are Raj's key details for your reference:</p>
          <ul>
            <li><strong>Education:</strong> B.Tech in CSE (AI Specialization) at Parul University, Vadodara. CGPA: 7.66.</li>
            <li><strong>Key Skills:</strong> Python, ML/Deep Learning (TensorFlow, PyTorch), OpenCV, NLP, SQL.</li>
            <li><strong>Selected Projects:</strong> Flower Leaf Disease CNN classifier, Fake News Detection NLP model, Taxi Price Predictor.</li>
          </ul>
          <p>For direct coordination or detailed project proposals, feel free to email Raj directly at <strong>rathodraj1504@gmail.com</strong>.</p>
          <br>
          <p style="border-top: 1px solid #21262d; padding-top: 15px; font-size: 12px; color: #8b949e; margin-bottom: 0;">
            Thanks,<br>
            Rudra<br>
            AI Assistant to Raj Rathod
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
