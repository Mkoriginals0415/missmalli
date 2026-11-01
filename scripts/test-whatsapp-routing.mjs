import assert from 'node:assert';
import {
  normalizeWhatsAppPhone,
  formatPhoneDisplay,
  toAbsoluteImageUrl,
  generateWhatsAppBuyMessage,
  generateWhatsAppBuyUrl,
  generateWhatsAppQuestionUrl,
} from '../app/utils/whatsapp.ts';

console.log('Testing clean WhatsApp routing & message generation (NO raw image URLs)...');

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

// Test 3: Absolute image URL conversion
assert.strictEqual(toAbsoluteImageUrl('https://res.cloudinary.com/demo/image/upload/sample.jpg'), 'https://res.cloudinary.com/demo/image/upload/sample.jpg');
assert.strictEqual(toAbsoluteImageUrl('/uploads/saree-red.jpg'), 'https://missmalli.in/uploads/saree-red.jpg');
console.log('✓ toAbsoluteImageUrl works for relative and absolute URLs');

// Test 4: Single-item message MUST NOT contain image URL
const singlePayload = {
  sellerPhone: '9988776655',
  requestNumber: '#1099',
  requestUrl: 'https://missmalli.in/r/req_1099',
  items: [
    {
      name: 'Pure Kanjivaram Silk Saree',
      code: 'KANJI-01',
      variantDetails: 'Crimson Red · With blouse',
      price: 8499,
      imageUrl: '/uploads/kanji-01.jpg',
    }
  ],
  totalAmount: 8499,
};

const singleMsg = generateWhatsAppBuyMessage(singlePayload);
assert(!singleMsg.includes('uploads/kanji-01.jpg'), 'Single item message must NOT contain raw image URL');
assert(!singleMsg.includes('📸'), 'Single item message must NOT contain camera emoji or photo URL label');
assert(singleMsg.includes('Pure Kanjivaram Silk Saree'), 'Must contain product name');
assert(singleMsg.includes('https://missmalli.in/r/req_1099'), 'Must contain order tracking link for meta preview card');

const buyUrl = generateWhatsAppBuyUrl(singlePayload);
assert(buyUrl.startsWith('https://wa.me/919988776655?text='), 'Buy URL must route to updated normalized phone');
const decodedSingleText = decodeURIComponent(buyUrl.replace('https://wa.me/919988776655?text=', ''));
assert(!decodedSingleText.includes('uploads/kanji-01.jpg'), 'Decoded single URL must not contain image path');
console.log('✓ Single-item buy message is clean with zero raw image URLs');

// Test 5: Multi-item buy message MUST NOT contain image URLs
const multiPayload = {
  sellerPhone: '9988776655',
  requestNumber: '#2048',
  requestUrl: 'https://missmalli.in/r/req_2048',
  items: [
    {
      name: 'Banarasi Katan Silk Saree',
      code: 'BAN-02',
      variantDetails: 'Royal Navy',
      price: 12500,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
    },
    {
      name: 'Tussar Georgette Drape',
      code: 'TUS-05',
      variantDetails: 'Honey Gold',
      price: 6800,
      imageUrl: '/uploads/tussar.jpg',
    }
  ],
  totalAmount: 19300,
};

const multiMsg = generateWhatsAppBuyMessage(multiPayload);
assert(!multiMsg.includes('unsplash.com'), 'Multi-item message must NOT contain first image URL');
assert(!multiMsg.includes('uploads/tussar.jpg'), 'Multi-item message must NOT contain second image URL');
assert(!multiMsg.includes('📸'), 'Multi-item message must NOT contain photo URL label');
assert(multiMsg.includes('1. *Banarasi Katan Silk Saree*'), 'Must contain first item name');
assert(multiMsg.includes('2. *Tussar Georgette Drape*'), 'Must contain second item name');

const multiBuyUrl = generateWhatsAppBuyUrl(multiPayload);
const decodedMultiText = decodeURIComponent(multiBuyUrl.replace('https://wa.me/919988776655?text=', ''));
assert(!decodedMultiText.includes('unsplash.com'), 'Decoded multi URL must not contain first image URL');
assert(!decodedMultiText.includes('tussar.jpg'), 'Decoded multi URL must not contain second image URL');
console.log('✓ Multi-item buy message is clean with zero raw image URLs');

// Test 6: Question URL generation
const questionUrl = generateWhatsAppQuestionUrl('9988776655', 'Rani Pink Silk Saree', 'KANJI-01');
assert(questionUrl.startsWith('https://wa.me/919988776655?text='), 'Question URL must route to updated normalized phone');
console.log('✓ generateWhatsAppQuestionUrl routes to updated phone');

console.log('All clean WhatsApp routing tests passed successfully!');
