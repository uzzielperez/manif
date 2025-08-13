import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goalTemplate, manifestationPrompts, visualizationQuestions, type GoalCategory } from '../data/goalTemplate';
import { Download, Target, Heart, DollarSign, Briefcase, Home, Plus, Minus, Lock, Star } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

const categoryIcons = {
  "Money & Financial Abundance": DollarSign,
  "Love & Connections": Heart,
  "Health & Vitality": Target,
  "Work & Career": Briefcase,
  "Logistics & Lifestyle": Home,
};

const GoalTemplate: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [userGoals, setUserGoals] = useState<Record<string, Record<string, string>>>({});
  const { hasAccess } = usePayment();

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const updateGoal = (category: string, promptIndex: number, value: string) => {
    setUserGoals(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [promptIndex]: value
      }
    }));
  };

  const downloadGoals = () => {
    let content = "MY MANIFESTATION GOALS\n";
    content += "========================\n\n";

    goalTemplate.forEach(category => {
      content += `${category.name.toUpperCase()}\n`;
      content += "-".repeat(category.name.length) + "\n\n";
      
      category.prompts.forEach((prompt, index) => {
        content += `${prompt}\n`;
        const answer = userGoals[category.name]?.[index] || "";
        content += `Answer: ${answer}\n\n`;
      });

      content += "Example Affirmations:\n";
      category.examples.forEach(example => {
        content += `• ${example}\n`;
      });
      content += "\n" + "=".repeat(50) + "\n\n";
    });

    content += "MANIFESTATION PROMPTS\n";
    content += "=====================\n";
    manifestationPrompts.forEach(prompt => {
      content += `• ${prompt}\n`;
    });

    content += "\nVISUALIZATION QUESTIONS\n";
    content += "=======================\n";
    visualizationQuestions.forEach(question => {
      content += `• ${question}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-manifestation-goals.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Paywall component for non-paying users
  if (!hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-4xl mx-auto pb-10 text-white"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Premium Goal Template</h1>
          <p className="text-xl text-white/80 mb-8">
            Unlock your comprehensive manifestation goal template
          </p>

          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
              <Star className="text-yellow-400" size={24} />
              What's Included
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <DollarSign className="text-green-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Money & Financial Goals</h3>
                    <p className="text-white/70 text-sm">Income, investments, financial freedom</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="text-pink-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Love & Relationships</h3>
                    <p className="text-white/70 text-sm">Romance, friendships, family connections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="text-blue-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Health & Vitality</h3>
                    <p className="text-white/70 text-sm">Physical wellness, mental clarity, energy</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="text-purple-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Career & Work</h3>
                    <p className="text-white/70 text-sm">Dream job, professional growth, purpose</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="text-orange-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Lifestyle & Logistics</h3>
                    <p className="text-white/70 text-sm">Living situation, travel, daily life</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="text-cyan-400 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Downloadable Worksheet</h3>
                    <p className="text-white/70 text-sm">Save and track your progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-white/70 mb-6">
              <p className="text-lg">✨ 35+ guided prompts across 5 life areas</p>
              <p className="text-lg">✨ Example affirmations for each category</p>
              <p className="text-lg">✨ Visualization questions for meditation</p>
              <p className="text-lg">✨ Downloadable goal worksheet</p>
            </div>

            <Link
              to="/program"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-lg"
            >
              <Star size={20} />
              Get Access for €19
            </Link>
            
            <p className="text-white/60 text-sm mt-4">
              One-time payment • Lifetime access • Complete manifestation guide included
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto pb-10 text-white"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Manifestation Goal Template</h1>
          <p className="text-xl text-white/80 mb-6">
            Create clear, specific goals across all areas of your life
          </p>
          <button
            onClick={downloadGoals}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
          >
            <Download size={20} />
            Download My Goals
          </button>
        </div>

        <div className="space-y-6">
          {goalTemplate.map((category, categoryIndex) => {
            const isExpanded = expandedCategories.includes(category.name);
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Target;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-white/5 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{category.name}</h2>
                      <p className="text-white/70">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-white/50">
                    {isExpanded ? <Minus size={24} /> : <Plus size={24} />}
                  </div>
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-indigo-300">
                          Reflection Prompts
                        </h3>
                        <div className="space-y-4">
                          {category.prompts.map((prompt, promptIndex) => (
                            <div key={promptIndex} className="space-y-2">
                              <label className="block text-white/90 font-medium">
                                {prompt}
                              </label>
                              <textarea
                                value={userGoals[category.name]?.[promptIndex] || ''}
                                onChange={(e) => updateGoal(category.name, promptIndex, e.target.value)}
                                placeholder="Write your goal here..."
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                rows={3}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-300">
                          Example Affirmations
                        </h3>
                        <div className="bg-white/5 rounded-lg p-4">
                          <ul className="space-y-2">
                            {category.examples.map((example, index) => (
                              <li key={index} className="text-white/80 flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">
              Manifestation Prompts
            </h3>
            <p className="text-white/70 mb-4 text-sm">
              Use these sentence starters to create powerful affirmations:
            </p>
            <ul className="space-y-2">
              {manifestationPrompts.map((prompt, index) => (
                <li key={index} className="text-white/80 flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">
              Visualization Questions
            </h3>
            <p className="text-white/70 mb-4 text-sm">
              Ask yourself these questions during meditation:
            </p>
            <ul className="space-y-2">
              {visualizationQuestions.slice(0, 6).map((question, index) => (
                <li key={index} className="text-white/80 flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-3">Pro Tip</h3>
          <p className="text-white/80">
            Write your goals in present tense as if they have already happened. 
            Include specific details and focus on how achieving these goals will make you feel. 
            Review and update your goals regularly as you grow and evolve.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalTemplate;
