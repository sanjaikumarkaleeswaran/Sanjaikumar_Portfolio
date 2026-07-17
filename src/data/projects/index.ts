import type { ProjectData } from '../../types/project';

// Vite-specific eager import of all JSON files in the same directory
const projectModules = import.meta.glob<ProjectData>('./*.json', { eager: true });

export const PROJECTS: ProjectData[] = Object.values(projectModules).map((mod: any) => {
  // If the JSON is imported eagerly, the default export contains the JSON content
  return mod.default || mod;
});

export const getAllProjects = (): ProjectData[] => {
  return PROJECTS;
};

export const getProjectBySlug = (slug: string): ProjectData | undefined => {
  return PROJECTS.find(p => p.slug === slug || p.id === slug);
};

export const getRelatedProjects = (project: ProjectData, limit = 2): ProjectData[] => {
  return PROJECTS.filter(p => p.id !== project.id)
    .map(p => {
      // Calculate intersection score of tech stacks and tags
      const techIntersection = p.tech.filter(t => project.tech.includes(t)).length;
      const tagIntersection = p.tags.filter(t => project.tags.includes(t)).length;
      const score = techIntersection * 2 + tagIntersection;
      return { project: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);
};

export const getUniqueTechnologies = (): string[] => {
  const techs = new Set<string>();
  PROJECTS.forEach(p => p.tech.forEach(t => techs.add(t)));
  return Array.from(techs);
};

export const getUniqueTags = (): string[] => {
  const tags = new Set<string>();
  PROJECTS.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags);
};
