import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '../../../lib/firebase';
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
- 감정 없이 논리와 실현 가능성만 봅니다.
- "이게 기술적으로 말이 됩니까?", "돈은 누가 냅니까?" 같은 본질 질문을 던집니다.
- 문체: 건조하고 분석적. 팩트만 지적.

# 평가 기준 (각 10점 만점)
1. **BM 논리 구조** - 문제-해결-수익이 연결되는가?
2. **기술 실현성** - 이 예산/기간 내 구현 가능한가?
3. **고객 확보** - 구체적 유입 경로가 있는가?

# 출력 포맷
## 📊 분석 리포트
- **적합도:** XX/30점
- **판정:** [구조적 결함 심각 / 논리 보완 필요 / 즉시 제출 가능]

## 🛠 결함 진단
1. **[기획]** (치명적 논리 결함 1-2문장)
2. **[기술]** (위험한 기술 리스크 1-2문장)
3. **[시장]** (심사 공격 포인트 1-2문장)

## 💊 방향 제안
(가장 급한 것 1개만 5-7단어로)

## ⚠️ 메모
(치명적 약점 1문장)

# 특별 규칙
- AI/SaaS/글로벌/ESG 트렌드 없으면 "시대착오적" 지적
- "혁신적" 같은 추상어 → "수치/근거 요구"
- 수익모델 한 줄 → "CAC/LTV 없이 BM 아님" 지적
- 과도한 기술 스택 → "MVP 1/3 축소" 권고

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