// 분양천국 대시보드로 리드 전송 (고객DB 적재 + 텔레그램/문자 알림은 대시보드가 처리).
// API 키를 브라우저에 노출하지 않기 위해 서버리스 함수에서 대신 호출한다.
async function sendToDashboard(lead) {
  const dashboardUrl = process.env.DASHBOARD_INTAKE_URL; // https://bunyang-dashboard.vercel.app/api/leads/intake
  const apiKey = process.env.DASHBOARD_API_KEY; // 힐스테이트 오송레이크센트럴 현장 전용 API 키

  if (!dashboardUrl || !apiKey) {
    throw new Error('DASHBOARD_INTAKE_URL 또는 DASHBOARD_API_KEY 환경변수가 없습니다.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(dashboardUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        pyeong_type: lead.type || null,
        message: lead.purpose ? `구매 목적: ${lead.purpose}` : null,
        utm_source: lead.utm_source || null,
        utm_medium: lead.utm_medium || 'landing_form',
        utm_campaign: lead.utm_campaign || null,
        utm_content: lead.utm_content || null,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const error = new Error(body.error || `Dashboard intake failed: ${response.status}`);
      error.status = response.status;
      throw error;
    }
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: '허용되지 않는 요청입니다.' });
  }

  try {
    const lead = normalizeLead(await readJsonBody(req));
    const validationError = validateLead(lead);

    if (validationError) {
      return res.status(400).json({ ok: false, error: validationError });
    }

    await sendToDashboard(lead);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Dashboard intake error:', error);
    // 대시보드가 입력값 문제(번호 형식, 차단 번호 등)로 거절한 경우 그 사유를 그대로 보여준다.
    const status = error.status === 400 || error.status === 403 ? 400 : 500;
    return res.status(status).json({
      ok: false,
      error: status === 400 ? error.message : '신청 접수 처리 중 오류가 발생했습니다.',
    });
  }
};

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body || '{}');
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(rawBody || '{}');
}

function normalizeLead(body) {
  return {
    name: sanitizeText(body.name),
    phone: sanitizeText(body.phone),
    type: sanitizeText(body.type),
    purpose: sanitizeText(body.purpose),
    privacy: body.privacy === true,
    utm_source: sanitizeText(body.utm_source),
    utm_medium: sanitizeText(body.utm_medium),
    utm_campaign: sanitizeText(body.utm_campaign),
    utm_content: sanitizeText(body.utm_content),
  };
}

function validateLead(lead) {
  if (!lead.name || !lead.phone) {
    return '이름과 연락처는 필수입니다.';
  }

  if (!lead.privacy) {
    return '개인정보 수집 및 이용 동의가 필요합니다.';
  }

  if (lead.name.length > 30 || lead.phone.length > 30) {
    return '입력값이 너무 깁니다.';
  }

  return '';
}

function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, 200);
}
