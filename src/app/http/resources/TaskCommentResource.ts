import dayjs from "dayjs";

export class TaskCommentResource {
    static toJSON(comment: any) {
      return {
        id: comment.id,
        content: comment.content,
        user: comment.user
        ? {
            id: comment.user.id,
            name: comment.user.name,
            email: comment.user.email,
            avatar: comment.user.avatar,
          }
        : null,
        createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      };
    }
  
    static collection(comments: any[]) {
      return comments.map(this.toJSON);
    }
  }