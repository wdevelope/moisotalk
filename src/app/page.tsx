import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <main className="px-4 md:px-6 2xl:px-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto py-8 md:py-12 2xl:py-20 grid grid-cols-1 2xl:grid-cols-2 gap-8 2xl:gap-10 items-center">
          <div className="space-y-4 md:space-y-6 text-center 2xl:text-left">
            <h1 className="text-2xl md:text-4xl 2xl:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-accent block md:inline">
                무작위 영어 소개팅으로 만나는
              </span>
              <span className="block flex items-center justify-center 2xl:justify-start gap-2 text-primary mt-1 md:mt-0">
                <Image
                  src="/logo_without_text.png"
                  alt="MoisoTalk 로고"
                  width={40}
                  height={40}
                  className="md:w-12 md:h-12 2xl:w-14 2xl:h-14 drop-shadow-lg"
                />
                MoisoTalk
              </span>
            </h1>
            <p className="text-sm md:text-base 2xl:text-lg text-foreground/80 leading-relaxed max-w-lg mx-auto 2xl:mx-0">
              버튼 한 번으로 랜덤 매칭되고, 실시간으로 영어만 사용해 소개팅해요.
              한국어 사용 시 포인트가 차감되고, 올-잉글리시로 마치면 보너스를
              받아요. 포인트는 언제든 충전할 수 있습니다!
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 max-w-md mx-auto 2xl:mx-0">
              <Link
                href="/signup"
                className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-primary text-primary-foreground text-sm md:text-base font-medium hover:opacity-90 transition text-center shadow-lg"
              >
                지금 시작하기
              </Link>
              <Link
                href="/login"
                className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-accent/30 text-sm md:text-base hover:bg-accent/10 transition text-center"
              >
                이미 계정이 있어요
              </Link>
              <Link
                href="/match"
                className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-mint/40 text-sm md:text-base hover:bg-mint/10 transition text-center text-mint"
              >
                소개팅 바로 시작
              </Link>
            </div>
          </div>

          <div className="flex justify-center 2xl:justify-end">
            <div className="relative w-full max-w-[320px] md:max-w-[380px] 2xl:max-w-[420px] aspect-[4/3] rounded-lg md:rounded-xl border border-primary/20 overflow-hidden bg-gradient-to-br from-primary/5 to-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />
              <div className="absolute inset-0 p-3 md:p-4 2xl:p-6 flex flex-col gap-2 md:gap-3 2xl:gap-4">
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="text-base md:text-lg">💬</span>
                  <span className="font-mono text-primary font-semibold">
                    Realtime
                  </span>
                </div>
                <div className="flex-1 rounded-lg border border-primary/15 p-2 md:p-3 text-xs md:text-sm bg-background/80">
                  <p className="opacity-80 mb-1">
                    You: Hi! Where are you from?
                  </p>
                  <p className="opacity-80 mb-1">
                    Partner: I'm from Toronto. You?
                  </p>
                  <p className="opacity-80">You: Seoul! Nice to meet you :)</p>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs">
                  <div className="rounded-lg md:rounded-xl border border-mint/30 bg-mint/10 p-1.5 md:p-2 text-center text-mint font-medium">
                    Random Match
                  </div>
                  <div className="rounded-lg md:rounded-xl border border-purple/30 bg-purple/10 p-1.5 md:p-2 text-center text-purple font-medium">
                    Points
                  </div>
                  <div className="rounded-lg md:rounded-xl border border-orange/30 bg-orange/10 p-1.5 md:p-2 text-center text-orange font-medium">
                    English Only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto py-6 md:py-8 2xl:py-10 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
          <Feature
            icon="💕"
            title="랜덤 매칭"
            desc="대기열에서 두 명을 무작위 매칭. 바로 소개팅을 시작해요."
            color="mint"
          />
          <Feature
            icon="⚡"
            title="실시간 소개팅"
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
  } as const;

  return (
    <div
      className={`rounded-lg md:rounded-xl border p-3 md:p-4 2xl:p-6 ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
        <span className="text-xl md:text-2xl 2xl:text-3xl" aria-hidden>
          {icon}
        </span>
        <h3 className="font-semibold text-accent text-sm md:text-base 2xl:text-lg">
          {title}
        </h3>
      </div>
      <p className="text-xs md:text-sm 2xl:text-base text-foreground/80">
        {desc}
      </p>
    </div>
  );
}
