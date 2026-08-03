// في ملف src/lib/paymob-hmac.ts
import crypto from 'crypto'

export function verifyPaymobHmac(params: Record<string, string>): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET
  if (!hmacSecret || !params.hmac) return false

  // القيم المطلوبة بالترتيب الأبجدي الدقيق من Paymob
  const concatenatedString = [
    params.amount_cents || '',
    params.created_at || '',
    params.currency || '',
    params.error_occured || '',
    params.has_parent_transaction || '',
    params.id || '',
    params.integration_id || '',
    params.is_3d_secure || '',
    params.is_auth || '',
    params.is_capture || '',
    params.is_refunded || '',
    params.is_standalone_payment || '',
    params.is_voided || '',
    params.order || '',
    params.owner || '',
    params.pending || '',
    params['source_data.pan'] || params.source_data_pan || '',
    params['source_data.sub_type'] || params.source_data_sub_type || '',
    params['source_data.type'] || params.source_data_type || '',
    params.success || '',
  ].join('')

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex')

  return calculatedHmac.toLowerCase() === params.hmac.toLowerCase()
}