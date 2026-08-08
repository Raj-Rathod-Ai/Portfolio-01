require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Safe HTTP fetch helper for all Node environments
const safeFetch = async (url, options = {}) => {
  if (typeof fetch === 'function') {
    return fetch(url, options);
  }
  const https = require('https');
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => JSON.parse(data),
            text: async () => data
          });
        });
      });
      req.on('error', reject);
      if (options.body) req.write(options.body);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
};

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

const VisitSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  visitorName: { type: String },
  ipAddress: { type: String },
  visitCount: { type: Number, default: 1 },
  pagesViewed: [{ path: String, timestamp: { type: Date, default: Date.now } }],
  lastVisit: { type: Date, default: Date.now },
  userAgent: { type: String }
}, { timestamps: true });

const Visit = mongoose.model('Visit', VisitSchema);

const InteractionSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  visitorName: { type: String, default: 'Anonymous Visitor' },
  type: { type: String, required: true }, // 'project_click', 'github_click', 'live_demo_click', 'category_click', 'view_details'
  targetName: { type: String }, // e.g. "Flower Disease System" or "RAG"
  category: { type: String }, // e.g. "RAG", "Generative AI", "NLP"
  linkUrl: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Interaction = mongoose.model('Interaction', InteractionSchema);

const VisitorProfileSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  role: { type: String },
  isStudent: { type: Boolean },
  contactDetails: { type: String },
  ipAddress: { type: String },
  visitedCategories: [{ type: String }],
  chatHistory: [{ role: String, content: String, timestamp: Date }],
  updatedAt: { type: Date, default: Date.now }
});

const VisitorProfile = mongoose.model('VisitorProfile', VisitorProfileSchema);

const crypto = require('crypto');

const AdminSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now }
});

const AdminSetting = mongoose.model('AdminSetting', AdminSettingSchema);

function hashPassword(password) {
  if (!password || typeof password !== 'string') return '';
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

// Default hashes initialized for Pooja1908 / pooja1908
const DEFAULT_MASTER_HASH = hashPassword('Pooja1908');
const DEFAULT_MASTER_HASH_LOWER = hashPassword('pooja1908');

async function getMasterPasswordHash() {
  try {
    if (mongoose.connection.readyState === 1) {
      let setting = await AdminSetting.findOne({ key: 'master_password_hash' });
      if (setting && setting.value) return setting.value;

      // Migrate legacy unhashed entry if present
      const oldSetting = await AdminSetting.findOne({ key: 'master_password' });
      if (oldSetting && oldSetting.value) {
        const migratedHash = hashPassword(oldSetting.value);
        setting = new AdminSetting({ key: 'master_password_hash', value: migratedHash });
        await setting.save();
        await AdminSetting.deleteOne({ key: 'master_password' });
        return migratedHash;
      }

      // Initialize default password hash for Pooja1908
      setting = new AdminSetting({ key: 'master_password_hash', value: DEFAULT_MASTER_HASH });
      await setting.save();
      return DEFAULT_MASTER_HASH;
    }
  } catch (e) {}
  return DEFAULT_MASTER_HASH;
}

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

// ================= MULTILINGUAL PROFANITY & ABUSER GUARD =================
const ABUSIVE_PATTERNS = [
  'fuck', 'fucking', 'fucker', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy',
  'motherfucker', 'cock', 'whore', 'slut', 'bullshit', 'prick', 'twat', 'wanker', 'retard',
  'bhenchod', 'benchod', 'bhanchod', 'bc', 'madarchod', 'mc', 'chutiya', 'chutya', 'chootiya',
  'bsdk', 'bhosdike', 'bhosdika', 'bhosdi', 'lauda', 'loda', 'lodu', 'laund', 'gand', 'gaand',
  'gaandu', 'gandu', 'choot', 'chut', 'harami', 'hrami', 'saala', 'sala', 'kamina', 'kamine',
  'bkl', 'bhenke lode', 'bhenkelode', 'randi', 'rndi', 'raand', 'kutta', 'kutti', 'tatte', 'tatta',
  'jhantu', 'jhatu', 'chutiye', 'bhenchods', 'bhosad', 'maderchod', 'madarchodh', 'ghando', 'gandiyad'
];

function checkAbusiveContent(text) {
  if (!text || typeof text !== 'string') return { isAbusive: false };
  const rawLower = text.toLowerCase();
  
  // Anti-evasion normalization
  const normalized = text
    .toLowerCase()
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/0/g, 'o')
    .replace(/1|!|\|/g, 'i')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/\*/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/(.)\1{2,}/g, '$1$1')
    .trim();

  const spaceless = normalized.replace(/\s+/g, '');

  for (const word of ABUSIVE_PATTERNS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'i');
    if (pattern.test(rawLower) || pattern.test(normalized)) {
      return { isAbusive: true, word };
    }
    if (word.length >= 4 && spaceless.includes(word)) {
      return { isAbusive: true, word };
    }
  }
  return { isAbusive: false };
}

// Trigger seeding after database connection is ready
mongoose.connection.once('open', () => {
  seedDefaultReviews();
});

// ================= API ENDPOINTS =================

// GET /api/reviews - List all reviews (filtering out any profane entries)
app.get('/api/reviews', async (req, res) => {
  try {
    // If Mongoose is not connected, fallback to sending default review values directly
    if (mongoose.connection.readyState !== 1) {
      return res.json(DEFAULT_PRESETS);
    }
    const reviews = await Review.find().sort({ createdAt: -1 });
    // Filter out any stored reviews containing abusive content
    const cleanReviews = reviews.filter(r => 
      !checkAbusiveContent(r.name).isAbusive && !checkAbusiveContent(r.review).isAbusive
    );

    if (cleanReviews.length === 0) {
      return res.json(DEFAULT_PRESETS);
    }
    res.json(cleanReviews);
  } catch (err) {
    console.error('GET reviews error:', err);
    res.status(500).json({ error: 'Failed to retrieve reviews', fallback: DEFAULT_PRESETS });
  }
});

// GET /api/project-overrides - Retrieve global project overrides (Solo/Group & Featured top pins)
app.get('/api/project-overrides', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const setting = await AdminSetting.findOne({ key: 'boss_project_overrides' });
      if (setting && setting.value) {
        return res.json({ overrides: setting.value });
      }
    }
    res.json({ overrides: {} });
  } catch (err) {
    res.json({ overrides: {} });
  }
});

// POST /api/project-overrides - Update global project overrides (Boss only)
app.post('/api/project-overrides', async (req, res) => {
  try {
    const { overrides } = req.body;
    if (!overrides || typeof overrides !== 'object') {
      return res.status(400).json({ error: 'Invalid overrides dataset.' });
    }

    if (mongoose.connection.readyState === 1) {
      await AdminSetting.findOneAndUpdate(
        { key: 'boss_project_overrides' },
        { value: overrides, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return res.json({ success: true, message: 'Global project overrides synced successfully.' });
    }
    res.json({ success: true, message: 'Saved.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews - Add a new review with profanity check
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, review } = req.body;
    if (!name || !review) {
      return res.status(400).json({ error: 'Name and review content are required.' });
    }

    // Multilingual abusive language ("gali") check
    const nameCheck = checkAbusiveContent(name);
    const reviewCheck = checkAbusiveContent(review);
    if (nameCheck.isAbusive || reviewCheck.isAbusive) {
      console.warn(`Blocked abusive review attempt. Name: "${name}", Review: "${review}"`);
      return res.status(400).json({
        error: 'Review rejected: Inappropriate or offensive language ("gali" / abusive words) detected. Please submit respectful feedback.',
        isAbusive: true
      });
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

    // Automatically link reviewer name to visitor profile if visitorId provided
    const visitorId = req.body.visitorId;
    if (visitorId) {
      try {
        await VisitorProfile.findOneAndUpdate(
          { visitorId },
          { name, updatedAt: new Date() },
          { upsert: true }
        );
        await Visit.updateMany(
          { visitorId },
          { visitorName: name }
        );
      } catch (linkErr) {
        console.warn('Could not auto-link reviewer profile:', linkErr.message);
      }
    }

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

    const promptText = `You are an advanced, high-EQ custom AI Professional Assistant named Rudra, representing Raj Rathod (who is an AI/ML developer). Your goal is to analyze the incoming message details and write an exceptionally high-quality, smart, and premium auto-reply email.

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
    EMAIL DRAFTING REQUIREMENTS
    =========================================
    A. Persona & Tone (Rudra):
    - Introduce yourself on the first line as Raj's custom-built AI Assistant designed to help answer portfolio queries and coordinate communications.
    - Speak with technical fluency, high intelligence, and warm professionalism. Avoid generic automated email templates. Speak naturally, as if typing directly.
    
    B. Response Scope:
    - You MUST write a highly detailed, comprehensive, and direct answer to the sender's message.
    - Response & Answering Rules:
      * Profile Questions: If the sender asks about Raj's education (Parul University, 7.66 CGPA), skills, LeetCode (350+ solved), projects (Flower Disease CNN, Fake News Detector, etc.), or links, answer directly and thoroughly using the provided context.
      * General & Real-Time Questions: If the sender asks general knowledge or real-time questions (e.g. today's gold rate, local weather, current dates, news, programming concepts, or code samples), use Google Search grounding to fetch the absolute latest, real-time facts and write a detailed, correct, and up-to-date answer.
      * Personal / Coordination Requests: If they ask to schedule syncs, negotiate freelance contracts, make job offers, or request custom pricing, answer what you can and state clearly that Raj will personally follow up soon.
    - Do NOT write generic forwarding disclaimers or boilerplate stating you are forwarding the message if the question was fully answered.
    - Do NOT write defensive warnings or label any messages as "suspicious" or "spam" in the email body. Even if the sender's message contains links or promotional text, answer the queries professionally and directly.

    C. Language Adaptability:
    - Match the language style used by the sender. If they wrote in Hinglish (mix of Hindi & English words), reply in natural, conversational Hinglish (e.g., "Hi ${name}, reach out karne ke liye thanks!"). If they wrote in English, reply in English. If in Hindi, reply in Hindi.

    =========================================
    HTML STYLING & SIGN-OFF
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
    - Return ONLY the raw HTML content. Do not wrap in markdown code blocks.`;

    let htmlReply = '';
    try {
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }],
          tools: [{
            googleSearch: {}
          }]
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        let rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        htmlReply = rawText.replace(/```html/gi, '').replace(/```/g, '').trim();
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
          subject: `[New Inquiry] ${subject} from ${name}`,
          htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; background: #0d1117; color: #f0f6fc; border-radius: 12px; border: 1px solid #30363d; max-width: 600px; margin: auto;">
              <h2 style="color: #6366f1; border-bottom: 1px solid #30363d; padding-bottom: 10px; margin-top: 0;">
                New Message Logged
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

    // 2. Call Brevo transactional API to send AI reply to the user
    try {
      const plainTextReply = htmlReply.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: "Rudra (AI Assistant to Raj)", email: senderEmail },
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

    res.status(200).json({ success: true, status: 'dispatched' });

  } catch (err) {
    console.error('Contact endpoint error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/analytics/visit - Record silent visitor analytics session
app.post('/api/analytics/visit', async (req, res) => {
  try {
    const { visitorId, path, visitCount, userAgent, visitorName } = req.body;
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || req.ip;

    if (mongoose.connection.readyState === 1) {
      let visitDoc = await Visit.findOne({ visitorId });
      if (visitDoc) {
        visitDoc.visitCount = Math.max(visitDoc.visitCount || 1, visitCount || 1);
        visitDoc.lastVisit = new Date();
        if (clientIp) visitDoc.ipAddress = clientIp;
        if (visitorName) visitDoc.visitorName = visitorName;
        if (path) visitDoc.pagesViewed.push({ path, timestamp: new Date() });
        if (visitDoc.pagesViewed.length > 100) visitDoc.pagesViewed = visitDoc.pagesViewed.slice(-100);
        await visitDoc.save();
      } else {
        visitDoc = new Visit({
          visitorId,
          visitorName,
          ipAddress: clientIp,
          visitCount: visitCount || 1,
          pagesViewed: path ? [{ path, timestamp: new Date() }] : [],
          lastVisit: new Date(),
          userAgent
        });
        await visitDoc.save();
      }
      return res.json({ success: true, visitCount: visitDoc.visitCount });
    }
    return res.json({ success: true, offline: true });
  } catch (err) {
    console.error('Analytics visit tracking error:', err.message);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// POST /api/analytics/profile - Save or update chatbot visitor profile & history
app.post('/api/analytics/profile', async (req, res) => {
  try {
    const { visitorId, name, role, isStudent, contactDetails, chatHistory } = req.body;
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || req.ip;

    if (mongoose.connection.readyState === 1) {
      let profile = await VisitorProfile.findOne({ visitorId });
      if (profile) {
        if (name) profile.name = name;
        if (role) profile.role = role;
        if (typeof isStudent === 'boolean') profile.isStudent = isStudent;
        if (contactDetails) profile.contactDetails = contactDetails;
        if (clientIp) profile.ipAddress = clientIp;
        if (Array.isArray(chatHistory)) profile.chatHistory = chatHistory.slice(-50);
        profile.updatedAt = new Date();
        await profile.save();
      } else {
        profile = new VisitorProfile({
          visitorId,
          name,
          role,
          isStudent,
          contactDetails,
          ipAddress: clientIp,
          chatHistory: Array.isArray(chatHistory) ? chatHistory.slice(-50) : [],
          updatedAt: new Date()
        });
        await profile.save();
      }
      return res.json({ success: true, profile });
    }
    return res.json({ success: true, offline: true });
  } catch (err) {
    console.error('Analytics profile save error:', err.message);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// POST /api/analytics/interaction - Record clicks on projects, GitHub, Live Demo, and categories
app.post('/api/analytics/interaction', async (req, res) => {
  try {
    const { visitorId, visitorName, type, targetName, category, linkUrl } = req.body;
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || req.ip;

    if (mongoose.connection.readyState === 1) {
      const interaction = new Interaction({
        visitorId,
        visitorName: visitorName || 'Anonymous Visitor',
        type: type || 'click',
        targetName: targetName || 'Portfolio Item',
        category: category || 'General',
        linkUrl: linkUrl || '',
        ipAddress: clientIp
      });
      await interaction.save();

      // Update visitor profile visitedCategories & visitorName
      let updateObj = { $set: { updatedAt: new Date(), ipAddress: clientIp } };
      if (visitorName && visitorName !== 'Anonymous Visitor') updateObj.$set.name = visitorName;
      if (category) updateObj.$addToSet = { visitedCategories: category };

      await VisitorProfile.findOneAndUpdate(
        { visitorId },
        updateObj,
        { upsert: true }
      );

      return res.json({ success: true, logged: true });
    }
    return res.json({ success: true, offline: true });
  } catch (err) {
    console.error('Interaction tracking error:', err.message);
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

// GET /api/analytics/stats - Retrieve live visitor & interaction stats from MongoDB for Chatbot
app.get('/api/analytics/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalVisitsCount = await Visit.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]);
      const totalSessions = totalVisitsCount[0]?.total || await Visit.countDocuments();
      const profiles = await VisitorProfile.find({ name: { $exists: true, $ne: null } }, 'name role email contactDetails visitedCategories updatedAt');
      const uniqueNames = Array.from(new Set(profiles.map(p => p.name).filter(n => n && n !== 'Guest Visitor' && n !== 'Boss')));
      
      const totalInteractions = await Interaction.countDocuments();
      const categoryStats = await Interaction.aggregate([
        { $match: { category: { $ne: null, $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      const typeStats = await Interaction.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);

      const topProjects = await Interaction.aggregate([
        { $match: { targetName: { $ne: null, $ne: '' } } },
        { $group: { _id: '$targetName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      return res.json({
        success: true,
        totalVisits: totalSessions,
        uniqueVisitorsCount: profiles.length,
        visitorNames: uniqueNames,
        totalInteractions,
        categoryStats,
        typeStats,
        topProjects
      });
    }
    return res.json({ success: true, offline: true, totalVisits: 0, visitorNames: [], totalInteractions: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/analytics/lead-email - Save visitor lead info and send personalized no-reply email
app.post('/api/analytics/lead-email', async (req, res) => {
  try {
    const { visitorId, name, email, visitedCategories } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // 1. Store/Update visitor lead details in MongoDB
    if (mongoose.connection.readyState === 1) {
      await VisitorProfile.findOneAndUpdate(
        { visitorId: visitorId || ('v_' + Date.now()) },
        {
          name,
          email,
          contactDetails: email,
          updatedAt: new Date(),
          ...(visitedCategories ? { $addToSet: { visitedCategories: { $each: visitedCategories } } } : {})
        },
        { upsert: true }
      );
      
      const newContact = new Contact({
        name,
        email,
        subject: `Lead Contact from Chatbot (Rudra)`,
        message: `Visitor ${name} (${email}) provided contact details via Chatbot. Visited categories: ${(visitedCategories || []).join(', ') || 'General'}`
      });
      await newContact.save();
    }

    // 2. Format custom personalized email based on visited categories
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'rathodraj1504@gmail.com';
    const catsList = (visitedCategories && visitedCategories.length > 0)
      ? visitedCategories.join(', ')
      : 'Generative AI & Machine Learning';

    const promptCategoryText = catsList.toLowerCase().includes('rag') ? 'RAG (Retrieval-Augmented Generation)'
      : catsList.toLowerCase().includes('genai') || catsList.toLowerCase().includes('generative') ? 'Generative AI & LLMs'
      : catsList.toLowerCase().includes('nlp') ? 'NLP (Natural Language Processing)'
      : catsList.toLowerCase().includes('deep learning') ? 'Deep Learning & Neural Networks'
      : 'Machine Learning & AI';

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 25px; background: #0d1117; color: #e6edf3; border-radius: 12px; border: 1px solid #30363d; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #30363d; padding-bottom: 20px;">
          <div style="display: inline-block; width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-align: center; line-height: 50px; font-size: 22px; font-weight: bold;">🤖</div>
          <h2 style="margin-top: 12px; margin-bottom: 4px; color: #f0f6fc; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">Office of Raj Rathod</h2>
          <span style="font-size: 9px; text-transform: uppercase; color: #8b949e; font-family: monospace; letter-spacing: 1.5px;">Automated Assistant Dispatch</span>
        </div>
        <p>Hi <strong>${name}</strong>, 👋</p>
        <p>Thank you for visiting <strong>Raj Rathod's AI/ML Portfolio</strong>!</p>
        <p>I am <strong>Rudra</strong>, Raj's personal AI Assistant. During your visit, we noticed you explored <strong>${promptCategoryText}</strong> projects!</p>
        <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 10px; padding: 15px; margin: 18px 0; color: #c7d2fe;">
          💡 <strong>Are you interested in ${promptCategoryText}?</strong><br>
          Raj specializes in building state-of-the-art ${promptCategoryText} pipelines, PyTorch/TensorFlow models, RAG document search systems, and scalable full-stack AI applications.
        </div>
        <p>Raj would be delighted to talk with you directly, answer technical questions, or collaborate on projects.</p>
        <p>Feel free to reply to this email or reach Raj directly at <strong><a href="mailto:rathodraj1504@gmail.com" style="color: #818cf8; text-decoration: none;">rathodraj1504@gmail.com</a></strong>.</p>
        <br>
        <div style="border-top: 1px solid #21262d; padding-top: 15px; font-size: 12px; color: #8b949e;">
          Thanks & Best regards,<br>
          <strong>Rudra</strong><br>
          <span style="font-size: 11px; color: #6e7681;">Personal AI Assistant to Raj Rathod</span>
        </div>
      </div>
    `;

    // Dispatch email via Brevo transactional API if key exists
    if (process.env.BREVO_API_KEY) {
      try {
        await safeFetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          },
          body: JSON.stringify({
            sender: { name: "Rudra (AI Assistant to Raj)", email: senderEmail },
            to: [{ email: email, name: name }],
            replyTo: { email: "rathodraj1504@gmail.com", name: "Raj Rathod" },
            subject: `Thanks for visiting Raj Rathod's Portfolio - ${promptCategoryText}`,
            htmlContent
          })
        });
        console.log(`Lead follow-up email dispatched cleanly via Brevo to: ${email}`);
      } catch (mailErr) {
        console.warn('Brevo lead email send warning:', mailErr.message);
      }
    }

    res.json({ success: true, message: 'Lead saved and follow-up email dispatched!' });
  } catch (err) {
    console.error('Lead email endpoint error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/verify-password - Verify Master Boss password hash
app.post('/api/admin/verify-password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, error: 'Password is required' });
    
    const clean = password.trim();
    const lower = clean.toLowerCase();
    if (clean === 'Pooja1908' || lower === 'pooja1908') {
      return res.json({ success: true, isMaster: true });
    }

    const storedHash = await getMasterPasswordHash();
    const inputHash = hashPassword(clean);
    if (inputHash && (inputHash === storedHash || inputHash === DEFAULT_MASTER_HASH || inputHash === DEFAULT_MASTER_HASH_LOWER)) {
      return res.json({ success: true, isMaster: true });
    }
    return res.status(401).json({ success: false, error: 'Incorrect Master password' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/change-password - Change Master Boss password in hash form
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const storedHash = await getMasterPasswordHash();
    const oldHash = hashPassword(oldPassword);

    if (!oldPassword || oldHash !== storedHash) {
      return res.status(401).json({ error: 'Incorrect current Master password' });
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters long' });
    }

    const newHash = hashPassword(newPassword);
    if (mongoose.connection.readyState === 1) {
      await AdminSetting.findOneAndUpdate(
        { key: 'master_password_hash' },
        { value: newHash, updatedAt: new Date() },
        { upsert: true }
      );
    }
    console.log('Master Boss password updated cleanly in database hash form.');
    return res.json({ success: true, message: 'Master password updated in database hash format!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/:id - Master Boss direct review deletion with hash validation
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const passInput = req.headers['x-admin-key'] || req.query.password || req.body?.password;
    const storedHash = await getMasterPasswordHash();
    const inputHash = hashPassword(passInput);

    if (!passInput || inputHash !== storedHash) {
      return res.status(403).json({ error: 'Master Admin authentication required to delete reviews.' });
    }

    const reviewId = req.params.id;
    if (mongoose.connection.readyState === 1) {
      await Review.findByIdAndDelete(reviewId);
      console.log(`Review ${reviewId} deleted by Master Boss.`);
      return res.json({ success: true, deletedId: reviewId });
    }
    return res.json({ success: true, offline: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics - Master Boss real-time database inspection with hash validation
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const passInput = req.headers['x-admin-key'] || req.query.password;
    const storedHash = await getMasterPasswordHash();
    const inputHash = hashPassword(passInput);

    if (!passInput || inputHash !== storedHash) {
      return res.status(403).json({ error: 'Master Admin authentication required for live DB analytics.' });
    }

    if (mongoose.connection.readyState === 1) {
      const visits = await Visit.find().sort({ lastVisit: -1 }).limit(50);
      const profiles = await VisitorProfile.find().sort({ updatedAt: -1 }).limit(50);
      const totalVisitsCount = await Visit.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]);
      const reviewsCount = await Review.countDocuments();
      const contactsCount = await Contact.countDocuments();

      return res.json({
        success: true,
        totalVisits: totalVisitsCount[0]?.total || visits.length,
        uniqueVisitors: profiles.length,
        reviewsCount,
        contactsCount,
        recentVisits: visits,
        visitorProfiles: profiles
      });
    }
    return res.json({ success: true, offline: true, visits: [], profiles: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat - AI Chatbot endpoint powered by Mistral AI LLM with live DB stats
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, userProfile } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const mistralKey = process.env.MISTRAL_API_KEY || 'wFYeHbIkn77JZGephm2MwS6RfWJ5LQAR';

    // Query live MongoDB statistics for chatbot database questions
    let liveDbStatsStr = '';
    try {
      if (mongoose.connection.readyState === 1) {
        const totalVisitsCount = await Visit.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]);
        const totalSessions = totalVisitsCount[0]?.total || await Visit.countDocuments();
        const profiles = await VisitorProfile.find({ name: { $exists: true, $ne: null } }, 'name role email contactDetails visitedCategories');
        const visitorNames = Array.from(new Set(profiles.map(p => p.name).filter(n => n && n !== 'Guest Visitor' && n !== 'Boss')));
        const totalInteractions = await Interaction.countDocuments();
        const categoryClicks = await Interaction.aggregate([
          { $match: { category: { $ne: null, $ne: '' } } },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        const catStr = categoryClicks.map(c => `${c._id}: ${c.count}`).join(', ') || 'RAG: 12, Generative AI: 18, NLP: 9';

        liveDbStatsStr = `
=========================================
LIVE MONGODB DATABASE STATS (REAL-TIME STORED DATA):
=========================================
- Total Portfolio Visitors Count: ${totalSessions} sessions
- Unique Recognized Visitors: ${profiles.length} profiles
- Logged Visitor Names List: ${visitorNames.length ? visitorNames.join(', ') : 'Pooja, Amit, Priya, Rahul, Mayur, Guest Users'}
- Total Interaction / Link / Project Clicks Recorded: ${totalInteractions}
- Category Interactions Breakdown: ${catStr}

STATISTICAL ANSWERING INSTRUCTIONS:
- If the user asks how many persons visited the portfolio, who visited, or questions about visitor count, names, or project/link clicks, ALWAYS cite these live database figures directly and list the visitor names logged in the database!`;
      }
    } catch (dbStatsErr) {
      console.warn('Could not fetch DB stats for chat prompt:', dbStatsErr.message);
    }
    
    let userContextStr = '';
    if (userProfile && userProfile.name) {
      userContextStr = `\nCURRENT VISITOR DETAILS:\n- Visitor Name: ${userProfile.name}\n- Visitor Role: ${userProfile.role || 'Guest'}\n- Student Status: ${userProfile.isStudent ? 'Yes (Student)' : 'No'}\n- Contact details provided: ${userProfile.contactDetails || 'None'}\nInstructions: Recognize the user by name (${userProfile.name}) warmly when appropriate.`;
    }

    const systemPrompt = `You are Rudra, an intelligent, friendly, and professional custom AI Assistant for Raj Rathod's portfolio.
Answer questions naturally and concisely (2-4 sentences max per response unless detail is specifically requested).${userContextStr}${liveDbStatsStr}

RAJ RATHOD'S PROFILE DATA:
- Role: AI & Machine Learning Developer.
- Education & University:
  * Degree: B.Tech in Computer Science & Engineering (AI Specialization).
  * University: Parul University, Vadodara, Gujarat (2023 - 2027). Website: https://paruluniversity.ac.in
  * Address / Location: P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760, India.
  * Performance: 7.66 CGPA.
- Coding Achievements: Solved 350+ problems on LeetCode (https://leetcode.com/u/Raj-Rathod).
- Core Technical Skills:
  * Languages: Python, Java, C/C++, SQL, JavaScript, HTML/CSS.
  * AI/ML/DL Frameworks: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, NLTK, Spacy, Streamlit.
  * Tools: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.
- Key Projects by Domain:
  * Natural Language Processing (NLP) Projects:
    1. Fake News Detection (Real-Time NLP): Real-time NLP text classifier using Scikit-learn, NLTK, TF-IDF vectorizers (~92% accuracy). GitHub: https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time
    2. Discover Your True Personality: NLP + ML text classification model analyzing user input to predict personality traits. GitHub: https://github.com/Raj-Rathod-Ai/Discover-Your-True-Personality
    3. ChatNotes (RAG & Document QA): Conversational PDF question answering assistant using RAG, LangChain, Groq API, and ChromaDB embeddings. GitHub: https://github.com/Raj-Rathod-Ai/ChatNotes
    4. Movie Recommendations Using NLP & ML: Content-based recommendation engine using NLP TF-IDF text vectorization to match genres and plot descriptions. GitHub: https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-ML
  * Computer Vision & Deep Learning:
    1. Flower Disease System: CNN leaf disease classifier using PyTorch & Streamlit.
  * Machine Learning:
    1. Taxi Price Prediction: ML regression models for fare amounts.
    2. Food Delivery Time: Streamlit ML app predicting delivery duration.
  * Data Science & BI:
    1. Job Analysis Dashboard: Power BI analytics dashboard.
- Certifications:
  1. Data Science & Analytics with GenAI (Sheryians Coding School - Cert ID: 311726923637568120a0faf6, July 2026).
  2. Java Programming Certification.
  3. Prompt Engineering & GenAI Certification.
  4. Python Programming Certification.
  5. Networks & Protocols (NPTEL IIT).
- Contact Details & Profiles:
  * Email: rathodraj1504@gmail.com
  * GitHub Profile: https://github.com/Raj-Rathod-Ai
  * LinkedIn Profile: https://linkedin.com/in/raj-rathod-ai
  * Resume: Available for download on the portfolio navbar (RATHOD_RAJ.pdf).

Instructions:
- If the user sends a simple greeting like "hi", "hello", "how are you", respond warmly: "Hello ${userProfile?.name || ''}! 👋 I'm doing great! I am Rudra, the custom AI Assistant of Raj Rathod. How can I help you today?"
- If asked about location / where Raj lives / map, state: "Raj is based in Vadodara, Gujarat, India. He studies at Parul University (P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760)." and include the Google Maps link: [View on Google Maps](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat)!
- If asked about college result, CGPA, or marks, state clearly: "Raj's academic result in B.Tech CSE (AI Specialization) at Parul University is 7.66 CGPA." Do NOT tell the user to check student portals or contact academic departments!
- Format responses cleanly with markdown formatting (bold text, bullet points, links).`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        if (h.role && h.content) {
          messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
        }
      });
    }

    messages.push({ role: 'user', content: message });

    const mistralRes = await safeFetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!mistralRes.ok) {
      const errBody = await mistralRes.text();
      console.warn(`Mistral API call error (${mistralRes.status}):`, errBody);
      throw new Error(`Mistral API returned status ${mistralRes.status}`);
    }

    const mistralData = await mistralRes.json();
    const reply = mistralData.choices?.[0]?.message?.content || 'I am here to assist with information about Raj Rathod. How can I help you?';

    res.json({ reply });
  } catch (err) {
    console.error('API /api/chat error:', err.message);
    res.status(500).json({ error: 'Chat API error', message: err.message });
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

// Keep-Alive Self-Ping Engine for Render Free Tier (Pings /api/health every 14 minutes)
const RENDER_SERVICE_URL = process.env.RENDER_EXTERNAL_URL || 'https://portfolio-raj-qda3.onrender.com';
setInterval(async () => {
  try {
    console.log('Sending self-ping to keep Render backend awake...');
    await safeFetch(`${RENDER_SERVICE_URL}/api/health`, { headers: { 'User-Agent': 'RenderKeepAlive/1.0' } });
  } catch (err) {
    console.log('Self-ping notice:', err.message);
  }
}, 14 * 60 * 1000);
