require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize, Quiz, QuizQuestion } = require('./src/models');

const seedQuizData = async () => {
  try {
    console.log('Connecting to database...');
    // We don't use force: true here, because we just want to add quizzes, not drop everything
    await sequelize.sync(); 
    
    console.log('Reading Quizdata.json...');
    const rawData = fs.readFileSync(path.join(__dirname, 'Quizdata.json'), 'utf8');
    const quizData = JSON.parse(rawData);

    // Create Basic Quiz
    let basicQuiz = await Quiz.findOne({ where: { title: 'Basic Anatomy Quiz' } });
    if (!basicQuiz) {
      basicQuiz = await Quiz.create({
        title: 'Basic Anatomy Quiz',
        description: 'A comprehensive quiz covering the basics of human anatomy.',
        category: 'General',
        difficulty: 'Basic',
        xp_reward: 100,
      });
      console.log('Created Basic Anatomy Quiz');
    }

    // Create Advance Quiz
    let advanceQuiz = await Quiz.findOne({ where: { title: 'Advanced Anatomy Quiz' } });
    if (!advanceQuiz) {
      advanceQuiz = await Quiz.create({
        title: 'Advanced Anatomy Quiz',
        description: 'An advanced quiz for deep anatomical knowledge.',
        category: 'General',
        difficulty: 'Advanced',
        xp_reward: 200,
      });
      console.log('Created Advanced Anatomy Quiz');
    }

    console.log('Inserting Quiz Questions...');
    const questionsToInsert = [];

    // Parse basic questions
    if (quizData.basic) {
      for (const [systemName, questions] of Object.entries(quizData.basic)) {
        for (const q of questions) {
          questionsToInsert.push({
            quiz_id: basicQuiz.id,
            system_name: systemName,
            question_text: q.question,
            options: q.options.map(opt => ({ text: opt, is_correct: opt === q.answer })),
            explanation: q.explanation,
          });
        }
      }
    }

    // Parse advance questions
    if (quizData.advance) {
      for (const [systemName, questions] of Object.entries(quizData.advance)) {
        for (const q of questions) {
          questionsToInsert.push({
            quiz_id: advanceQuiz.id,
            system_name: systemName,
            question_text: q.question,
            options: q.options.map(opt => ({ text: opt, is_correct: opt === q.answer })),
            explanation: q.explanation,
          });
        }
      }
    }

    // Insert all
    if (questionsToInsert.length > 0) {
      // Clear old questions for these quizzes to prevent duplicates
      await QuizQuestion.destroy({ where: { quiz_id: [basicQuiz.id, advanceQuiz.id] } });
      await QuizQuestion.bulkCreate(questionsToInsert);
      console.log(`Successfully inserted ${questionsToInsert.length} questions!`);
    }

    console.log('Quiz seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quiz data:', error);
    process.exit(1);
  }
};

seedQuizData();
