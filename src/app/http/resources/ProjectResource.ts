import dayjs from "dayjs";

export class ProjectResource {
    static toJSON(project: any) {
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: dayjs(project.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(project.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        members: project.members.map((member: any) => ({
          userId: member.userId,
          role: member.role,
          user: {
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
          },
        })),
      };
    }
  
    static collection(projects: any[]) {
      return projects.map(ProjectResource.toJSON);
    }
  }