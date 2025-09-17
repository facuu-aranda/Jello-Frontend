
export const SKILLS_CATEGORIES = {
  LANGUAGES: "Lenguajes de Programación",
  FRONTEND: "Frontend Development",
  BACKEND: "Backend Development",
  DATABASES: "Bases de Datos",
  MOBILE: "Mobile Development",
  DEVOPS: "DevOps & Cloud",
  TESTING: "Testing",
  TOOLS: "Herramientas y Software",
  DESIGN: "Diseño UI/UX",
  SOFT_SKILLS: "Habilidades Blandas",
};

export const SKILLS = [
  // Lenguajes
  { name: "JavaScript", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "TypeScript", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Python", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Java", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "C#", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Go", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Rust", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "PHP", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Ruby", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Swift", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "Kotlin", category: SKILLS_CATEGORIES.LANGUAGES },
  { name: "SQL", category: SKILLS_CATEGORIES.LANGUAGES },
  
  // Frontend
  { name: "React", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Next.js", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Vue.js", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Angular", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Svelte", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "HTML5", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "CSS3", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Sass", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Tailwind CSS", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "Redux", category: SKILLS_CATEGORIES.FRONTEND },
  { name: "GraphQL", category: SKILLS_CATEGORIES.FRONTEND },

  // Backend
  { name: "Node.js", category: SKILLS_CATEGORIES.BACKEND },
  { name: "Express.js", category: SKILLS_CATEGORIES.BACKEND },
  { name: "Django", category: SKILLS_CATEGORIES.BACKEND },
  { name: "Flask", category: SKILLS_CATEGORIES.BACKEND },
  { name: "Ruby on Rails", category: SKILLS_CATEGORIES.BACKEND },
  { name: "Spring Boot", category: SKILLS_CATEGORIES.BACKEND },
  { name: "ASP.NET Core", category: SKILLS_CATEGORIES.BACKEND },
  { name: "Laravel", category: SKILLS_CATEGORIES.BACKEND },
  { name: "REST APIs", category: SKILLS_CATEGORIES.BACKEND },

  // Bases de Datos
  { name: "PostgreSQL", category: SKILLS_CATEGORIES.DATABASES },
  { name: "MySQL", category: SKILLS_CATEGORIES.DATABASES },
  { name: "MongoDB", category: SKILLS_CATEGORIES.DATABASES },
  { name: "Redis", category: SKILLS_CATEGORIES.DATABASES },
  { name: "Firebase", category: SKILLS_CATEGORIES.DATABASES },
  { name: "Supabase", category: SKILLS_CATEGORIES.DATABASES },

  // Mobile
  { name: "React Native", category: SKILLS_CATEGORIES.MOBILE },
  { name: "Flutter", category: SKILLS_CATEGORIES.MOBILE },
  { name: "Swift (iOS)", category: SKILLS_CATEGORIES.MOBILE },
  { name: "Kotlin (Android)", category: SKILLS_CATEGORIES.MOBILE },

  // DevOps & Cloud
  { name: "Docker", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "Kubernetes", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "AWS", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "Google Cloud", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "Microsoft Azure", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "CI/CD", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "GitHub Actions", category: SKILLS_CATEGORIES.DEVOPS },
  { name: "Terraform", category: SKILLS_CATEGORIES.DEVOPS },

  // Testing
  { name: "Jest", category: SKILLS_CATEGORIES.TESTING },
  { name: "Cypress", category: SKILLS_CATEGORIES.TESTING },
  { name: "Playwright", category: SKILLS_CATEGORIES.TESTING },
  { name: "JUnit", category: SKILLS_CATEGORIES.TESTING },
  
  // Herramientas y Software
  { name: "Git", category: SKILLS_CATEGORIES.TOOLS },
  { name: "GitHub", category: SKILLS_CATEGORIES.TOOLS },
  { name: "VS Code", category: SKILLS_CATEGORIES.TOOLS },
  { name: "Jira", category: SKILLS_CATEGORIES.TOOLS },
  { name: "Notion", category: SKILLS_CATEGORIES.TOOLS },
  { name: "Postman", category: SKILLS_CATEGORIES.TOOLS },

  // Diseño
  { name: "Figma", category: SKILLS_CATEGORIES.DESIGN },
  { name: "Adobe XD", category: SKILLS_CATEGORIES.DESIGN },
  { name: "Sketch", category: SKILLS_CATEGORIES.DESIGN },

  // Habilidades Blandas
  { name: "Comunicación", category: SKILLS_CATEGORIES.SOFT_SKILLS },
  { name: "Trabajo en Equipo", category: SKILLS_CATEGORIES.SOFT_SKILLS },
  { name: "Resolución de Problemas", category: SKILLS_CATEGORIES.SOFT_SKILLS },
  { name: "Liderazgo", category: SKILLS_CATEGORIES.SOFT_SKILLS },
  { name: "Gestión del Tiempo", category: SKILLS_CATEGORIES.SOFT_SKILLS },
  { name: "Adaptabilidad", category: SKILLS_CATEGORIES.SOFT_SKILLS },
  { name: "Pensamiento Crítico", category: SKILLS_CATEGORIES.SOFT_SKILLS },
];