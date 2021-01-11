import { createHandler, nextApi } from '@/modules/next-api-routes-helpers'
import { prisma } from '@/modules/prisma'
import { requireAuthMiddleware } from '@/modules/server/middlewares/require-auth'
import { validateRequiredReqDataMiddleware } from '@/modules/server/middlewares/validate-required-req-data'
import Push from '@/modules/server/push'
import { dbNow } from '@/modules/time'

export const apiCommunityCreateSubcommentUrl = `/api/community/subcomment`

export type ApiCommunityCreateSubcommentReqData = {
  body: string
  commentId: number
}

// DELETE
export const apiCommunityDeleteSubcommentUrl = apiCommunityCreateSubcommentUrl

export type ApiCommunityDeleteSubcommentReqData = {
  subcommentId: number
}
// DELETE

export default nextApi({
  // Write a comment
  post: createHandler(async (req, res) => {
    await requireAuthMiddleware(req, res)
    await validateRequiredReqDataMiddleware<ApiCommunityCreateSubcommentReqData>(
      {
        body: {
          body: 'string',
          commentId: 'number',
        },
      }
    )(req, res)

    const { user } = req
    const { body, commentId } = req.body as ApiCommunityCreateSubcommentReqData

    const comment = await prisma.communityComment.findUnique({
      where: { id: commentId },
      include: {
        communityPost: {
          select: {
            boardId: true,
          },
        },
      },
    })

    // If the comment doesn't exist or is deleted
    // respond with NOT FOUND (404)
    if (!comment || comment.isDeleted) {
      res.status(404).end()

      return
    }

    const trimmedBody = body.trim()

    if (trimmedBody.length === 0) {
      res.status(400).end()
      return
    }

    // Create a subcomment
    const subcomment = await prisma.communitySubcomment.create({
      data: {
        user: { connect: { id: user?.id } },
        subcommentedAt: dbNow(),
        randomNickname: user?.randomNickname,
        body: trimmedBody,
        communityComment: { connect: { id: commentId } },
      },
    })

    // Push notification to the comment author
    if (comment.userId !== user.id) {
      const pushes = await prisma.push.findMany({
        where: {
          userId: comment.userId,
        },
      })

      if (pushes.length > 0) {
        Push.notify({
          to: pushes.map((push) => push.expoPushToken),
          title: '회원님의 댓글에 새로운 대댓글이 달렸습니다.',
          body: trimmedBody,
          data: {
            type: 'comment',
            boardId: comment.communityPost.boardId,
            postId: comment.postId,
            subcommentId: subcomment.id,
          },
          sound: 'default',
        }).catch((error) => {
          console.error(error)
        })
      }
    }

    res.status(200).end()
  }),
  // Delete a subcomment
  delete: async (req, res) => {
    await requireAuthMiddleware(req, res)
    await validateRequiredReqDataMiddleware<ApiCommunityDeleteSubcommentReqData>(
      {
        body: {
          subcommentId: 'number',
        },
      }
    )(req, res)

    const { user } = req

    const { subcommentId } = req.body as ApiCommunityDeleteSubcommentReqData
    const subcomment = await prisma.communitySubcomment.findUnique({
      where: { id: subcommentId },
    })

    if (!subcomment) {
      res.status(404).end()
      return
    }

    if (subcomment.userId !== user.id) {
      res.status(403).end()
      return
    }

    // Delete
    await prisma.communitySubcomment.update({
      where: { id: subcommentId },
      data: {
        isDeleted: true,
      },
    })

    res.status(200).end()
  },
})