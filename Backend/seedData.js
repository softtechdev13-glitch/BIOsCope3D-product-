require('dotenv').config();
const { sequelize, BodySystem, Organ, Quiz, QuizQuestion } = require('./src/models');

const seedDatabase = async () => {
  try {
    console.log('Syncing database...');
    await sequelize.sync({ force: true }); // Warning: This clears all data, including users. Good for initial seed.
    console.log('Database synced.');

    console.log('Seeding Body Systems...');
    const skeletalSystem = await BodySystem.create({
      name: 'Skeletal System',
      description: 'The internal framework of the human body.',
      icon: '🦴',
      bgColor: '#F5F5F5',
      elementCount: 206,
      sketchfabId: '2f888b3ad214430fb895604437090786',
      thumbnail_url: 'https://media.sketchfab.com/models/2f888b3ad214430fb895604437090786/thumbnails/af005fb970864a2886792a1cd15932cb/a363764d3d7a4131a1b6f750b89914f1.jpeg',
      cameraEye: [0, -2.8, 1],
      cameraTarget: [0, 8, 0]
    });

    const digestiveSystem = await BodySystem.create({
      name: 'Digestive System',
      description: 'Breaks down food into nutrients.',
      icon: '🍎',
      bgColor: '#FFF3E0',
      elementCount: 14,
      sketchfabId: '9ac93a616bce485d98d3ff81ae54a904',
      thumbnail_url: 'https://media.sketchfab.com/models/9ac93a616bce485d98d3ff81ae54a904/thumbnails/ecac0a361f6b48fdb719e2d692539a59/e42a0bae559b4f3bbf3bd97a9f318553.jpeg',
      cameraEye: [0, -200, -50],
      cameraTarget: [0, -10, 0]
    });

    const respiratorySystem = await BodySystem.create({
      name: 'Respiratory System',
      description: 'Facilitates gas exchange with the environment.',
      icon: '🫁',
      bgColor: '#E3F2FD',
      elementCount: 8,
      sketchfabId: 'b8e2de3d64d24becadb3d4f12b2ec567',
      thumbnail_url: 'https://media.sketchfab.com/models/b8e2de3d64d24becadb3d4f12b2ec567/thumbnails/398b7ba8d3874af68f03f63e57621539/d7970003362e4f9daa4208def6b3ac8b.jpeg',
      cameraEye: [0, -200, 180],
      cameraTarget: [0, 0, 0]
    });

    const urinarySystem = await BodySystem.create({
      name: 'Urinary System',
      description: 'Filters blood and creates urine as a waste by-product.',
      icon: '💧',
      bgColor: '#F3E5F5',
      elementCount: 6,
      sketchfabId: '6bd76e32ae2b4bccb810a08d3679e502',
      thumbnail_url: 'https://media.sketchfab.com/models/6bd76e32ae2b4bccb810a08d3679e502/thumbnails/67ae4815cfba40e3bfda01efc5c56b2c/7bcdc80708964dcfa04805aafbde7e38.jpeg',
      cameraEye: [0, -8, 1],
      cameraTarget: [0, 0, 0]
    });

    console.log('Seeding Organs...');
    await Organ.bulkCreate([
      {
        system_id: skeletalSystem.id,
        name: 'Skull',
        key_facts: 'Think of your skull as the ultimate, unbreakable motorcycle helmet that nature built right into your body. While it feels like one giant round bone when you touch your head, it is actually a masterpiece made of 22 different bones fitting perfectly together like a 3D jigsaw puzzle! \n\nFun Fact: When you were a baby, your skull wasn\'t fully closed. It had soft spots called "fontanelles" to allow your fast-growing brain to expand. As you grew older, these bones permanently fused together. Except for your lower jaw (the mandible), which swings up and down like a door on hinges so you can talk, sing, and chew your favorite food, the rest of your skull doesn\'t move at all.',
        functions: '1. The Brain\'s Personal Bodyguard: Your brain is super soft, almost like jelly. If you bump your head, the skull takes the hit so your brain stays safe. \n\n2. The Face Builder: It holds your eyeballs exactly where they need to be to see the world, holds your teeth in place so you can bite, and gives your nose its shape.\n\nReal-World Example: Imagine putting a raw egg inside a hard metal box. If you drop the box, the metal might get scratched, but the egg inside stays perfectly safe. Your skull is that metal box, and your brain is the precious egg.',
        clinical_diseases: '1. Skull Fractures: This is when the "helmet" gets cracked. \n2. Concussions: Even if the skull doesn\'t break, hitting your head really hard can make your brain shake around inside the skull, causing dizziness and headaches.\n\nReal-World Example: If a construction worker drops a brick on a hardhat, the hat might crack (a fracture) but it saves the head. However, if the hit is too strong, the shockwave can still make the person inside feel dizzy (a concussion). This is why doctors say you must always wear a real helmet when riding a bike!',
      },
      {
        system_id: digestiveSystem.id,
        name: 'Stomach',
        key_facts: 'Your stomach is an incredible, stretchy, muscular bag located just under your ribs on the left side of your belly. \n\nWhen it is empty, it is small and squished, about the size of your fist. But it has a superpower: it can stretch! When you eat a huge meal—like a large pizza and a cold drink—it stretches out like a balloon to hold almost a whole gallon of food! Inside, it is lined with a thick layer of slimy mucus. Why? Because your stomach produces an acid so strong that it could literally dissolve a piece of metal! The slime protects the stomach from eating itself.',
        functions: '1. The Storage Tank: It holds onto your food so you don\'t have to eat constantly all day long.\n2. The Blender: Its strong muscular walls squeeze and churn the food (mechanical digestion) while dumping powerful acids and juices on it (chemical digestion).\n\nReal-World Example: Imagine putting chunks of bread, meat, and water into a thick ziplock bag. Now imagine squeezing and mashing that bag with your hands for 2 hours until everything inside turns into a thick soup. That is exactly what your stomach does! It turns your solid meal into a smoothie called "chyme" before sending it to the intestines.',
        clinical_diseases: '1. Gastric Ulcers: Sometimes, the protective slime layer fails, and the stomach\'s own acid burns a painful hole or sore in its wall.\n2. Acid Reflux (Heartburn): When the acid accidentally splashes up into your food pipe, causing a burning feeling in your chest.\n\nReal-World Example: Think of an ulcer like having a painful scratch on your hand, and then accidentally squeezing lemon juice on it. It burns! Eating overly spicy food, stressing too much, or taking too many painkillers can thin out your stomach\'s slime shield, causing this exact pain.',
      },
      {
        system_id: respiratorySystem.id,
        name: 'Lungs',
        key_facts: 'Your lungs are two huge, pink, spongy organs that take up most of your chest. \n\nFun Fact: They aren\'t twins! Your left lung is actually a little bit smaller and has a cutout shape in it just to make a cozy space for your heart to sit. If you look inside a lung, it looks exactly like an upside-down tree. The main windpipe splits into branches, and at the end of the smallest branches, there are millions of tiny air sacs called "alveoli" that look like microscopic bunches of grapes. If you stretched out all these tiny air sacs flat, they would cover an entire tennis court!',
        functions: '1. The Oxygen Deliverer: Their main job is to pull fresh, invisible oxygen from the air into your blood so your body has energy to run, jump, and think.\n2. The Trash Remover: They collect the waste gas (carbon dioxide) from your blood and push it out of your mouth when you exhale.\n\nReal-World Example: Think of your lungs as a giant sponge. When you breathe in, the sponge expands and soaks up clean water (oxygen). When you breathe out, the sponge is squeezed by your muscles to push all the dirty, used water (carbon dioxide) out.',
        clinical_diseases: '1. Asthma: The branches inside the lungs become super sensitive, swollen, and narrow, making it very hard for air to pass through.\n2. Pneumonia: A nasty infection where the tiny "grapes" (air sacs) fill up with liquid or pus instead of air.\n\nReal-World Example: Having an asthma attack feels exactly like trying to breathe through a very thin drinking straw after running a race. You are pulling hard, but barely any air is coming in. Taking an inhaler relaxes the tubes and opens them back up, like switching the thin straw for a wide pipe.',
      },
      {
        system_id: urinarySystem.id,
        name: 'Kidney',
        key_facts: 'You have two kidneys, and as the name suggests, they are shaped exactly like kidney beans! They are about the size of a computer mouse and are tucked safely in your lower back. \n\nEven though they are small, they are the hardest working cleaners in your body. Every single minute, they filter about half a cup of your blood. In fact, all the blood in your entire body passes through your kidneys and gets cleaned about 40 times a day!',
        functions: '1. The Ultimate Water Filter: They constantly scan your blood to remove toxins, waste from food, and extra water. They mix this waste together to create urine (pee).\n2. The Balancer: They make sure your body has the perfect amount of salt, potassium, and water. If you drink lots of water, they make pale pee. If you don\'t drink enough, they save water and make dark yellow pee.\n\nReal-World Example: Imagine pouring dirty, muddy water through a fine coffee filter. The clean, pure water drips down into the cup, while all the dirt, rocks, and mud get trapped in the filter and thrown away in the trash. Your kidneys are that filter, and the trash is your urine!',
        clinical_diseases: '1. Kidney Stones: Sometimes, extra minerals and salts in the kidney stick together and form hard, rock-like pebbles.\n2. Chronic Kidney Disease: A silent disease where the filters slowly get damaged over years and stop cleaning the blood properly.\n\nReal-World Example: A kidney stone is like a sharp piece of sand getting stuck inside a very thin, delicate pipe. As the body tries to push that sharp rock down the pipe to pee it out, it scrapes the walls, causing some of the worst pain a human can experience.',
      }
    ]);

    console.log('Seeding Quizzes...');
    const heartQuiz = await Quiz.create({
      title: 'Cardiovascular Basics',
      description: 'Test your knowledge about the human heart.',
      category: 'Cardiovascular',
      difficulty: 'Basic',
      xp_reward: 100,
    });

    console.log('Seeding Quiz Questions...');
    await QuizQuestion.bulkCreate([
      {
        quiz_id: heartQuiz.id,
        question_text: 'How many chambers does the human heart have?',
        options: [
          { text: 'Two', is_correct: false },
          { text: 'Three', is_correct: false },
          { text: 'Four', is_correct: true },
          { text: 'Five', is_correct: false }
        ],
        explanation: 'The human heart has four chambers: two atria and two ventricles.'
      },
      {
        quiz_id: heartQuiz.id,
        question_text: 'Which vessel carries oxygenated blood from the lungs to the heart?',
        options: [
          { text: 'Pulmonary Artery', is_correct: false },
          { text: 'Pulmonary Vein', is_correct: true },
          { text: 'Aorta', is_correct: false },
          { text: 'Vena Cava', is_correct: false }
        ],
        explanation: 'The pulmonary veins carry oxygen-rich blood from the lungs to the left atrium.'
      }
    ]);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
