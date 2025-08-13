export interface GoalCategory {
  name: string;
  description: string;
  prompts: string[];
  examples: string[];
}

export const goalTemplate: GoalCategory[] = [
  {
    name: "Money & Financial Abundance",
    description: "Manifest financial prosperity, abundance, and smart money management",
    prompts: [
      "What is your ideal monthly income?",
      "How do you want to feel about money?",
      "What financial freedom means to you?",
      "What investments or savings goals do you have?",
      "How do you want to earn this money (salary, business, investments)?",
      "What would you do with unlimited financial resources?",
      "What limiting beliefs about money do you want to release?"
    ],
    examples: [
      "I earn $10,000 per month doing work I love",
      "I have 6 months of expenses saved in my emergency fund",
      "I invest wisely and my money grows consistently",
      "I feel abundant and grateful for the money that flows to me",
      "I make smart financial decisions with confidence",
      "I am debt-free and financially independent",
      "Money comes to me easily and frequently"
    ]
  },
  {
    name: "Love & Connections",
    description: "Attract meaningful relationships, deep connections, and authentic love",
    prompts: [
      "What qualities do you want in a romantic partner?",
      "How do you want to feel in your relationships?",
      "What kind of friendships do you desire?",
      "How do you want to show love to others?",
      "What does your ideal family life look like?",
      "How do you want to be loved and appreciated?",
      "What social connections would enrich your life?"
    ],
    examples: [
      "I am in a loving, supportive, and committed relationship",
      "I attract genuine friendships with like-minded people",
      "I communicate openly and honestly with those I love",
      "I am surrounded by people who appreciate and value me",
      "I give and receive love freely and authentically",
      "My family relationships are harmonious and loving",
      "I attract my soulmate who shares my values and dreams"
    ]
  },
  {
    name: "Health & Vitality",
    description: "Manifest optimal physical health, mental wellness, and vibrant energy",
    prompts: [
      "How do you want to feel in your body?",
      "What does optimal health look like for you?",
      "What healthy habits do you want to maintain?",
      "How do you want to move and exercise?",
      "What does mental and emotional wellness mean to you?",
      "How do you want to nourish your body?",
      "What energy level do you desire throughout the day?"
    ],
    examples: [
      "I have abundant energy and vitality every day",
      "My body is strong, flexible, and healthy",
      "I maintain my ideal weight effortlessly",
      "I sleep deeply and wake up refreshed",
      "I make healthy food choices that nourish my body",
      "I exercise regularly and enjoy being active",
      "My mind is clear, focused, and peaceful"
    ]
  },
  {
    name: "Work & Career",
    description: "Create fulfilling work, career success, and professional growth",
    prompts: [
      "What is your dream job or career?",
      "How do you want to feel about your work?",
      "What impact do you want to make through your work?",
      "What skills do you want to develop?",
      "What kind of work environment do you thrive in?",
      "How do you want to be recognized professionally?",
      "What does work-life balance look like for you?"
    ],
    examples: [
      "I work in a job that aligns with my passions and values",
      "I am recognized and rewarded for my contributions",
      "I have a perfect work-life balance",
      "I work with inspiring and supportive colleagues",
      "I continuously grow and learn in my career",
      "My work makes a positive impact on others",
      "I am a leader in my field and inspire others"
    ]
  },
  {
    name: "Logistics & Lifestyle",
    description: "Organize your living situation, travel dreams, and practical life management",
    prompts: [
      "Where do you want to live? (City, country, type of home)",
      "How do you want your living space to feel?",
      "What places do you want to travel to?",
      "How do you want to manage your time and schedule?",
      "What does your ideal daily routine look like?",
      "How do you want to handle practical matters (taxes, admin, etc.)?",
      "What possessions or experiences do you want in your life?"
    ],
    examples: [
      "I live in a beautiful, peaceful home that reflects my style",
      "I travel to amazing destinations and have incredible experiences",
      "My living space is organized, clean, and inspiring",
      "I handle all administrative tasks efficiently and on time",
      "I have a reliable car that gets me where I need to go",
      "My taxes and finances are organized and managed well",
      "I live in my ideal location surrounded by nature/city life"
    ]
  }
];

export const manifestationPrompts = [
  "I am grateful for...",
  "I easily attract...",
  "I deserve to have...",
  "I am becoming someone who...",
  "I trust that the universe is bringing me...",
  "I feel excited about...",
  "I am open to receiving...",
  "I celebrate having...",
  "I am aligned with...",
  "I joyfully experience..."
];

export const visualizationQuestions = [
  "What do you see when you have achieved this goal?",
  "How does it feel to have this in your life?",
  "What sounds do you hear in this reality?",
  "Who is celebrating with you?",
  "What are you wearing or how do you present yourself?",
  "What is your environment like?",
  "What emotions are you experiencing?",
  "What actions are you taking in this reality?",
  "How has achieving this goal changed you?",
  "What are you most grateful for in this vision?"
];

export function generateGoalWorksheet(categories: string[] = []) {
  const selectedCategories = categories.length > 0 
    ? goalTemplate.filter(cat => categories.includes(cat.name))
    : goalTemplate;

  return {
    title: "Manifestation Goal Setting Worksheet",
    instructions: "Take time to thoughtfully answer the prompts in each category. Be specific, positive, and write in present tense as if your goals have already been achieved.",
    categories: selectedCategories,
    manifestationPrompts,
    visualizationQuestions,
    affirmationTemplate: "I am grateful that I now have/am [your goal]. I feel [emotion] knowing that [specific detail]. I trust that this or something better is manifesting in my life now."
  };
}
