import React, { useEffect, useState } from 'react'

import $ from './style.module.scss'
import Body from '@/layouts/BaseLayout/Body'
import EodiroColors from '@/modules/styles/EodiroColors'
import EodiroLink from '@/components/utils/EodiroLink'
import Grid from '@/layouts/Grid'
import LiveEntrance from './LiveEntrance'
import classNames from 'classnames'

type HomeFeatureBoxProps = {
  title: string
  to: string
  Icon: JSX.Element
  label?: 'new' | 'update' | 'beta'
}

const HomeFeatureBox: React.FC<HomeFeatureBoxProps> = ({
  title,
  to,
  Icon,
  label,
}) => {
  return (
    <button className={$['feature-box']}>
      <div className={$['wrapper']}>
        {Icon}
        <h2 className={$['feature-name']}>{title}</h2>
        <EodiroLink href={to} absolute />

        {label !== undefined && (
          <span className={$['label']}>{label.toUpperCase()}</span>
        )}
      </div>
    </button>
  )
}

const Main: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const documentFonts = (document as any).fonts

    if (!documentFonts) {
      setTimeout(() => {
        setAnimate(true)
      }, 200)
    } else {
      documentFonts.ready.then(() => {
        setAnimate(true)
      })
    }
  }, [])

  return (
    <Body pageTitle="어디로" titleHidden centered>
      <div id={$['eodiro-home']}>
        <h1
          className={classNames(
            $['header'],
            `overlay-sentinel-spot title-sentinel-spot`
          )}
        >
          <div
            className={classNames($['text-wrapper'], animate && $['animate'])}
            onAnimationEnd={() => {
              setIsAnimated(true)
            }}
          >
            <span
              className={classNames($['name'], isAnimated && $['shadowed'])}
            >
              어디로
            </span>
          </div>
        </h1>
        <p className={$['manifesto']}>
          <span className={classNames($['text'], animate && $['animate'])}>
            중앙대 학생들만을 위한 길잡이 서비스
          </span>
        </p>

        <LiveEntrance />

        <div className={$['features']}>
          <Grid>
            <HomeFeatureBox
              title="빈 강의실"
              to="/vacant"
              Icon={
                <i
                  className={classNames('f7-icons', $['icon'])}
                  style={{
                    color: EodiroColors.primary,
                  }}
                >
                  squares_below_rectangle
                </i>
              }
            />
            <HomeFeatureBox
              title="강의 검색"
              to="/lectures"
              Icon={
                <i
                  className={classNames('f7-icons', $['icon'])}
                  style={{
                    color: EodiroColors.grass1,
                  }}
                >
                  doc_text_search
                </i>
              }
            />
            <HomeFeatureBox
              title="학교 공지사항 알림"
              to="/notice-notifications"
              Icon={
                <i
                  className={classNames('f7-icons', $['icon'])}
                  style={{
                    color: EodiroColors.yellow2,
                  }}
                >
                  app_badge
                </i>
              }
              label="beta"
            />
            <HomeFeatureBox
              title="학식 메뉴"
              to="/cafeteria"
              Icon={
                <i
                  className={classNames('f7-icons', $['icon'])}
                  style={{
                    color: EodiroColors.blue1,
                  }}
                >
                  square_list
                </i>
              }
            />
            <HomeFeatureBox
              title="꿀팁"
              to="/tips"
              Icon={
                <i
                  className={classNames('f7-icons', $['icon'])}
                  style={{
                    color: EodiroColors.pink1,
                  }}
                >
                  lightbulb
                </i>
              }
              label="beta"
            />
            <HomeFeatureBox
              title="오픈 소스"
              to="/opensource"
              Icon={
                <i
                  className={classNames('f7-icons', $['icon'])}
                  style={{
                    color: EodiroColors.purple1,
                  }}
                >
                  heart
                </i>
              }
            />
          </Grid>
        </div>

        <svg
          id="e8806aae-1dd3-4f44-829b-8bd04a0ec3ea"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          width="896"
          height="529.1129"
          viewBox="0 0 896 529.1129"
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '30rem',
            margin: 'auto',
            marginTop: '4rem',
          }}
        >
          <path
            d="M832.06729,623.22778s-26.37759,9.89441-38.806,32.94348S787.06,706.69574,787.06,706.69574s26.37759-9.89447,38.806-32.94348S832.06729,623.22778,832.06729,623.22778Z"
            transform="translate(-158 -185.8871)"
            fill="#3f3d56"
          />
          <path
            d="M867.5,657.59637s-8.64182,26.814-31.0802,40.31373-50.17651,8.57293-50.17651,8.57293,8.64175-26.81408,31.08017-40.31378S867.5,657.59637,867.5,657.59637Z"
            transform="translate(-158 -185.8871)"
            fill="#ff3852"
          />
          <rect y="527.1129" width="896" height="2" fill="#2f2e41" />
          <path
            d="M519.87238,620.97461a95.44448,95.44448,0,0,1-35.748-14.44629L485.306,604.915a93.36283,93.36283,0,0,0,34.999,14.10547c18.93164,3.40137,47.26075,1.73144,74.707-25.52735,53.41358-53.04785,104.39307-58.39062,104.90186-58.43847l.18652,1.99219c-.50146.04687-50.76806,5.31738-103.67822,57.86621-21.61328,21.46386-43.792,27.40234-61.71777,27.40234A83.49962,83.49962,0,0,1,519.87238,620.97461Z"
            transform="translate(-158 -185.8871)"
            fill="#2f2e41"
          />
          <circle cx="515.15271" cy="381.1129" r="12" fill="#2f2e41" />
          <circle cx="430.15271" cy="437.1129" r="12" fill="#2f2e41" />
          <path
            d="M841.5,714s-17.46191-5.41315-52.26129-10.84192L790,692.5c6-60-34-150-34-150a401.561,401.561,0,0,1,21.4693,139.0246C772.13214,672.2124,761.82056,662.16638,742,656c0,0,25.77765,22.106,33.15918,45.10175a997.84042,997.84042,0,0,0-102.02258-8.21589L682,672.5l-17,17s-7-51-22-53l11,50s-13-10-16-9l7.39746,14.79486c-49.819-.51654-109.08453,1.7356-177.76581,8.95227L476,682l-17,17s-7-51-22-53l11,50s-13-10-16-9l8.64288,17.28583Q406.9763,708.2897,370.5,714Z"
            transform="translate(-158 -185.8871)"
            fill="#3f3d56"
          />
          <path
            d="M565.64813,230.37817c-10.89964,11.74783,17.59745,40.25959,17.59745,40.25959s-57.70662,9.73051-53.12783,9.14083,2.20622-49.13151,2.20622-49.13151S576.54777,218.63035,565.64813,230.37817Z"
            transform="translate(-158 -185.8871)"
            fill="#a0616a"
          />
          <path
            d="M605.81236,356.10945l-50.139,25.6141-27.22969,15.6059s-32.09862,40.43116-38.08709,64.39234,25.92963,68.247,29.54371,72.82286a54.36088,54.36088,0,0,1,4.98908,7.42355c1.24727,1.85589,12.02944-.541,23.80342-3.06554S547.13,518.93875,547.13,518.93875s-15.02732-38.39505-16.14686-39.25912c-1.04554-.807-4.60093-7.44631-2.04309-10.35234a25.94993,25.94993,0,0,0,5.44489-8.89825,30.09064,30.09064,0,0,1,4.18709-7.94151s45.361-36.83645,59.52776-49.37835,51.82952-4.65839,51.82952-4.65839-17.78167,68.20027-22.22979,72.80616-4.929,8.70085-2.91535,16.50759,28.28157.39078,28.28157.39078L662.766,461.6996s15.74879-34.2925,24.29946-69.67451c4.27533-17.691-3.88828-28.23462-13.12073-34.35549a41.39094,41.39094,0,0,0-30.02983-5.97766l-46.34848,8.1308,32.14706-13.84923Z"
            transform="translate(-158 -185.8871)"
            fill="#2f2e41"
          />
          <path
            d="M420.87777,290.19133,361.02366,271.685s-24.179-31.16689-12.78824-36.6669,25.65172,26.94419,25.65172,26.94419l41.686,2.69751Z"
            transform="translate(-158 -185.8871)"
            fill="#a0616a"
          />
          <path
            d="M672.49431,257.78673l53.2121-33.06768s15.49333-36.27612,3.0807-38.71059-17.98787,32.56435-17.98787,32.56435l-39.64232,13.17143Z"
            transform="translate(-158 -185.8871)"
            fill="#a0616a"
          />
          <path
            d="M682.45318,220.40023l1.01427,39.19147-89.68779,16.025c13.19231,28.22441,9.84118,60.34675,43.04725,74.4259L524.9027,404.78717c4.9871-43.03806-15.81748-75.456-35.263-115.75876-23.68547-8.58589-51.19594-2.29078-80.33649,10.34619l-5.237-40.66416,123.87841-8.896,20.34848,7.77932,21.81842-9.17677C602.17891,238.88953,648.22076,220.77584,682.45318,220.40023Z"
            transform="translate(-158 -185.8871)"
            fill="#ff3852"
          />
          <path
            d="M626.64006,486.51727c-2.72,2.36681-5.25213,21.84984-5.34982,28.92023s9.21178,8.89624,14.29855,9.2494,4.47816,3.45631,7.83678,6.04854,14.39625,2.179,28.89019-2.71238-9.75274-20.92568-11.86409-21.662-11-22.78156-11-22.78156S629.36,484.15046,626.64006,486.51727Z"
            transform="translate(-158 -185.8871)"
            fill="#2f2e41"
          />
          <path
            d="M547.368,531.00717c3.23089,1.60043,10.61681,19.80614,12.50274,26.62107s-6.65716,10.93994-11.48848,12.5704-3.45631,4.47816-6.04855,7.83678-13.3744,5.75546-28.63472,4.696,4.13258-22.71391,5.98847-23.96118,4.86893-24.82526,4.86893-24.82526S544.13715,529.40674,547.368,531.00717Z"
            transform="translate(-158 -185.8871)"
            fill="#2f2e41"
          />
          <circle cx="389.47074" cy="35.42904" r="23.99585" fill="#a0616a" />
          <path
            d="M519.73448,218.90923a22.82668,22.82668,0,0,1-.83378-18.59281c2.35891-5.8153,7.59174-11.65569,18.87309-13.4,24.61387-3.80572,37.71267,13.43543,37.02452,19.07449s-3.99294,19.27051-3.99294,19.27051,1.47587-12.90619-4.85883-13.362-30.90178-2.37835-37.12217,4.145a14.23268,14.23268,0,0,0-3.71042,13.82977Z"
            transform="translate(-158 -185.8871)"
            fill="#2f2e41"
          />
        </svg>
      </div>
    </Body>
  )
}

export default Main
