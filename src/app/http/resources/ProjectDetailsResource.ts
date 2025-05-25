import dayjs from "dayjs";

export class ProjectDetailsResource {
  static toJSON(project: any) {
    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description || '',
        totalMembers: project.members.length,
        startDate: project.startDate ? dayjs(project.startDate).format('MMMM D, YYYY') : null,
        deadline: project.deadline ? dayjs(project.deadline).format('MMMM D, YYYY') : null,
        createdAt: dayjs(project.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
          projectRole: member.role,
        })),
      },
      tasks: project.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: dayjs(task.dueDate).format('YYYY-MM-DD HH:mm:ss'),
        assignee: task.assignee
          ? {
              id: task.assignee.id,
              name: task.assignee.name,
              shortName: task.assignee.name
                .split(' ')
                .filter(Boolean)
                .map((part: string) => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join(''),
              email: task.assignee.email,
              userRole: task.assignee.role,
              projectRole: project.members.find((m: any) => m.userId === task.assignee?.id)?.role || 'MEMBER',
            }
          : null,
      })),
    };
  }
}