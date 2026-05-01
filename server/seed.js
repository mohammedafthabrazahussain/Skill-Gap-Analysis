const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('./models/Skill');
const Role = require('./models/Role');
const Resource = require('./models/Resource');
const UserSkill = require('./models/UserSkill');
const UserResource = require('./models/UserResource');
const User = require('./models/User');

dotenv.config();

const skillsData = [
    // --- Frontend ---
    { name: 'HTML5 & CSS3', category: 'Frontend', difficulty: 'Easy', importance: 'High', estimatedHours: 20 },
    { name: 'JavaScript (ES6+)', category: 'Frontend', difficulty: 'Medium', importance: 'High', estimatedHours: 60 },
    { name: 'React.js', category: 'Frontend', difficulty: 'Medium', importance: 'High', estimatedHours: 50 },
    { name: 'Vue.js', category: 'Frontend', difficulty: 'Medium', importance: 'Medium', estimatedHours: 40 },
    { name: 'Angular', category: 'Frontend', difficulty: 'Hard', importance: 'Medium', estimatedHours: 60 },
    { name: 'Next.js', category: 'Frontend', difficulty: 'Medium', importance: 'High', estimatedHours: 40 },
    { name: 'TypeScript', category: 'General', difficulty: 'Medium', importance: 'High', estimatedHours: 35 },
    { name: 'Tailwind CSS', category: 'Frontend', difficulty: 'Easy', importance: 'Medium', estimatedHours: 15 },
    { name: 'SASS/SCSS', category: 'Frontend', difficulty: 'Easy', importance: 'Low', estimatedHours: 10 },
    { name: 'Redux Toolkit', category: 'Frontend', difficulty: 'Hard', importance: 'Medium', estimatedHours: 25 },

    // --- Backend ---
    { name: 'Node.js', category: 'Backend', difficulty: 'Medium', importance: 'High', estimatedHours: 45 },
    { name: 'Express.js', category: 'Backend', difficulty: 'Medium', importance: 'High', estimatedHours: 20 },
    { name: 'Python (Django/FastAPI)', category: 'Backend', difficulty: 'Medium', importance: 'High', estimatedHours: 50 },
    { name: 'Go (Golang)', category: 'Backend', difficulty: 'Hard', importance: 'Medium', estimatedHours: 40 },
    { name: 'Java (Spring Boot)', category: 'Backend', difficulty: 'Hard', importance: 'High', estimatedHours: 70 },
    { name: 'C# (.NET)', category: 'Backend', difficulty: 'Hard', importance: 'High', estimatedHours: 65 },
    { name: 'PHP (Laravel)', category: 'Backend', difficulty: 'Medium', importance: 'Low', estimatedHours: 40 },

    // --- Database ---
    { name: 'PostgreSQL', category: 'Database', difficulty: 'Medium', importance: 'High', estimatedHours: 30 },
    { name: 'MongoDB', category: 'Database', difficulty: 'Medium', importance: 'High', estimatedHours: 25 },
    { name: 'MySQL', category: 'Database', difficulty: 'Medium', importance: 'Medium', estimatedHours: 25 },
    { name: 'Redis', category: 'Database', difficulty: 'Medium', importance: 'Medium', estimatedHours: 15 },
    { name: 'Elasticsearch', category: 'Database', difficulty: 'Hard', importance: 'Low', estimatedHours: 30 },

    // --- DevOps & Cloud ---
    { name: 'Docker & Containers', category: 'DevOps', difficulty: 'Medium', importance: 'High', estimatedHours: 25 },
    { name: 'Kubernetes', category: 'DevOps', difficulty: 'Hard', importance: 'High', estimatedHours: 60 },
    { name: 'AWS Cloud Services', category: 'Cloud', difficulty: 'Hard', importance: 'High', estimatedHours: 80 },
    { name: 'Azure Cloud', category: 'Cloud', difficulty: 'Hard', importance: 'Medium', estimatedHours: 70 },
    { name: 'Google Cloud (GCP)', category: 'Cloud', difficulty: 'Hard', importance: 'Medium', estimatedHours: 70 },
    { name: 'Terraform (IaC)', category: 'DevOps', difficulty: 'Hard', importance: 'Medium', estimatedHours: 40 },
    { name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', difficulty: 'Medium', importance: 'High', estimatedHours: 20 },
    { name: 'Git & Version Control', category: 'General', difficulty: 'Easy', importance: 'High', estimatedHours: 10 },
    { name: 'Linux Command Line', category: 'DevOps', difficulty: 'Medium', importance: 'High', estimatedHours: 30 },

    // --- Mobile ---
    { name: 'React Native', category: 'Mobile', difficulty: 'Medium', importance: 'High', estimatedHours: 50 },
    { name: 'Flutter & Dart', category: 'Mobile', difficulty: 'Medium', importance: 'High', estimatedHours: 55 },
    { name: 'Swift (iOS)', category: 'Mobile', difficulty: 'Hard', importance: 'High', estimatedHours: 70 },
    { name: 'Kotlin (Android)', category: 'Mobile', difficulty: 'Hard', importance: 'High', estimatedHours: 70 },
    { name: 'Ionic', category: 'Mobile', difficulty: 'Medium', importance: 'Low', estimatedHours: 30 },

    // --- Data Science & AI ---
    { name: 'Python for Data Science', category: 'Data Science', difficulty: 'Medium', importance: 'High', estimatedHours: 40 },
    { name: 'Data Analysis (Pandas/NumPy)', category: 'Data Science', difficulty: 'Medium', importance: 'High', estimatedHours: 40 },
    { name: 'Machine Learning Basics', category: 'AI', difficulty: 'Hard', importance: 'High', estimatedHours: 80 },
    { name: 'Deep Learning (PyTorch/TensorFlow)', category: 'AI', difficulty: 'Hard', importance: 'High', estimatedHours: 100 },
    { name: 'Generative AI & LLMs', category: 'AI', difficulty: 'Hard', importance: 'High', estimatedHours: 50 },
    { name: 'SQL for Data Science', category: 'Data Science', difficulty: 'Medium', importance: 'High', estimatedHours: 20 },
    { name: 'Tableau/PowerBI', category: 'Data Science', difficulty: 'Medium', importance: 'Medium', estimatedHours: 30 },

    // --- Cybersecurity ---
    { name: 'Ethical Hacking Basics', category: 'Cybersecurity', difficulty: 'Hard', importance: 'High', estimatedHours: 60 },
    { name: 'Network Security', category: 'Cybersecurity', difficulty: 'Hard', importance: 'High', estimatedHours: 50 },
    { name: 'Cloud Security', category: 'Cybersecurity', difficulty: 'Hard', importance: 'High', estimatedHours: 40 },
    { name: 'Penetration Testing', category: 'Cybersecurity', difficulty: 'Hard', importance: 'High', estimatedHours: 80 },

    // --- Design ---
    { name: 'UI Design Principles', category: 'Design', difficulty: 'Medium', importance: 'High', estimatedHours: 30 },
    { name: 'UX Research & Strategy', category: 'Design', difficulty: 'Medium', importance: 'High', estimatedHours: 40 },
    { name: 'Figma Mastery', category: 'Design', difficulty: 'Medium', importance: 'High', estimatedHours: 20 },
    { name: 'Adobe Creative Suite', category: 'Design', difficulty: 'Hard', importance: 'Low', estimatedHours: 60 },

    // --- Specialized ---
    { name: 'Solidity (Blockchain)', category: 'Other', difficulty: 'Hard', importance: 'Medium', estimatedHours: 50 },
    { name: 'Unity & C# (Game Dev)', category: 'Other', difficulty: 'Hard', importance: 'Medium', estimatedHours: 100 },
    { name: 'C++ for Embedded Systems', category: 'Other', difficulty: 'Hard', importance: 'High', estimatedHours: 120 }
];

const rolesData = [
    { title: 'Frontend Developer', skills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'React.js', 'TypeScript', 'Tailwind CSS', 'Git & Version Control'], description: 'Build high-performance web interfaces.', impact: { demand: 'Very High', avgSalary: '$90k', relevanceScore: 95 } },
    { title: 'Backend Developer', skills: ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Docker & Containers', 'Git & Version Control'], description: 'Scale server-side systems and APIs.', impact: { demand: 'Very High', avgSalary: '$100k', relevanceScore: 94 } },
    { title: 'Full Stack Developer', skills: ['React.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker & Containers', 'Git & Version Control'], description: 'Master of both worlds.', impact: { demand: 'Critical', avgSalary: '$115k', relevanceScore: 98 } },
    { title: 'DevOps Engineer', skills: ['Docker & Containers', 'Kubernetes', 'AWS Cloud Services', 'Terraform (IaC)', 'CI/CD Pipelines (GitHub Actions)'], description: 'Automate infrastructure and delivery.', impact: { demand: 'Critical', avgSalary: '$125k', relevanceScore: 92 } },
    { title: 'Mobile Developer (iOS)', skills: ['Swift (iOS)', 'UI Design Principles', 'Git & Version Control', 'CI/CD Pipelines (GitHub Actions)'], description: 'Build premium iOS applications.', impact: { demand: 'High', avgSalary: '$110k', relevanceScore: 91 } },
    { title: 'Mobile Developer (Android)', skills: ['Kotlin (Android)', 'UI Design Principles', 'Git & Version Control', 'CI/CD Pipelines (GitHub Actions)'], description: 'Create powerful Android apps.', impact: { demand: 'High', avgSalary: '$105k', relevanceScore: 90 } },
    { title: 'Data Scientist', skills: ['Python for Data Science', 'Data Analysis (Pandas/NumPy)', 'SQL for Data Science', 'Machine Learning Basics'], description: 'Extract wisdom from data.', impact: { demand: 'Very High', avgSalary: '$120k', relevanceScore: 96 } },
    { title: 'ML Engineer', skills: ['Machine Learning Basics', 'Deep Learning (PyTorch/TensorFlow)', 'Python for Data Science', 'Docker & Containers'], description: 'Productionize AI models.', impact: { demand: 'Extreme', avgSalary: '$150k', relevanceScore: 99 } },
    { title: 'AI Research Scientist', skills: ['Deep Learning (PyTorch/TensorFlow)', 'Generative AI & LLMs', 'Python for Data Science', 'Machine Learning Basics'], description: 'Pioneer the future of intelligence.', impact: { demand: 'Extreme', avgSalary: '$180k', relevanceScore: 100 } },
    { title: 'Cloud Architect (AWS)', skills: ['AWS Cloud Services', 'Kubernetes', 'Docker & Containers', 'Terraform (IaC)', 'Network Security'], description: 'Design enterprise cloud solutions.', impact: { demand: 'Critical', avgSalary: '$145k', relevanceScore: 94 } },
    { title: 'Cybersecurity Analyst', skills: ['Ethical Hacking Basics', 'Network Security', 'Linux Command Line', 'Cloud Security'], description: 'Guard the digital fortress.', impact: { demand: 'Very High', avgSalary: '$95k', relevanceScore: 93 } },
    { title: 'UI/UX Designer', skills: ['Figma Mastery', 'UI Design Principles', 'UX Research & Strategy', 'HTML5 & CSS3'], description: 'Design user-centric products.', impact: { demand: 'High', avgSalary: '$85k', relevanceScore: 89 } },
    { title: 'Product Manager', skills: ['UX Research & Strategy', 'Data Analysis (Pandas/NumPy)', 'SQL for Data Science', 'Git & Version Control'], description: 'Define the vision of the product.', impact: { demand: 'Very High', avgSalary: '$110k', relevanceScore: 87 } },
    { title: 'SRE (Site Reliability Engineer)', skills: ['Linux Command Line', 'Kubernetes', 'Docker & Containers', 'Go (Golang)', 'AWS Cloud Services'], description: 'Ensure systems stay alive and healthy.', impact: { demand: 'Critical', avgSalary: '$140k', relevanceScore: 95 } },
    { title: 'Blockchain Developer', skills: ['Solidity (Blockchain)', 'JavaScript (ES6+)', 'TypeScript', 'Node.js', 'Network Security'], description: 'Build decentralized applications.', impact: { demand: 'High', avgSalary: '$130k', relevanceScore: 88 } },
    { title: 'Game Developer', skills: ['Unity & C# (Game Dev)', 'UI Design Principles', 'C++ for Embedded Systems', 'Git & Version Control'], description: 'Bring virtual worlds to life.', impact: { demand: 'Medium', avgSalary: '$90k', relevanceScore: 85 } },
    { title: 'Embedded Systems Engineer', skills: ['C++ for Embedded Systems', 'Linux Command Line', 'Network Security', 'Git & Version Control'], description: 'Program the physical world.', impact: { demand: 'High', avgSalary: '$100k', relevanceScore: 86 } },
    { title: 'Data Engineer', skills: ['PostgreSQL', 'SQL for Data Science', 'Python for Data Science', 'Docker & Containers', 'AWS Cloud Services'], description: 'Build the data plumbing.', impact: { demand: 'Very High', avgSalary: '$115k', relevanceScore: 94 } },
    { title: 'QA Automation Engineer', skills: ['JavaScript (ES6+)', 'Node.js', 'CI/CD Pipelines (GitHub Actions)', 'Linux Command Line'], description: 'Automate quality at scale.', impact: { demand: 'High', avgSalary: '$90k', relevanceScore: 88 } },
    { title: 'Cloud Security Specialist', skills: ['Cloud Security', 'AWS Cloud Services', 'Network Security', 'Kubernetes', 'Docker & Containers'], description: 'Secure the cloud.', impact: { demand: 'Critical', avgSalary: '$135k', relevanceScore: 93 } },
    { title: 'Full Stack Developer (Python/React)', skills: ['React.js', 'Python (Django/FastAPI)', 'PostgreSQL', 'Docker & Containers', 'Git & Version Control'], description: 'Build versatile web apps with Python.', impact: { demand: 'High', avgSalary: '$110k', relevanceScore: 95 } },
    { title: 'Cloud Engineer (Azure)', skills: ['Azure Cloud', 'Kubernetes', 'Terraform (IaC)', 'Docker & Containers', 'CI/CD Pipelines (GitHub Actions)'], description: 'Master Microsoft Cloud ecosystems.', impact: { demand: 'High', avgSalary: '$115k', relevanceScore: 91 } },
    { title: 'AI Product Manager', skills: ['Generative AI & LLMs', 'UX Research & Strategy', 'Data Analysis (Pandas/NumPy)', 'Machine Learning Basics'], description: 'Lead AI-driven product transformations.', impact: { demand: 'Extreme', avgSalary: '$140k', relevanceScore: 97 } },
    { title: 'Platform Engineer', skills: ['Kubernetes', 'Docker & Containers', 'Terraform (IaC)', 'Go (Golang)', 'Linux Command Line'], description: 'Build the tools for other developers.', impact: { demand: 'Critical', avgSalary: '$145k', relevanceScore: 94 } },
    { title: 'Data Analyst', skills: ['Data Analysis (Pandas/NumPy)', 'SQL for Data Science', 'Tableau/PowerBI', 'Git & Version Control'], description: 'Find the story in the data.', impact: { demand: 'High', avgSalary: '$75k', relevanceScore: 88 } }
];

const resourcesData = {
    'HTML5 & CSS3': [
        { title: 'FreeCodeCamp - Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Course', level: 'Beginner', duration: '20h' },
        { title: 'CSS-Tricks Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'Article', level: 'Intermediate', duration: '2h' }
    ],
    'JavaScript (ES6+)': [
        { title: 'Namaste JavaScript', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCgwU9ZEWvi1073G7', type: 'Video', level: 'Intermediate', duration: '15h' },
        { title: 'Eloquent JavaScript Book', url: 'https://eloquentjavascript.net/', type: 'Article', level: 'Advanced', duration: '30h' }
    ],
    'React.js': [
        { title: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'Documentation', level: 'Beginner', duration: '10h' },
        { title: 'Full Modern React Course', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'Video', level: 'Intermediate', duration: '12h' }
    ],
    'Node.js': [
        { title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', type: 'Video', level: 'Beginner', duration: '3h' },
        { title: 'The Art of Node', url: 'https://github.com/maxogden/art-of-node', type: 'Article', level: 'Intermediate', duration: '5h' }
    ],
    'Python for Data Science': [
        { title: 'Python for Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'Article', level: 'Intermediate', duration: '40h' },
        { title: 'Data Science with Python (Playlist)', url: 'https://www.youtube.com/playlist?list=PL2-dafEMk2A6QKz1mrk1u6q6UsX_9_0s9', type: 'Video', level: 'Beginner', duration: '25h' }
    ],
    'Machine Learning Basics': [
        { title: 'Andrew Ng ML Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', type: 'Course', level: 'Beginner', duration: '80h' },
        { title: 'StatQuest ML Fundamentals', url: 'https://www.youtube.com/@statquest', type: 'Video', level: 'Beginner', duration: '20h' }
    ],
    'Generative AI & LLMs': [
        { title: 'LLM University by Cohere', url: 'https://cohere.com/llmu', type: 'Course', level: 'Intermediate', duration: '15h' },
        { title: 'ChatGPT Prompt Engineering', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/', type: 'Course', level: 'Beginner', duration: '2h' }
    ],
    'Docker & Containers': [
        { title: 'Docker for Beginners', url: 'https://www.youtube.com/watch?v=pTFZFxd4hZc', type: 'Video', level: 'Beginner', duration: '3h' },
        { title: 'Docker Official Getting Started', url: 'https://docs.docker.com/get-started/', type: 'Documentation', level: 'Beginner', duration: '4h' }
    ],
    'Kubernetes': [
        { title: 'Kubernetes Crash Course', url: 'https://www.youtube.com/watch?v=s_o8dwzRlu4', type: 'Video', level: 'Intermediate', duration: '4h' },
        { title: 'CKA Practice Course', url: 'https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/', type: 'Course', level: 'Advanced', duration: '30h' }
    ],
    'AWS Cloud Services': [
        { title: 'AWS Cloud Practitioner Essentials', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials', type: 'Course', level: 'Beginner', duration: '6h' },
        { title: 'AWS Solutions Architect Path', url: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', type: 'Video', level: 'Advanced', duration: '60h' }
    ],
    'Figma Mastery': [
        { title: 'Figma for Beginners (Playlist)', url: 'https://www.youtube.com/playlist?list=PLXDU_eVOJTx7QHLShNqIXL1Cgbxj7HlN4', type: 'Video', level: 'Beginner', duration: '8h' },
        { title: 'Figma Learn Center', url: 'https://help.figma.com/hc/en-us/categories/360002046554-Learn-Figma', type: 'Documentation', level: 'Beginner', duration: '20h' }
    ],
    'Solidity (Blockchain)': [
        { title: 'CryptoZombies - Learn Solidity', url: 'https://cryptozombies.io/', type: 'Course', level: 'Beginner', duration: '10h' },
        { title: 'Mastering Ethereum Book', url: 'https://github.com/ethereumbook/ethereumbook', type: 'Article', level: 'Advanced', duration: '50h' }
    ],
    'Swift (iOS)': [
        { title: 'SwiftUI Foundations', url: 'https://developer.apple.com/tutorials/swiftui', type: 'Course', level: 'Beginner', duration: '15h' },
        { title: '100 Days of SwiftUI', url: 'https://www.hackingwithswift.com/100/swiftui', type: 'Video', level: 'Intermediate', duration: '100h' }
    ],
    'Kotlin (Android)': [
        { title: 'Android Basics in Kotlin', url: 'https://developer.android.com/courses/android-basics-kotlin/course', type: 'Course', level: 'Beginner', duration: '30h' },
        { title: 'Kotlin for Android Developers', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9dAFnu94vE8vIAnLp97m24-', type: 'Video', level: 'Intermediate', duration: '20h' }
    ],
    'TypeScript': [
        { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'Documentation', level: 'Beginner', duration: '10h' },
        { title: 'Total TypeScript', url: 'https://www.totaltypescript.com/', type: 'Course', level: 'Advanced', duration: '20h' }
    ],
    'Go (Golang)': [
        { title: 'A Tour of Go', url: 'https://go.dev/tour/', type: 'Course', level: 'Beginner', duration: '5h' },
        { title: 'Go by Example', url: 'https://gobyexample.com/', type: 'Article', level: 'Intermediate', duration: '10h' }
    ],
    'Terraform (IaC)': [
        { title: 'Terraform Up & Running', url: 'https://www.terraform.io/intro', type: 'Documentation', level: 'Beginner', duration: '5h' },
        { title: 'Terraform Course (FreeCodeCamp)', url: 'https://www.youtube.com/watch?v=V4waklkBC38', type: 'Video', level: 'Intermediate', duration: '3h' }
    ],
    'CI/CD Pipelines (GitHub Actions)': [
        { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'Documentation', level: 'Beginner', duration: '8h' },
        { title: 'CI/CD with GitHub Actions', url: 'https://www.youtube.com/watch?v=mFFXuXjVgkU', type: 'Video', level: 'Intermediate', duration: '2h' }
    ],
    'PostgreSQL': [
        { title: 'PostgreSQL Tutorial for Beginners', url: 'https://www.postgresqltutorial.com/', type: 'Course', level: 'Beginner', duration: '15h' },
        { title: 'Mastering PostgreSQL', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', type: 'Video', level: 'Advanced', duration: '5h' }
    ],
    'UI Design Principles': [
        { title: 'Refactoring UI', url: 'https://www.refactoringui.com/', type: 'Article', level: 'Intermediate', duration: '10h' },
        { title: 'UI Design Fundamentals', url: 'https://www.youtube.com/watch?v=689S-N-v99I', type: 'Video', level: 'Beginner', duration: '2h' }
    ],
    'Ethical Hacking Basics': [
        { title: 'The Cyber Mentor - Ethical Hacking', url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', type: 'Video', level: 'Beginner', duration: '12h' },
        { title: 'TryHackMe - Complete Beginner', url: 'https://tryhackme.com/path/outline/beginner', type: 'Course', level: 'Beginner', duration: '50h' }
    ],
    'Flutter & Dart': [
        { title: 'Flutter Official Docs', url: 'https://docs.flutter.dev/get-started/learn-more', type: 'Documentation', level: 'Beginner', duration: '15h' },
        { title: 'Flutter Course for Beginners', url: 'https://www.youtube.com/watch?v=pTJJsTQvp8I', type: 'Video', level: 'Intermediate', duration: '30h' }
    ],
    'React Native': [
        { title: 'React Native Express', url: 'https://www.reactnativeexpress.com/', type: 'Article', level: 'Beginner', duration: '10h' },
        { title: 'React Native Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', type: 'Video', level: 'Intermediate', duration: '2h' }
    ],
    'Deep Learning (PyTorch/TensorFlow)': [
        { title: 'PyTorch for Deep Learning', url: 'https://www.learnpytorch.io/', type: 'Course', level: 'Intermediate', duration: '40h' },
        { title: 'TensorFlow Official Tutorials', url: 'https://www.tensorflow.org/tutorials', type: 'Documentation', level: 'Intermediate', duration: '30h' }
    ],
    'Azure Cloud': [
        { title: 'Azure Fundamentals (AZ-900)', url: 'https://learn.microsoft.com/en-us/training/paths/az-900-fundamentals-2020/', type: 'Course', level: 'Beginner', duration: '10h' },
        { title: 'Azure Administrator Path', url: 'https://www.youtube.com/watch?v=10SReS_I6To', type: 'Video', level: 'Advanced', duration: '15h' }
    ],
    'Network Security': [
        { title: 'Network+ Certification Prep', url: 'https://www.professormesser.com/network-plus/n10-008/n10-008-video-index/', type: 'Video', level: 'Intermediate', duration: '20h' },
        { title: 'Cisco Networking Academy', url: 'https://www.netacad.com/', type: 'Course', level: 'Beginner', duration: '60h' }
    ],
    'Linux Command Line': [
        { title: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'Article', level: 'Beginner', duration: '20h' },
        { title: 'The Linux Command Line (Book)', url: 'https://linuxcommand.org/tlcl.php', type: 'Article', level: 'Intermediate', duration: '30h' }
    ],
    'SQL for Data Science': [
        { title: 'SQL for Data Science (Coursera)', url: 'https://www.coursera.org/learn/sql-for-data-science', type: 'Course', level: 'Beginner', duration: '20h' },
        { title: 'SQL Zoo', url: 'https://sqlzoo.net/wiki/SQL_Tutorial', type: 'Article', level: 'Beginner', duration: '5h' }
    ],
    'Tableau/PowerBI': [
        { title: 'Tableau Training for Beginners', url: 'https://www.tableau.com/learn/training/20221', type: 'Video', level: 'Beginner', duration: '10h' },
        { title: 'Power BI Guided Learning', url: 'https://learn.microsoft.com/en-us/power-bi/learning-paths/get-started-power-bi/', type: 'Course', level: 'Beginner', duration: '15h' }
    ],
    'Express.js': [
        { title: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', type: 'Video', level: 'Beginner', duration: '2h' },
        { title: 'Express Guide', url: 'https://expressjs.com/en/guide/routing.html', type: 'Documentation', level: 'Intermediate', duration: '5h' }
    ],
    'MongoDB': [
        { title: 'MongoDB University', url: 'https://university.mongodb.com/', type: 'Course', level: 'Beginner', duration: '20h' },
        { title: 'MongoDB Crash Course', url: 'https://www.youtube.com/watch?v=oSIv-E60NiU', type: 'Video', level: 'Beginner', duration: '3h' }
    ]
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Seeding...');

        // Clear EVERYTHING to avoid ID mismatch issues
        await UserSkill.deleteMany();
        await UserResource.deleteMany();
        await Skill.deleteMany();
        await Role.deleteMany();
        await Resource.deleteMany();
        
        // Clear targetRole from all users to force re-selection
        await User.updateMany({}, { $unset: { targetRole: 1 } });
        console.log('Cleared all user progress and target roles to ensure data integrity.');

        // 1. Insert Skills
        const createdSkills = await Skill.insertMany(skillsData);
        console.log(`Inserted ${createdSkills.length} skills.`);

        const skillMap = {};
        createdSkills.forEach(s => skillMap[s.name] = s._id);

        // 2. Insert Roles
        for (const r of rolesData) {
            const roleSkills = r.skills.map(skillName => ({
                skill: skillMap[skillName],
                levelRequired: 80
            })).filter(rs => rs.skill);

            if (roleSkills.length === 0) {
                console.warn(`Role "${r.title}" has no valid skills. Skipping.`);
                continue;
            }

            await Role.create({
                title: r.title,
                description: r.description,
                requiredSkills: roleSkills,
                industryImpact: r.impact
            });
        }
        console.log(`Inserted ${rolesData.length} roles.`);

        // 3. Insert Resources
        const resourcesToInsert = [];
        for (const [skillName, resList] of Object.entries(resourcesData)) {
            const skillId = skillMap[skillName];
            if (!skillId) continue;

            resList.forEach(res => {
                resourcesToInsert.push({
                    skill: skillId,
                    ...res
                });
            });
        }
        await Resource.insertMany(resourcesToInsert);
        console.log(`Inserted ${resourcesToInsert.length} resources.`);

        console.log('Database Seeding Complete! All systems reset for stability.');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
