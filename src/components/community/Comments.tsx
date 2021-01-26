import { ArrowBlock } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Flex } from '@/components/ui/layouts/Flex'
import { NOT_FOUND } from '@/constants/http-status-code'
import EodiroDialog from '@/modules/client/eodiro-dialog'
import { eodiroRequest } from '@/modules/eodiro-request'
import { friendlyTime } from '@/modules/time'
import {
  ApiCommunityCreateCommentReqData,
  apiCommunityCreateCommentUrl,
  ApiCommunityDeleteCommentReqData,
  apiCommunityDeleteCommentUrl,
} from '@/pages/api/community/comment'
import {
  ApiCommunityCommentsResData,
  apiCommunityCommentsUrl,
  CommunityCommentWithSubcomments,
} from '@/pages/api/community/comments'
import {
  ApiCommunityCreateSubcommentReqData,
  apiCommunityCreateSubcommentUrl,
  ApiCommunityDeleteSubcommentReqData,
  apiCommunityDeleteSubcommentUrl,
} from '@/pages/api/community/subcomment'
import {
  apiCommunityGetSubcommentsUrl,
  ApiCommunitySubcommentsResData,
} from '@/pages/api/community/subcomments'
import { commentsState } from '@/pages/community/board/[boardId]/post/[postId]'
import { Dispatcher } from '@/types/react-helper'
import produce from 'immer'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import $ from './Comments.module.scss'

async function deleteComment(commentId: number): Promise<boolean> {
  try {
    await eodiroRequest<ApiCommunityDeleteCommentReqData>({
      url: apiCommunityDeleteCommentUrl,
      method: 'DELETE',
      data: {
        commentId,
      },
    })

    new EodiroDialog().vagabond('삭제되었습니다.')

    return true
  } catch (error) {
    if (error.response?.status === 404) {
      new EodiroDialog().alert('이미 삭제된 댓글입니다.')

      return false
    }
  }

  return false
}

async function deleteSubcomment(subcommentId: number): Promise<boolean> {
  try {
    await eodiroRequest<ApiCommunityDeleteSubcommentReqData>({
      url: apiCommunityDeleteSubcommentUrl,
      method: 'DELETE',
      data: {
        subcommentId,
      },
    })

    new EodiroDialog().vagabond('삭제되었습니다.')

    return true
  } catch (error) {
    if (error.response?.status === 404) {
      new EodiroDialog().alert('이미 삭제된 댓글입니다.')

      return false
    }
  }

  return false
}

const CommentItem: React.FC<{
  comment: CommunityCommentWithSubcomments
}> = ({ comment }) => {
  const setComments = useSetRecoilState(commentsState)
  const [newSubcommentActive, setNewSubcommentActive] = useState(false)
  const [newSubcomment, setNewSubcomment] = useState('')
  const subcomments = comment.communitySubcomments

  async function onDeleteComment() {
    if (!(await new EodiroDialog().confirm('정말 삭제하시겠습니까?'))) return

    const result = await deleteComment(comment.id)

    if (result) {
      setComments((prevComments) => {
        const nextComments = produce(prevComments, (draftComments) => {
          const index = draftComments.findIndex((c) => c.id === comment.id)

          if (draftComments[index].communitySubcomments.length === 0) {
            draftComments.splice(index, 1)
          } else {
            draftComments[index].randomNickname = '알수없음'
            draftComments[index].body = '삭제된 댓글입니다.'
            draftComments[index].isMine = false
          }
        })

        return nextComments
      })
    }
  }

  async function onDeleteSubcomment(subcommentId: number) {
    if (!(await new EodiroDialog().confirm('정말 삭제하시겠습니까?'))) return

    const result = await deleteSubcomment(subcommentId)

    if (result) {
      const subcommentIndex = subcomments.findIndex(
        (subcomment) => subcomment.id === subcommentId
      )
      const nextSubcomments = produce(subcomments, (draftSubcomments) => {
        draftSubcomments.splice(subcommentIndex, 1)
      })

      setComments((prevComments) => {
        const commentIndex = prevComments.findIndex(
          (c) => c.id === subcomments[subcommentIndex].commentId
        )
        const nextComments = produce(prevComments, (draftComments) => {
          draftComments[commentIndex].communitySubcomments = nextSubcomments
        })

        return nextComments
      })
    }
  }

  async function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return

    const body = e.currentTarget.value.trim()

    if (body.length === 0) {
      new EodiroDialog().alert('내용을 입력하세요.')
      return
    }

    if (body.length > 100) {
      new EodiroDialog().alert('댓글은 100자까지만 입력할 수 있습니다.')
      return
    }

    e.currentTarget.blur()
    setNewSubcomment('')

    try {
      await eodiroRequest<ApiCommunityCreateSubcommentReqData>({
        method: 'POST',
        url: apiCommunityCreateSubcommentUrl,
        data: {
          body,
          commentId: comment.id,
        },
      })

      const latestSubcomments = await eodiroRequest<
        null,
        ApiCommunitySubcommentsResData
      >({
        method: 'GET',
        url: apiCommunityGetSubcommentsUrl({
          commentId: comment.id,
          cursor:
            subcomments.length > 0
              ? subcomments[subcomments.length - 1].id
              : undefined,
        }),
      })

      const nextSubcomments = produce(subcomments, (draftSubcomments) => {
        draftSubcomments.push(...latestSubcomments)
      })

      setComments((prevComments) => {
        const commentIndex = prevComments.findIndex((c) => c.id === comment.id)
        const nextComments = produce(prevComments, (draftComments) => {
          draftComments[commentIndex].communitySubcomments = nextSubcomments
        })

        return nextComments
      })
      setNewSubcommentActive(false)
    } catch (error) {
      new EodiroDialog().alert(
        '댓글이 삭제되어 더 이상 대댓글을 달 수 없습니다.'
      )

      setComments((prev) => {
        const next = produce(prev, (draft) => {
          const index = draft.findIndex((c) => c.id === comment.id)
          draft[index].randomNickname = '알수없음'
          draft[index].body = '삭제된 댓글입니다.'
        })
        return next
      })
    }
  }

  return (
    <div className={$['comment-item']} data-comment-id={comment.id}>
      <div className={$['comment-header']}>
        <h3 className={$['author']}>{comment.randomNickname}</h3>
        <Flex className={$['right-side']}>
          <Flex row>
            {subcomments.length === 0 && (
              <button
                type="button"
                className={$['subcomment']}
                onClick={() => {
                  setNewSubcommentActive(true)
                }}
              >
                <Icon name="bubble_right" />
              </button>
            )}
            {comment.isMine && (
              <button
                type="button"
                className={$['delete']}
                onClick={onDeleteComment}
              >
                <i className="f7-icons">trash</i>
              </button>
            )}
          </Flex>
          <span className={$['commented-at']}>
            {friendlyTime(comment.commentedAt)}
          </span>
        </Flex>
      </div>

      <p className={$['body']}>{comment.body}</p>

      {(subcomments.length > 0 || newSubcommentActive) && (
        <div className={$['subcomments']}>
          {subcomments.map((subcomment) => (
            <div
              key={subcomment.id}
              className={$['subcomment-item']}
              data-subcomment-id={subcomment.id}
            >
              <Icon name="arrow_turn_down_right" className={$['arrow']} />
              <div className={$['comment-header']}>
                <h3 className={$['author']}>{subcomment.randomNickname}</h3>
                <Flex className={$['right-side']}>
                  {subcomment.isMine && (
                    <button
                      type="button"
                      className={$['delete']}
                      onClick={() => onDeleteSubcomment(subcomment.id)}
                    >
                      <i className="f7-icons">trash</i>
                    </button>
                  )}
                  <span className={$['commented-at']}>
                    {friendlyTime(subcomment.subcommentedAt)}
                  </span>
                </Flex>
              </div>
              <p className={$['body']}>{subcomment.body}</p>
            </div>
          ))}

          {!newSubcommentActive && (
            <button
              type="button"
              className={$['new-subcomment-text-btn']}
              onClick={() => {
                setNewSubcommentActive(true)
              }}
            >
              대댓글 달기
            </button>
          )}
          {newSubcommentActive && (
            <div className={$['subcomment-input']}>
              <input
                value={newSubcomment}
                onChange={(e) => {
                  setNewSubcomment(e.currentTarget.value)
                }}
                onKeyUp={onKeyUp}
                type="text"
                placeholder="내용을 입력하세요."
              />
              <button
                type="button"
                className={$['cancel-new-subcomment']}
                onClick={() => {
                  setNewSubcommentActive(false)
                }}
              >
                <Icon name="xmark" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const Comments: React.FC<{
  comments: CommunityCommentWithSubcomments[]
  setComments: Dispatcher<CommunityCommentWithSubcomments[]>
  postId: number
}> = ({ comments, setComments, postId }) => {
  const [newComment, setNewComment] = useState('')
  const router = useRouter()

  useEffect(() => {
    // If commentId or subcommentId is in query,
    // scroll to the target comment

    setTimeout(() => {
      const { query } = router

      if ('commentId' in query || 'subcommentId' in query) {
        const commentElm = document.querySelector(
          `[data-${query.commentId ? 'comment' : 'subcomment'}-id="${
            query.commentId ?? query.subcommentId
          }"]`
        )

        commentElm?.scrollIntoView({
          block: 'center',
        })
        commentElm?.classList.add($['indicating'])
        setTimeout(() => {
          commentElm?.classList.remove($['indicating'])
        }, 2000)

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
      }
    }, 100)
  }, [router])

  async function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return

    const body = e.currentTarget.value.trim()

    if (body.length === 0) {
      new EodiroDialog().alert('내용을 입력하세요.')
      return
    }

    if (body.length > 100) {
      new EodiroDialog().alert('댓글은 100자까지만 입력할 수 있습니다.')
      return
    }

    e.currentTarget.blur()
    setNewComment('')

    try {
      await eodiroRequest<ApiCommunityCreateCommentReqData>({
        method: 'POST',
        url: apiCommunityCreateCommentUrl,
        data: {
          body,
          postId,
        },
      })
    } catch (error) {
      if (error.response?.status === NOT_FOUND) {
        new EodiroDialog().alert('삭제된 게시물에는 댓글을 달 수 없습니다.')
      }

      window.location.reload()

      return
    }

    try {
      const latestComments = await eodiroRequest<
        null,
        ApiCommunityCommentsResData
      >({
        method: 'GET',
        url: apiCommunityCommentsUrl({
          postId,
          cursor:
            comments.length > 0 ? comments[comments.length - 1].id : undefined,
        }),
      })

      setComments((prevComments) => {
        const refreshedComments = [...prevComments, ...latestComments]
        return refreshedComments
      })
    } catch (error) {
      new EodiroDialog().alert('최신 댓글을 불러오는데 실패했습니다.')
    }
  }

  return (
    <section className={$['comments-section']}>
      <h1 className={$['comments-headline']}>댓글</h1>
      <ArrowBlock className={$['comments']} flat>
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </>
        ) : (
          <h1 className={$['no-comments-yet']}>아직 댓글이 없습니다.</h1>
        )}
      </ArrowBlock>
      <div>
        <input
          type="text"
          className={$['comment-input']}
          spellCheck={false}
          autoComplete="off"
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.currentTarget.value)}
          onKeyUp={onKeyUp}
        />
      </div>
    </section>
  )
}