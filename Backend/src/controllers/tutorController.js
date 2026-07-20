const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Handle AI Tutor chat message
// @route   POST /api/tutor/chat
// @access  Private
const chatWithTutor = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API Key is not configured in .env' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash", 
      systemInstruction: "You are an expert, friendly Biology and Anatomy tutor for the 'BioScope 3D' educational app. You explain complex anatomical concepts clearly, using simple language suitable for medical students and biology enthusiasts. Keep your answers concise, encouraging, and highly educational.",
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Error in AI Tutor:', error);
    res.status(500).json({ message: 'Server error in AI Tutor', details: error.message });
  }
};

module.exports = {
  chatWithTutor
};
