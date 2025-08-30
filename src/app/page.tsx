import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <main className="px-6 sm:px-10">
        <section className="max-w-6xl mx-auto py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              무작위 영어 채팅으로 배우는
              <span className="block flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="MoisoTalk 로고"
                  width={40}
                  height={40}
                />
                MoisoTalk
              </span>
            </h1>
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
              버튼 한 번으로 랜덤 매칭되고, 실시간으로 영어만 사용해 대화해요.
              한국어 사용 시 포인트가 차감되고, 올-잉글리시로 마치면 보너스를
              받아요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="px-5 py-3 rounded bg-foreground text-background text-sm sm:text-base font-medium hover:opacity-90 transition text-center"
              >
                지금 시작하기
              </Link>
              <Link
                href="/login"
                className="px-5 py-3 rounded border border-foreground/20 text-sm sm:text-base hover:bg-foreground/10 transition text-center"
              >
                이미 계정이 있어요
              </Link>
              <Link
                href="/match"
                className="px-5 py-3 rounded border border-foreground/20 text-sm sm:text-base hover:bg-foreground/10 transition text-center"
              >
                채팅 바로 시작
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-xl border border-foreground/15 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Image src="/window.svg" alt="chat" width={16} height={16} />
                  <span className="font-mono">Realtime</span>
                </div>
                <div className="flex-1 rounded-lg border border-foreground/15 p-3 text-sm">
                  <p className="opacity-80">You: Hi! Where are you from?</p>
                  <p className="opacity-80">Partner: I'm from Toronto. You?</p>
                  <p className="opacity-80">You: Seoul! Nice to meet you :)</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded border border-foreground/15 p-2 text-center">
                    Random Match
                  </div>
                  <div className="rounded border border-foreground/15 p-2 text-center">
                    Points
                  </div>
                  <div className="rounded border border-foreground/15 p-2 text-center">
                    English Only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon="/globe.svg"
            title="랜덤 매칭"
            desc="대기열에서 두 명을 무작위 매칭. 바로 대화를 시작해요."
          />
          <Feature
            icon="/window.svg"
            title="실시간 채팅"
            desc="메시지가 즉시 동기화되어 매끄럽게 대화할 수 있어요."
          />
          <Feature
            icon="/file.svg"
            title="포인트 규칙"
            desc="한국어 사용 시 -1, 올-잉글리시 완료 시 +2 보너스!"
          />
        </section>
      </main>

      <footer className="px-6 sm:px-10 py-10">
        <div className="max-w-6xl mx-auto text-sm text-foreground/60">
          © {new Date().getFullYear()} MoisoTalk
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-foreground/15 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Image src={icon} alt="" width={18} height={18} aria-hidden />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-foreground/80">{desc}</p>
    </div>
  );
}
