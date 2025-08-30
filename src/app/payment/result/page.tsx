"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // URL 파라미터에서 결제 결과 확인
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const code = searchParams.get("code");
    const error = searchParams.get("message");

    if (code || error) {
      // 결제 실패
      setSuccess(false);
      setMessage(error || "결제에 실패했습니다.");
      setLoading(false);
    } else if (paymentKey && orderId && amount) {
      // 결제 성공 - 서버에서 검증 필요
      verifyPayment(paymentKey, orderId, amount);
    } else {
      // 잘못된 접근
      setSuccess(false);
      setMessage("잘못된 접근입니다.");
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (
    paymentKey: string,
    orderId: string,
    amount: string
  ) => {
    try {
      // TODO: 실제 결제 검증 API 호출
      // const response = await fetch("/api/payment/verify", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ paymentKey, orderId, amount }),
      // });

      // 임시로 성공 처리
      setTimeout(() => {
        setSuccess(true);
        setMessage("결제가 성공적으로 완료되었습니다!");
        setLoading(false);
      }, 2000);
    } catch (error) {
      setSuccess(false);
      setMessage("결제 검증 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">결제 정보를 확인하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <div
        className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
          success ? "bg-mint/20" : "bg-orange/20"
        }`}
      >
        <span className="text-3xl">{success ? "✅" : "❌"}</span>
      </div>

      <h1
        className={`text-2xl font-bold mb-4 ${
          success ? "text-mint" : "text-orange"
        }`}
      >
        {success ? "결제 완료" : "결제 실패"}
      </h1>

      <p className="text-foreground/80 mb-8">{message}</p>

      <div className="space-y-3">
        <Link
          href="/me"
          className="block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          마이페이지로 가기
        </Link>

        {!success && (
          <Link
            href="/charge"
            className="block px-6 py-3 rounded-xl border border-accent/30 hover:bg-accent/10 transition"
          >
            다시 충전하기
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-20 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">페이지를 로딩하고 있습니다...</p>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
