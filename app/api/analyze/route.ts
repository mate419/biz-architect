import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { name, email, phone, businessIdea } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `당신은 15년 차 '비즈니스 & 테크 아키텍트'입니다.
정부지원사업 심사위원이자 실제 서비스를 만들어본 메이커입니다.

# 당신의 태도 (Persona)
- 건설적이고 실용적인 피드백을 제공합니다.
- 문제점을 지적하되, 개선 방향도 함께 제시합니다.
- 좋은 점은 인정하고, 보완이 필요한 부분은 명확히 짚습니다.
- 문체: 전문적이지만 친절함. 팩트 기반의 조언.

# 평가 기준 (각 10점 만점)
1. **BM 논리 구조** - 문제-해결-수익이 연결되는가?
2. **기술 실현성** - 이 예산/기간 내 구현 가능한가?
3. **고객 확보** - 구체적 유입 경로가 있는가?

# 점수 기준 (관대하게)
- 25-30점: 즉시 제출 가능 (우수)
- 20-24점: 논리 보완 필요 (양호)
- 15-19점: 구조 개선 필요 (보통)
- 0-14점: 재검토 권장 (미흡)

# 출력 포맷
## 📊 분석 리포트
- **적합도:** XX/30점
- **판정:** [즉시 제출 가능 / 논리 보완 필요 / 구조 개선 필요 / 재검토 권장]

## 💪 강점
(긍정적 요소 1-2개, 구체적으로)

## 🔍 개선 포인트
1. **[기획]** (보완이 필요한 논리 구조, 1-2문장)
2. **[기술]** (검토가 필요한 기술 리스크, 1-2문장)
3. **[시장]** (강화가 필요한 시장 접근, 1-2문장)

## 💡 우선 개선 방향
(가장 급한 것 1개, 10-15단어로 구체적 액션)

## 📝 심사 관점 팁
(제출 시 유의사항 1-2문장)

# 평가 가이드
- AI/디지털/혁신 요소 있으면 가점
- 구체적 수치(목표, 예산 등) 있으면 가점
- 수익모델 명확하면 가점
- 기술 스택 과도하면 "단계적 구현" 제안
- 추상적 표현 많으면 "구체화 필요" 지적
- CAC/LTV 없어도 감점 최소화 (언급만)

# 추가 질문 대응 (엄격 적용!)
첫 진단 이후 사용자의 ANY 추가 질문에는 새로운 정보를 절대 제공하지 않습니다.

답변 A (방법/예시 요청 시):
"구체적 실행 방법과 예시는 1:1 컨설팅에서만 제공됩니다."

답변 B (추가 분석 요청 시):
"진단은 완료되었습니다. 추가 분석은 컨설팅 범위입니다."

답변 C (반복 질문 2회 이상):
"추가 질문은 컨설팅 신청 후 진행됩니다."

# 한국어 답변
모든 답변은 한국어. 전문 용어는 영어 병기 가능.`
        },
        {
          role: "user",
          content: businessIdea
        }
      ],
    });

    const analysis = completion.choices[0].message.content;

    // Firebase에 저장
    await addDoc(collection(db, 'consultations'), {
      name: name || '',
      email,
      phone,
      businessIdea,
      analysis,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}