## 영어 학습용 무작위 채팅 사이트 개발 계획서

### 프로젝트 개요

- **목표:** 사용자들이 무작위로 매칭되어 영어로만 대화하며 언어 능력을 향상시키는 웹 애플리케이션 개발
- **주요 기술 스택:**
  - **프레임워크:** Next.js (App Router 기반)
  - **데이터베이스 및 백엔드:** Supabase
  - **배포:** Vercel
  - **UI/스타일링:** Tailwind CSS

### 데이터베이스 추천: Supabase

Firebase와 Supabase 모두 훌륭한 BaaS (Backend-as-a-Service)이지만, 이번 프로젝트에는 **Supabase**를 추천합니다.

- **관계형 데이터베이스:** Supabase는 PostgreSQL을 기반으로 하여 명확한 관계 설정이 필요한 사용자(Users), 포인트(Points), 채팅방(Chat Rooms) 등의 데이터를 구조적으로 관리하기에 더 직관적입니다.
- **실시간 통신:** 채팅 기능 구현에 필수적인 실시간(Realtime) 기능을 기본적으로 제공하며, 구독(Subscription) 모델을 통해 쉽게 구현할 수 있습니다.
- **Vercel과의 시너지:** Next.js와 Vercel 생태계와 매우 잘 통합되어 있어 개발 및 배포 과정이 매끄럽습니다.

---

### 단계별 개발 계획 (LLM 지시용)

#### 1단계: 프로젝트 초기 설정 및 데이터베이스 스키마 설계

1.  **Supabase 데이터베이스 테이블 설계:**
    - **users:** Supabase의 기본 `auth.users` 테이블을 활용하고, 추가 정보(닉네임, 성별, 나이대)를 저장할 `profiles` 테이블을 생성하여 연결합니다.
      - `id` (UUID, Foreign Key to `auth.users.id`, Primary Key)
      - `nickname` (text, unique)
      - `gender` (text)
      - `age_group` (text)
      - `points` (integer, default: 100)
    - **chat_rooms:** 매칭된 두 사용자 간의 채팅방 정보를 저장합니다.
      - `id` (UUID, Primary Key)
      - `created_at` (timestamp)
      - `is_active` (boolean, default: true)
    - **chat_participants:** 채팅방에 어떤 사용자가 참여하는지 기록합니다.
      - `room_id` (Foreign Key to `chat_rooms.id`)
      - `user_id` (Foreign Key to `profiles.id`)
    - **messages:** 채팅 메시지를 저장합니다.
      - `id` (bigint, Primary Key)
      - `room_id` (Foreign Key to `chat_rooms.id`)
      - `sender_id` (Foreign Key to `profiles.id`)
      - `content` (text)
      - `created_at` (timestamp)

#### 2단계: 사용자 인증 및 프로필 기능 구현

1.  **회원가입 페이지 구현:**

    - 닉네임, 이메일(로그인용), 비밀번호, 성별, 나이대 입력을 위한 UI를 구현합니다.
    - Supabase Auth의 `signUp` 메소드를 사용하여 사용자 인증 정보를 `auth.users`에 저장합니다.
    - 회원가입 성공 시, `profiles` 테이블에 닉네임, 성별, 나이대 정보를 추가하고 기본 포인트 100점을 부여하는 로직을 RLS(Row Level Security) 또는 Function으로 구현합니다.

2.  **로그인 및 로그아웃 기능 구현:**
    - 이메일과 비밀번호로 로그인하는 UI와 기능을 Supabase Auth를 이용해 구현합니다.
    - 로그아웃 기능을 구현하고, 사용자의 인증 상태를 전역적으로 관리합니다. (React Context API 또는 Zustand 사용 추천)

#### 3단계: 실시간 채팅 및 매칭 시스템 구현

1.  **대기열 및 매칭 로직 설계:**

    - "채팅 시작" 버튼을 누른 사용자를 '대기 상태'로 만듭니다. (예: `profiles` 테이블에 `status` 컬럼 추가 또는 별도 'waiting_pool' 테이블 생성)
    - 백엔드 로직 (Supabase Edge Function)을 사용하여 주기적으로 대기 중인 사용자가 2명 이상인지 확인하고, 무작위로 2명을 매칭시킵니다.
    - 매칭이 성사되면, 두 사용자를 위한 새로운 `chat_rooms` 레코드를 생성하고, `chat_participants`에 두 사용자를 추가합니다.

2.  **채팅방 UI 구현:**

    - 메시지 입력창, 전송 버튼, 대화 내용이 표시될 스크롤 영역을 포함한 채팅 UI를 컴포넌트로 만듭니다.
    - 채팅창 상단에 상대방의 닉네임, 성별, 나이대가 표시되도록 구현합니다.

3.  **실시간 메시지 전송 및 수신 구현:**
    - Supabase Realtime Subscriptions를 사용하여 `messages` 테이블의 변경 사항(새 메시지 추가)을 실시간으로 감지하도록 설정합니다.
    - 사용자가 메시지를 전송하면 `messages` 테이블에 데이터를 삽입하고, 구독(Subscription)을 통해 상대방의 채팅창에 즉시 메시지가 나타나도록 합니다.

#### 4단계: 포인트 시스템 및 언어 감지 기능 구현

1.  **언어 감지 로직:**

    - 사용자가 메시지를 입력할 때, 한글 자모가 포함되어 있는지 정규식(Regex)을 사용하여 클라이언트 단에서 1차적으로 검사합니다.
    - 메시지 전송 시, Next.js API Route 또는 Supabase Edge Function에서 해당 메시지에 한글이 포함되어 있는지 최종 확인합니다.
    - 한글이 감지되면 해당 사용자의 `profiles` 테이블에서 `points`를 1점 차감합니다.

2.  **포인트 관리 및 채팅 제한:**
    - 사용자의 포인트가 0 이하가 되면 메시지 입력창을 비활성화하고, "포인트가 부족합니다. 충전 후 이용해주세요."와 같은 안내 메시지를 표시합니다.
    - 채팅 종료 (한쪽이 나가거나, 정상 종료) 시, 대화 내용 전체에 한글 사용 기록이 없으면 양쪽 사용자 모두에게 2 포인트를 추가하는 로직을 구현합니다.

#### 5단계: 결제 기능 연동 및 배포

1.  **포인트 충전 페이지 구현:**

    - 충전할 포인트 상품(예: 100포인트 - 1,000원)을 선택할 수 있는 UI를 만듭니다.

2.  **결제 게이트웨이 연동:**

    - 포트원(Portone)이나 토스페이먼츠 같은 국내 결제 PG 또는 스트라이프(Stripe)를 연동합니다.
    - 클라이언트에서 결제 요청을 보내고, 결제가 성공적으로 완료되면 PG사로부터 받은 정보를 서버로 전송합니다.

3.  **결제 검증 및 포인트 업데이트 (Webhook):**

    - Supabase Edge Function을 사용하여 Webhook 엔드포인트를 생성합니다.
    - 결제 서비스 측에서 결제가 완료되면 이 Webhook으로 알림을 보냅니다.
    - Webhook 핸들러는 결제 정보의 유효성을 검증한 후, 해당 사용자의 `profiles` 테이블 `points`를 충전된 만큼 업데이트합니다.

4.  **Vercel 배포:**
    - GitHub 레포지토리를 Vercel 프로젝트에 연결합니다.
    - Supabase 관련 환경 변수(URL, Anon Key, Service Role Key 등)를 Vercel 프로젝트 설정에 등록합니다.
    - Git push를 통해 자동 배포를 설정하고 최종 서비스를 배포합니다.
