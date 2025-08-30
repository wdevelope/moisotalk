"use client";

import { useState, useEffect } from "react";
import { getBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type PointPackage = {
  id: string;
  points: number;
  price: number;
  bonus?: number;
  popular?: boolean;
};

const pointPackages: PointPackage[] = [
  {
    id: "basic",
    points: 100,
    price: 1000,
  },
  {
    id: "standard",
    points: 300,
    price: 2700,
    bonus: 30,
    popular: true,
  },
  {
    id: "premium",
    points: 500,
    price: 4000,
    bonus: 100,
  },
  {
    id: "ultimate",
    points: 1000,
    price: 7000,
    bonus: 300,
  },
];

export default function ChargePage() {
  const supabase = getBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentPoints, setCurrentPoints] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // 현재 포인트 조회
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      if (profile) {
        setCurrentPoints(profile.points);
      }
    }
    getUser();
  }, [supabase, router]);

  const handlePayment = async () => {
    if (!selectedPackage || !user) return;

    setLoading(true);
    try {
      // TODO: 토스페이먼츠 연동 로직 구현
      alert(
        `결제 연동 준비 중입니다.\n선택한 상품: ${
          selectedPackage.points
        }포인트 (${selectedPackage.price.toLocaleString()}원)`
      );
    } catch (error) {
      console.error("Payment error:", error);
      alert("결제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <p>로그인이 필요합니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-accent mb-3 sm:mb-4">포인트 충전</h1>
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-surface border border-primary/20">
          <span className="text-xs sm:text-sm text-foreground/70">현재 보유 포인트:</span>
          <span className="text-base sm:text-lg font-semibold text-primary">
            {currentPoints.toLocaleString()}P
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {pointPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg)}
            className={`relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${
              selectedPackage?.id === pkg.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-foreground/20 hover:border-primary/50 hover:shadow-md"
            } ${pkg.popular ? "ring-2 ring-mint/50" : ""}`}
          >
            {pkg.popular && (
              <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-2 sm:px-3 py-1 bg-mint text-white text-xs font-medium rounded-full">
                  인기
                </span>
              </div>
            )}

            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-accent mb-1 sm:mb-2">
                {pkg.points.toLocaleString()}P
              </div>
              {pkg.bonus && (
                <div className="text-xs sm:text-sm text-mint font-medium mb-1 sm:mb-2">
                  +{pkg.bonus}P 보너스!
                </div>
              )}
              <div className="text-lg sm:text-xl font-semibold text-primary">
                {pkg.price.toLocaleString()}원
              </div>
              {pkg.bonus && (
                <div className="text-xs text-foreground/60 mt-1">
                  총 {(pkg.points + pkg.bonus).toLocaleString()}P 획득
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="bg-surface rounded-lg sm:rounded-xl p-4 sm:p-6 border border-primary/20 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-accent mb-3 sm:mb-4">결제 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">상품:</span>
              <span className="font-medium">
                {selectedPackage.points.toLocaleString()}포인트
              </span>
            </div>
            {selectedPackage.bonus && (
              <div className="flex justify-between">
                <span className="text-foreground/70">보너스:</span>
                <span className="font-medium text-mint">
                  +{selectedPackage.bonus.toLocaleString()}포인트
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-semibold pt-2 border-t border-foreground/10">
              <span>총 결제 금액:</span>
              <span className="text-primary">
                {selectedPackage.price.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handlePayment}
          disabled={!selectedPackage || loading}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg text-sm sm:text-base"
        >
          {loading
            ? "처리 중..."
            : selectedPackage
            ? `${selectedPackage.price.toLocaleString()}원 결제하기`
            : "상품을 선택해주세요"}
        </button>

        <div className="mt-4 text-xs text-foreground/60 space-y-1 px-4">
          <p>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.</p>
          <p>• 결제 완료 후 포인트는 즉시 충전됩니다.</p>
          <p>• 문의사항이 있으시면 고객센터로 연락해주세요.</p>
        </div>
      </div>
    </div>
  );
}
