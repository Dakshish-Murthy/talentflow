import { Job, Candidate, Assessment, Section, Question, Note } from '../types';
import { db } from '../services/database';

const jobTitles = [
  'Senior Frontend Developer', 'Full Stack Engineer', 'DevOps Engineer', 
  'UX/UI Designer', 'Data Scientist', 'Mobile Developer (React Native)', 
  'Backend Engineer (Node.js)', 'Product Manager', 'QA Automation Engineer',
  'Technical Lead', 'Security Engineer', 'Machine Learning Engineer',
  'Software Architect', 'Cloud Engineer', 'Database Administrator',
  'Site Reliability Engineer', 'Frontend Developer', 'Backend Developer',
  'Systems Engineer', 'Integration Engineer', 'Data Engineer',
  'Technical Project Manager', 'Scrum Master', 'IT Support Specialist',
  'Network Engineer'
] as const;

type JobTitle = typeof jobTitles[number];

const locations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
  'Boston, MA', 'Denver, CO', 'Chicago, IL', 'Remote',
  'Los Angeles, CA', 'Portland, OR', 'Atlanta, GA', 'Miami, FL',
  'Dallas, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'Washington, DC'
];

const skills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker',
  'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis',
  'Jenkins', 'Terraform', 'Machine Learning', 'UI/UX', 'CI/CD',
  'Microservices', 'Agile', 'Testing', 'Security', 'DevOps',
  'Mobile', 'Cloud', 'Architecture', 'Leadership', 'REST API',
  'JavaScript', 'Java', 'C#', 'Go', 'Ruby', 'PHP',
  'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'Firebase', 'Azure', 'GCP', 'Linux', 'Windows Server'
];

const experienceLevels = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)', 
  'Senior Level (6-10 years)',
  'Lead Level (10+ years)'
];

const names = [
  'John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Davis',
  'Michael Brown', 'Sarah Wilson', 'David Miller', 'Lisa Taylor',
  'James Wilson', 'Maria Garcia', 'William Clark', 'Linda Rodriguez',
  'Richard Lee', 'Susan Walker', 'Joseph Hall', 'Karen Young',
  'Thomas King', 'Nancy Scott', 'Charles Green', 'Betty Adams',
  'Christopher Harris', 'Jessica Martinez', 'Daniel Lewis', 'Amanda White',
  'Matthew Turner', 'Michelle Moore', 'Anthony Jackson', 'Helen Thompson',
  'Mark Allen', 'Laura Martin', 'Steven Young', 'Rebecca Hernandez',
  'Kevin Wright', 'Cynthia Lopez', 'Brian Hill', 'Samantha Scott',
  'George Adams', 'Ruth Baker', 'Edward Gonzalez', 'Sharon Nelson'
];

const jobDescriptions: Record<JobTitle, string> = {
  'Senior Frontend Developer': 'We are looking for an experienced Senior Frontend Developer to join our product team. You will be responsible for building responsive web applications using React, TypeScript, and modern frontend technologies. The ideal candidate has 5+ years of experience and a strong background in UI/UX principles.',
  'Full Stack Engineer': 'Join our dynamic engineering team as a Full Stack Engineer. You will work on cutting-edge projects across our entire technology stack, from frontend interfaces to backend services and databases.',
  'DevOps Engineer': 'We are seeking a skilled DevOps Engineer to help build and maintain our cloud infrastructure and CI/CD pipelines. You will play a crucial role in ensuring our systems are scalable, reliable, and secure.',
  'UX/UI Designer': 'Looking for a creative UX/UI Designer to design beautiful and intuitive user experiences for our digital products. You will work closely with product managers and developers to create user-centered designs.',
  'Data Scientist': 'Join our data science team to build machine learning models and derive insights from large datasets. You will work on challenging problems that drive business decisions and product features.',
  'Mobile Developer (React Native)': 'We are looking for a Mobile Developer with React Native experience to help build our cross-platform mobile applications. You will work on features used by millions of users.',
  'Backend Engineer (Node.js)': 'Join our backend engineering team to build scalable and reliable services that power our applications. You will work on critical systems handling high traffic volumes.',
  'Product Manager': 'We are seeking an experienced Product Manager to lead product development initiatives and drive product strategy. You will work closely with engineering, design, and business teams.',
  'QA Automation Engineer': 'Looking for a QA Automation Engineer to build and maintain our automated testing framework. You will ensure the quality and reliability of our software products.',
  'Technical Lead': 'We are looking for a Technical Lead to guide our engineering team and drive technical excellence. You will mentor developers and make key architectural decisions.',
  'Security Engineer': 'Join our security team to protect our systems and data. You will implement security measures, conduct security assessments, and ensure compliance with security standards.',
  'Machine Learning Engineer': 'We are seeking a Machine Learning Engineer to develop and deploy ML models that power our intelligent features. You will work on everything from data pipelines to model deployment.',
  'Software Architect': 'Looking for a Software Architect to design and oversee the implementation of our software systems. You will ensure our architecture supports scalability, reliability, and maintainability.',
  'Cloud Engineer': 'Join our cloud engineering team to design and implement cloud infrastructure solutions. You will work with cutting-edge cloud technologies and ensure optimal performance and cost-efficiency.',
  'Database Administrator': 'We are looking for a Database Administrator to manage and optimize our database systems. You will ensure data integrity, performance, and security across all our databases.',
  'Site Reliability Engineer': 'Join our SRE team to ensure the reliability and performance of our production systems. You will work on monitoring, incident response, and capacity planning.',
  'Frontend Developer': 'We are looking for a Frontend Developer to build user interfaces for our web applications. You will work with modern JavaScript frameworks and collaborate with designers and backend developers.',
  'Backend Developer': 'Join our backend development team to build robust APIs and services. You will work on data processing, business logic, and integration with third-party services.',
  'Systems Engineer': 'Looking for a Systems Engineer to design and maintain our IT infrastructure. You will work on servers, networks, and storage systems to ensure optimal performance and reliability.',
  'Integration Engineer': 'We are seeking an Integration Engineer to connect our systems with external APIs and services. You will work on data exchange, API design, and system interoperability.',
  'Data Engineer': 'Join our data engineering team to build and maintain data pipelines and infrastructure. You will work on ETL processes, data warehousing, and data quality assurance.',
  'Technical Project Manager': 'We are looking for a Technical Project Manager to oversee complex technical projects. You will coordinate between teams, manage timelines, and ensure project success.',
  'Scrum Master': 'Join our agile team as a Scrum Master to facilitate our development processes. You will help teams improve their workflows and remove impediments to progress.',
  'IT Support Specialist': 'We are seeking an IT Support Specialist to provide technical support to our employees. You will troubleshoot issues, maintain equipment, and ensure smooth IT operations.',
  'Network Engineer': 'Looking for a Network Engineer to design and maintain our network infrastructure. You will work on network security, performance optimization, and connectivity solutions.'
};

const salaryRanges: Record<JobTitle, string> = {
  'Senior Frontend Developer': '$120,000 - $150,000',
  'Full Stack Engineer': '$100,000 - $130,000',
  'DevOps Engineer': '$110,000 - $140,000',
  'UX/UI Designer': '$90,000 - $120,000',
  'Data Scientist': '$130,000 - $160,000',
  'Mobile Developer (React Native)': '$95,000 - $125,000',
  'Backend Engineer (Node.js)': '$115,000 - $145,000',
  'Product Manager': '$120,000 - $150,000',
  'QA Automation Engineer': '$85,000 - $110,000',
  'Technical Lead': '$150,000 - $180,000',
  'Security Engineer': '$130,000 - $160,000',
  'Machine Learning Engineer': '$140,000 - $170,000',
  'Software Architect': '$150,000 - $190,000',
  'Cloud Engineer': '$110,000 - $140,000',
  'Database Administrator': '$100,000 - $130,000',
  'Site Reliability Engineer': '$120,000 - $150,000',
  'Frontend Developer': '$80,000 - $110,000',
  'Backend Developer': '$90,000 - $120,000',
  'Systems Engineer': '$95,000 - $125,000',
  'Integration Engineer': '$100,000 - $130,000',
  'Data Engineer': '$115,000 - $145,000',
  'Technical Project Manager': '$110,000 - $140,000',
  'Scrum Master': '$90,000 - $120,000',
  'IT Support Specialist': '$60,000 - $85,000',
  'Network Engineer': '$95,000 - $125,000'
};

const generateEmail = (name: string) => {
  return name.toLowerCase().replace(' ', '.') + '@example.com';
};

const generateNotes = (candidateId: string): Note[] => {
  const noteTemplates = [
    'Strong technical background, excellent communication skills.',
    'Great cultural fit, demonstrated leadership potential.',
    'Needs improvement in technical assessment.',
    'Impressive portfolio and project experience.',
    'Follow up for second round interview.',
    'Excellent problem-solving skills during technical interview.',
    'Referred by current employee @john.smith.',
    'Requested salary above budget range.',
    'Available to start immediately.',
    'Requires visa sponsorship.'
  ];

  const notes: Note[] = [];
  const noteCount = Math.floor(Math.random() * 3) + 1; // 1-3 notes per candidate
  
  for (let i = 0; i < noteCount; i++) {
    notes.push({
      id: `note-${candidateId}-${i}`,
      author: ['HR Team', 'Technical Lead', 'Hiring Manager', 'Recruiter'][Math.floor(Math.random() * 4)],
      content: noteTemplates[Math.floor(Math.random() * noteTemplates.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
      mentions: Math.random() > 0.8 ? ['@john.smith', '@sarah.wilson'] : [],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  return notes;
};

export const seedDatabase = async () => {
  // Clear existing data
  await Promise.all([
    db.jobs.clear(),
    db.candidates.clear(),
    db.assessments.clear(),
    db.responses.clear()
  ]);

  // Generate jobs
  const jobs: Job[] = [];
  for (let i = 0; i < 25; i++) {
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)] as JobTitle;
    const location = locations[Math.floor(Math.random() * locations.length)];
    const description = jobDescriptions[title] || `We are looking for a skilled ${title} to join our team. This position offers competitive compensation and benefits, with opportunities for professional growth and development.`;
    const salary = salaryRanges[title] || `$${Math.floor(Math.random() * 80000) + 70000} - $${Math.floor(Math.random() * 80000) + 120000}`;
    
    const job: Job = {
      id: `job-${i + 1}`,
      title: title,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`,
      status: Math.random() > 0.3 ? 'active' : 'archived',
      tags: Array.from(new Set(Array.from({ length: 4 }, () => 
          skills[Math.floor(Math.random() * skills.length)]
        ))),
      order: i + 1,
      description: description,
      salary: salary,
      location: location,
      brandLogo: `https://via.placeholder.com/100x100/007bff/ffffff?text=T`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    jobs.push(job);
  }

  // Generate candidates
  const candidates: Candidate[] = [];
  const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  
  for (let i = 0; i < 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const candidateLocation = locations[Math.floor(Math.random() * locations.length)];
    const experience = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
    const candidateSkills = Array.from(new Set(Array.from({ length: 5 }, () => 
      skills[Math.floor(Math.random() * skills.length)]
    )));
    
    const candidate: Candidate = {
      id: `candidate-${i + 1}`,
      name,
      email: generateEmail(name),
      phone: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
      stage: stages[Math.floor(Math.random() * stages.length)],
      jobId: job.id,
      jobTitle: job.title,
      appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      location: candidateLocation,
      experience: experience,
      skills: candidateSkills,
      notes: generateNotes(`candidate-${i + 1}`),
      resume: Math.random() > 0.5 ? `resume-${i + 1}.pdf` : undefined
    };
    candidates.push(candidate);
  }

  // Generate assessments
  const assessments: Assessment[] = [];
  const questionTypes = ['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric'] as const;
  
  type QuestionType = typeof questionTypes[number];
  
  const questionTypesMap: Record<QuestionType, { question: string; options: string[] }> = {
    'single-choice': {
      question: 'What is your experience level with this technology?',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    'multi-choice': {
      question: 'Which of these technologies are you proficient in?',
      options: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS']
    },
    'short-text': {
      question: 'Describe your experience in 2-3 sentences.',
      options: []
    },
    'long-text': {
      question: 'Tell us about a challenging project you worked on. What was your approach and what did you learn?',
      options: []
    },
    'numeric': {
      question: 'How many years of professional experience do you have?',
      options: []
    }
  };
  
  // Create assessments for first 5 active jobs
  const activeJobs = jobs.filter(job => job.status === 'active').slice(0, 5);
  
  for (let i = 0; i < activeJobs.length; i++) {
    const job = activeJobs[i];
    const sections: Section[] = [];
    
    for (let s = 0; s < 3; s++) {
      const questions: Question[] = [];
      for (let q = 0; q < 4; q++) {
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        const questionData = questionTypesMap[type];
        
        // Customize questions based on job
        let customizedQuestion = questionData.question;
        if (type === 'single-choice') {
          customizedQuestion = `What is your experience level with ${job.tags[0] || 'this technology'}?`;
        } else if (type === 'multi-choice') {
          customizedQuestion = `Which of these ${job.tags.slice(0, 3).join(', ')} technologies are you proficient in?`;
        } else if (type === 'short-text') {
          customizedQuestion = `Describe your experience with ${job.title.toLowerCase()} in 2-3 sentences.`;
        } else if (type === 'long-text') {
          customizedQuestion = `Tell us about a challenging project you worked on related to ${job.tags[0] || 'this role'}. What was your approach and what did you learn?`;
        } else if (type === 'numeric') {
          customizedQuestion = `How many years of professional experience do you have in ${job.title.toLowerCase()}?`;
        }
        
        const question: Question = {
          id: `q-${i}-${s}-${q}`,
          type: type,
          question: customizedQuestion,
          required: Math.random() > 0.3,
          options: [...questionData.options],
          maxLength: type === 'short-text' ? 200 : (type === 'long-text' ? 1000 : undefined),
          ...(type === 'numeric' && {
            min: 0,
            max: 50
          })
        };
        
        questions.push(question);
      }
      
      const section: Section = {
        id: `section-${i}-${s}`,
        title: `Technical Skills - Part ${s + 1}`,
        description: `This section covers important technical skills for the ${job.title} position.`,
        questions
      };
      
      sections.push(section);
    }
    
    const assessment: Assessment = {
      id: `assessment-${i + 1}`,
      jobId: job.id,
      title: `Technical Assessment - ${job.title}`,
      description: `Please complete this assessment to proceed with your application for the ${job.title} position. This assessment will help us understand your technical skills and experience.`,
      sections,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    assessments.push(assessment);
  }

  // Add to database
  await Promise.all([
    db.jobs.bulkAdd(jobs),
    db.candidates.bulkAdd(candidates),
    db.assessments.bulkAdd(assessments)
  ]);

  console.log('Database seeded successfully:');
  console.log(`- ${jobs.length} jobs created`);
  console.log(`- ${candidates.length} candidates created`);
  console.log(`- ${assessments.length} assessments created`);
  console.log(`- Active jobs: ${jobs.filter(job => job.status === 'active').length}`);
  console.log(`- Archived jobs: ${jobs.filter(job => job.status === 'archived').length}`);
};