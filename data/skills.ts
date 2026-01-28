export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  icon?: string;
  featured?: boolean;
}

export interface SkillCategory {
  key: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    key: "backend",
    skills: [
      { name: "Symfony", level: 5, featured: true },
      { name: "Laravel", level: 5, featured: true },
      { name: "PHP", level: 5 },
      { name: "Node.js", level: 3 },
    ],
  },
  {
    key: "frontend",
    skills: [
      { name: "React", level: 4, featured: true },
      { name: "Next.js", level: 4, featured: true },
      { name: "TypeScript", level: 4 },
      { name: "JavaScript", level: 5 },
      { name: "Angular", level: 3 },
      { name: "Tailwind CSS", level: 5 },
      { name: "Bootstrap", level: 4 },
      { name: "HTML/CSS", level: 5 },
      { name: "TWIG", level: 4 },
    ],
  },
  {
    key: "mobile",
    skills: [
      { name: "Android Studio", level: 4, featured: true },
      { name: "Java (Android)", level: 4 },
    ],
  },
  {
    key: "database",
    skills: [
      { name: "MySQL", level: 5, featured: true },
      { name: "PostgreSQL", level: 4 },
      { name: "SQL", level: 5 },
      { name: "NoSQL", level: 3 },
      { name: "Supabase", level: 3 },
    ],
  },
  {
    key: "devops",
    skills: [
      { name: "Docker", level: 4, featured: true },
      { name: "Git", level: 5, featured: true },
      { name: "GitHub", level: 5 },
      { name: "CI/CD", level: 3 },
      { name: "Linux", level: 4 },
    ],
  },
  {
    key: "languages",
    skills: [
      { name: "C++", level: 4 },
      { name: "C", level: 3 },
      { name: "Python", level: 3 },
      { name: "Java", level: 4 },
    ],
  },
];

export function getAllSkills(): Skill[] {
  return skillCategories.flatMap((category) => category.skills);
}

export function getFeaturedSkills(): Skill[] {
  return getAllSkills().filter((skill) => skill.featured);
}
