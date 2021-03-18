import { authState } from '@/atoms/auth'
import PageInfo from '@/components/utils/PageInfo'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import { eodiroRequest } from '@/modules/eodiro-request'
import { logInUrl } from '@/utils/page-urls'
import {
  ApiNoticeNotificationsGetPublishers,
  ApiNoticeNotificationsGetResData,
  ApiNoticeNotificationsSubscribeReqBody,
  ApiNoticeNotificationsSubscribeResData,
} from '@payw/eodiro-server-types/api/notice-notifications'
import classNames from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import $ from './style.module.scss'

const NoticeWatcher: React.FC = () => {
  const { isLoggedIn } = useRecoilValue(authState)
  const [subscriptions, setSubscriptions] = useState<
    {
      key: string
      name: string
      isSubscribed: boolean
    }[]
  >([])
  const [isSyncing, setIsSyncing] = useState(true)

  useEffect(() => {
    async function init() {
      // Load all publishers
      const publishers = await eodiroRequest<
        any,
        ApiNoticeNotificationsGetPublishers
      >({
        url: ApiHost.resolve('/notice-notifications/publishers'),
        method: 'GET',
      })

      setSubscriptions(
        publishers.map((publisher) => ({
          ...publisher,
          isSubscribed: false,
        }))
      )

      if (!isLoggedIn) {
        setIsSyncing(false)
        return
      }

      const mySubscriptions = await eodiroRequest<
        void,
        ApiNoticeNotificationsGetResData
      >({
        url: ApiHost.resolve('/notice-notifications'),
        method: 'get',
      })

      setSubscriptions((prev) => {
        const next = prev.map((sub) => ({
          ...sub,
          isSubscribed: mySubscriptions.includes(sub.key),
        }))

        return next
      })

      setIsSyncing(false)
    }

    init()
  }, [isLoggedIn])

  async function onChangeSubscription(key: string) {
    setIsSyncing(true)

    const result = await eodiroRequest<
      ApiNoticeNotificationsSubscribeReqBody,
      ApiNoticeNotificationsSubscribeResData
    >({
      url: ApiHost.resolve('/notice-notifications'),
      method: 'post',
      data: {
        key,
      },
    })

    setSubscriptions((prev) => {
      const next = [...prev]
      const keyIndex = next.findIndex((sub) => sub.key === key)
      next[keyIndex].isSubscribed = result.subscribed

      return next
    })

    setIsSyncing(false)
  }

  return (
    <Body pageTitle="공지사항 알림" bodyClassName={$['app-body']}>
      <PageInfo
        title={{
          subject: '공지사항 알림',
        }}
        description="이제 더 이상 학교 공지사항을 놓치지 마세요."
      />

      <Link href="/notifications">
        <a>
          <p className={$['configure-notifications']}>실시간 알림 설정하기</p>
        </a>
      </Link>

      <h2 className={$['subtitle']}>더 이상 학교 공지사항을 놓치지 마세요.</h2>
      <p className={$['paragraph']}>
        어디로 공지사항 알림은 학교 홈페이지 곳곳에 올라오는 공지사항을 최대
        15분 이내에 어디로 앱을 통해 알려주는 기능입니다. 매번 새로운 공지사항을
        확인하기 위해 웹사이트를 들락날락할 필요가 없어지죠.
      </p>

      <div className={$['config-box']}>
        <h2 className={$['subtitle']}>
          알림 설정
          {!isLoggedIn && (
            <span>
              (<i className="f7-icons">lock_fill</i>
              <Link href={logInUrl}>
                <a>로그인</a>
              </Link>{' '}
              필요)
            </span>
          )}
        </h2>

        {subscriptions.map((noticeItem) => (
          <div key={noticeItem.key} className={$['notice-item']}>
            <input
              type="checkbox"
              id={`checkbox-${noticeItem.key}`}
              disabled={isSyncing || !isLoggedIn}
              checked={noticeItem.isSubscribed}
              onChange={() => onChangeSubscription(noticeItem.key)}
            />
            <label
              className={$['display-name']}
              htmlFor={`checkbox-${noticeItem.key}`}
            >
              {noticeItem.name}
            </label>
          </div>
        ))}
      </div>

      <hr />

      <h2 className={classNames($['subtitle'], $['more'])}>
        알림을 받고싶은 공지사항이 목록에 없거나 알림이 제대로 오지 않나요?
      </h2>
      <p className={$['paragraph']}>
        <a href="mailto:support@eodiro.com">support@eodiro.com</a>으로
        문의주시면 빠른 시일 내에 해결하겠습니다.
      </p>

      <h2 className={classNames($['subtitle'], $['more'])}>개발자이신가요?</h2>
      <p className={$['paragraph']}>
        JavaScript와 TypeScript, 그리고 HTML에 대한 약간의 지식만 있으면{' '}
        <a
          href="https://github.com/payw-org/eodiro-server/tree/master/src/modules/cau-notice-watcher"
          target="_blank"
          rel="noreferrer"
        >
          개발 가이드
        </a>
        를 따라 중앙대학교의 다양한 공지사항 알림을 직접 손쉽게 구축할 수
        있습니다. 다른 과의 공지사항 알림을 추가하고 친구들에게 뽐내보세요!
      </p>
    </Body>
  )
}

export default NoticeWatcher
