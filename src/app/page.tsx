import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <main className="px-4 sm:px-6 lg:px-10">
        <section className="max-w-6xl mx-auto py-8 sm:py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-accent block sm:inline">무작위 영어 채팅으로 배우는</span>
              <span className="block flex items-center justify-center lg:justify-start gap-2 text-primary mt-1 sm:mt-0">
                <Image
                  src="/logo_without_text.png"
                  alt="MoisoTalk 로고"
                  width={40}
                  height={40}
                  className="sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-lg"
                />
                MoisoTalk
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-foreground/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
              버튼 한 번으로 랜덤 매칭되고, 실시간으로 영어만 사용해 대화해요.
              한국어 사용 시 포인트가 차감되고, 올-잉글리시로 마치면 보너스를
              받아요. 포인트는 언제든 충전할 수 있습니다!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
              <Link
                href="/signup"
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-primary text-primary-foreground text-sm sm:text-base font-medium hover:opacity-90 transition text-center shadow-lg"
              >
                지금 시작하기
              </Link>
              <Link
                href="/login"
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-accent/30 text-sm sm:text-base hover:bg-accent/10 transition text-center"
              >
                이미 계정이 있어요
              </Link>
              <Link
                href="/match"
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-mint/40 text-sm sm:text-base hover:bg-mint/10 transition text-center text-mint"
              >
                채팅 바로 시작
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/3] rounded-lg sm:rounded-xl border border-primary/20 overflow-hidden bg-gradient-to-br from-primary/5 to-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />
              <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 flex flex-col gap-2 sm:gap-3 lg:gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-base sm:text-lg">💬</span>
                  <span className="font-mono text-primary font-semibold">
                    Realtime
                  </span>
                </div>
                <div className="flex-1 rounded-lg border border-primary/15 p-2 sm:p-3 text-xs sm:text-sm bg-background/80">
                  <p className="opacity-80 mb-1">You: Hi! Where are you from?</p>
                  <p className="opacity-80 mb-1">Partner: I'm from Toronto. You?</p>
                  <p className="opacity-80">You: Seoul! Nice to meet you :)</p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
                  <div className="rounded-lg sm:rounded-xl border border-mint/30 bg-mint/10 p-1.5 sm:p-2 text-center text-mint font-medium">
                    Random Match
                  </div>
                  <div className="rounded-lg sm:rounded-xl border border-purple/30 bg-purple/10 p-1.5 sm:p-2 text-center text-purple font-medium">
                    Points
                  </div>
                  <div className="rounded-lg sm:rounded-xl border border-orange/30 bg-orange/10 p-1.5 sm:p-2 text-center text-orange font-medium">
                    English Only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-6 sm:py-8 lg:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Feature
            icon="🌍"
            title="랜덤 매칭"
            desc="대기열에서 두 명을 무작위 매칭. 바로 대화를 시작해요."
            color="mint"
          />
          <Feature
            icon="💬"
            title="실시간 채팅"
            desc="메시지가 즉시 동기화되어 매끄럽게 대화할 수 있어요."
            color="purple"
          />
          <Feature
            icon="🎯"
            title="포인트 규칙"
            desc="한국어 사용 시 -1, 올-잉글리시 완료 시 +2 보너스! 포인트 부족 시 언제든 충전 가능해요."
            color="orange"
          />
        </section>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
  color,
}: {
  icon: string;
  title: string;
  desc: string;
  color: "mint" | "purple" | "orange";
}) {
  const colorClasses = {
    mint: "border-mint/20 bg-mint/5 text-mint shadow-sm hover:shadow-md transition-all",
    purple:
      "border-purple/20 bg-purple/5 text-purple shadow-sm hover:shadow-md transition-all",
    orange:
      "border-orange/20 bg-orange/5 text-orange shadow-sm hover:shadow-md transition-all",
  };

  return (
    <div className={`rounded-lg sm:rounded-xl border p-3 sm:p-4 lg:p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl" aria-hidden>
          {icon}
        </span>
        <h3 className="font-semibold text-accent text-sm sm:text-base">{title}</h3>
      </div>
      <p className="text-xs sm:text-sm text-foreground/80">{desc}</p>
    </div>
  );
}
