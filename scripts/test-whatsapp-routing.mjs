import assert from 'node:assert';
import { normalizeWhatsAppPhone, formatPhoneDisplay, generateWhatsAppBuyUrl, generateWhatsAppQuestionUrl } from '../app/utils/whatsapp.js';

console.log('Testing WhatsApp routing logic...');

// Test 1: Normalization of 10-digit phone
assert.strictEqual(normalizeWhatsAppPhone('9876543210'), '919876543210');
assert.strictEqual(normalizeWhatsAppPhone('+91 98765 43210'), '919876543210');
assert.strictEqual(normalizeWhatsAppPhone('09876543210'), '919876543210');
assert.strictEqual(normalizeWhatsAppPhone('919876543210'), '919876543210');
assert.strictEqual(normalizeWhatsAppPhone('+1 415 555 2671'), '14155552671');
console.log('✓ normalizeWhatsAppPhone works for all formats');

// Test 2: Formatting for display
assert.strictEqual(formatPhoneDisplay('919876543210'), '+91 98765 43210');
assert.strictEqual(formatPhoneDisplay('9876543210'), '+91 98765 43210');
console.log('✓ formatPhoneDisplay works');

// Test 3: Buy URL generation with updated phone
const updatedPhone = '9988776655';
const buyUrl = generateWhatsAppBuyUrl({
  sellerPhone: updatedPhone,
  requestNumber: '#1099',
  requestUrl: 'https://missmalli.in/r/req_1099',
  items: [
    {
      name: 'Pure Kanjivaram Silk Saree',
      code: 'KANJI-01',
      variantDetails: 'Crimson Red · With blouse',
      price: 8499,
    }
  ],
  totalAmount: 8499,
});

assert(buyUrl.startsWith('https://wa.me/919988776655?text='), 'Buy URL must route to updated normalized phone');
console.log('✓ generateWhatsAppBuyUrl routes to updated phone');

// Test 4: Question URL generation
const questionUrl = generateWhatsAppQuestionUrl(updatedPhone, 'Rani Pink Silk Saree', 'KANJI-01');
assert(questionUrl.startsWith('https://wa.me/919988776655?text='), 'Question URL must route to updated normalized phone');
console.log('✓ generateWhatsAppQuestionUrl routes to updated phone');

console.log('All WhatsApp routing tests passed successfully!');
