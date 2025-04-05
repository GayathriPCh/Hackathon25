import Groq from "groq-sdk";

// WARNING: In production, you should NOT expose your API key in the frontend.
// Instead, create a backend API endpoint that makes the Groq API calls.
const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true // Only for development/demo purposes
});

export async function generateInterviewQuestions(skills, experience) {
  const prompt = `
    Generate a set of multiple-choice technical interview questions for a candidate with the following skills: ${skills.join(', ')}.
    Their experience level is: ${experience} years.
    
    Requirements:
    1. Generate exactly 2 MCQ questions for each skill listed
    2. Questions should be appropriate for their experience level
    3. Questions should be practical and test real knowledge
    4. Each question should have exactly 4 options (A, B, C, D)
    5. Return the questions in a JSON array format with the following structure:
    [
      {
        "skill": "skill name",
        "question": "the question text",
        "type": "mcq",
        "options": {
          "A": "first option",
          "B": "second option",
          "C": "third option",
          "D": "fourth option"
        },
        "correctAnswer": "A/B/C/D",
        "explanation": "Brief explanation of why this is the correct answer"
      }
    ]
    
    Make sure:
    - Questions are challenging but fair
    - Only one option is correct
    - Options are realistic and plausible
    - Explanations are concise but informative
    
    Only return the JSON array, no other text.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
    });

    const response = chatCompletion.choices[0]?.message?.content || "[]";
    try {
      return JSON.parse(response);
    } catch {
      console.error('Failed to parse Groq response as JSON:', response);
      return getDefaultQuestions();
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return getDefaultQuestions();
  }
}

function getDefaultQuestions() {
  return [
    {
      skill: "general",
      question: "Which of the following best describes the purpose of version control systems?",
      type: "mcq",
      options: {
        A: "To track changes in code and collaborate with others",
        B: "To compile code faster",
        C: "To automatically fix bugs",
        D: "To deploy applications"
      },
      correctAnswer: "A",
      explanation: "Version control systems are primarily used for tracking changes and enabling collaboration."
    },
    {
      skill: "general",
      question: "What is the best practice for handling sensitive data in applications?",
      type: "mcq",
      options: {
        A: "Store it directly in the code",
        B: "Use environment variables and secure storage",
        C: "Print it to console logs",
        D: "Share it in public repositories"
      },
      correctAnswer: "B",
      explanation: "Sensitive data should always be stored securely using environment variables or secure storage solutions."
    },
    {
      skill: "general",
      question: "Which approach is most effective for debugging complex issues?",
      type: "mcq",
      options: {
        A: "Randomly changing code until it works",
        B: "Ignoring error messages",
        C: "Systematic testing and logging",
        D: "Restarting the computer"
      },
      correctAnswer: "C",
      explanation: "Systematic testing and proper logging are essential for effective debugging."
    }
  ];
} 