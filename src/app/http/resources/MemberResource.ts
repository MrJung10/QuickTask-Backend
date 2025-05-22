import dayjs from 'dayjs';
import { register } from 'module';

export class MemberResource {
  static toJSON(member: any) {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      registeredAt: dayjs(member.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      memberships: member.memberships.map((membership: any) => ({
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