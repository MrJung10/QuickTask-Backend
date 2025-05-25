import dayjs from "dayjs";

export class ProjectResource {
    static toJSON(project: any) {
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        totalMembers: project.members.length,
        startDate: project.startDate ? dayjs(project.startDate).format('YYYY-MM-DD HH:mm:ss') : null,
        deadline: project.deadline ? dayjs(project.deadline).format('YYYY-MM-DD HH:mm:ss') : null,
        createdAt: dayjs(project.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(project.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        members: project.members.map((member: any) => ({
          id: member.user.id,
          name: member.user.name,
          shortName: member.user.name
            .split(' ')
            .filter(Boolean)
            .map((part: string) => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join(''),
          email: member.user.email,
          userRole: member.user.role,
          projectRole: member.role
        })),
      };
    }
  
    static collection(projects: any[]) {
      return projects.map(ProjectResource.toJSON);
    }
  }