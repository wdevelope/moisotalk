export default function SignupSuccessPage() {
  return (
    <div className="max-w-md mx-auto py-10 md:py-16 px-4 md:px-6 font-sans text-foreground">
      <div className="bg-surface rounded-lg md:rounded-xl border border-primary/20 p-6 md:p-8 shadow-md text-center">
        <div className="text-2xl md:text-3xl font-bold text-accent mb-3">
          회원가입 완료
        </div>
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
          가입이 완료되었습니다. 이메일로 전송된 인증 메일을 확인하고 인증을
          완료해 주세요.
          <br />
          이메일 인증이 완료된 후 서비스 이용이 가능합니다.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href="/login"
            className="w-full bg-primary text-primary-foreground py-2.5 md:py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm md:text-base"
          >
            로그인 페이지로 이동
          </a>
          <a
            href="/"
            className="w-full text-center border border-accent/30 text-accent py-2.5 md:py-3 rounded-lg hover:bg-accent/10 transition text-sm md:text-base"
          >
            홈으로
          </a>
        </div>
      </div>
    </div>
  );
}
