import dayjs from 'dayjs';

export class MemberResource {
  static toJSON(member: any) {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      shortName: member.name
            .split(' ')
            .filter(Boolean)
            .map((part: string) => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join(''),
      registeredAt: dayjs(member.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      projectMemberships: member.memberships.map((membership: any) => ({
        role: membership.role,
        project: {
          id: membership.project.id,
          name: membership.project.name,
          description: membership.project.description,
        }
      }))
    };
  }

  static collection(members: any[]) {
    return members.map(MemberResource.toJSON);
  }
}