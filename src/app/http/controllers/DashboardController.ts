import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse } from '../../../utils/response.format.js';

const prisma = new PrismaClient();

export const DashboardController = {
  async overview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      // Get ongoing projects (either owned or member of)
      const ongoingProjects = await prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
          deadline: { gt: new Date() },
        },
        select: {
          id: true,
          name: true,
          description: true,
          deadline: true,
          _count: {
            select: { members: true },
          },
        },
      });

      const formattedProjects = ongoingProjects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        deadline: project.deadline,
        memberCount: project._count.members,
      }));

      const projectIds = ongoingProjects.map(p => p.id);

      const taskGroups = await prisma.task.groupBy({
        by: ['status'],
        where: {
          projectId: { in: projectIds },
        },
        _count: true,
      });

      const taskStatusCounts: Record<string, number> = {};
      let activeTaskCount = 0;

      taskGroups.forEach(group => {
        taskStatusCounts[group.status] = group._count;
        if (group.status !== 'DONE') {
          activeTaskCount += group._count;
        }
      });

      const totalTeamMembers = await prisma.projectMember.count({
        where: { projectId: { in: projectIds } },
      });

      const finalResponse = {
        stats: {
          ongoingProjectCount: ongoingProjects.length,
          activeTaskCount,
          totalTeamMembers,
        },
        ongoingProjects: formattedProjects,
        taskStatusCounts,
      }

      sendSuccessResponse(res, finalResponse, 'Dashboard data loaded successfully');
      return;
    } catch (error) {
      console.error('Dashboard overview error:', error);
      sendErrorResponse(res, 'Failed to load dashboard data', 500);
      return 
    }
  },
};
