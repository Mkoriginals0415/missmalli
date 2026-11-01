import assert from 'node:assert';
import { normalizeWhatsAppPhone, formatPhoneDisplay, toAbsoluteImageUrl, generateWhatsAppBuyUrl, generateWhatsAppQuestionUrl } from '../app/utils/whatsapp.ts';

console.log('Testing WhatsApp routing & message generation logic...');

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

// Test 4: Buy URL generation with updated phone and image URL
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
      imageUrl: '/uploads/kanji-01.jpg',
    }
  ],
  totalAmount: 8499,
});

assert(buyUrl.startsWith('https://wa.me/919988776655?text='), 'Buy URL must route to updated normalized phone');
const decodedText = decodeURIComponent(buyUrl.replace('https://wa.me/919988776655?text=', ''));
assert(decodedText.includes('📸 Drape Photo: https://missmalli.in/uploads/kanji-01.jpg'), 'Decoded message must include Drape Photo absolute URL');
console.log('✓ generateWhatsAppBuyUrl includes drape image URL for single item');

// Test 5: Multi-item buy URL with photos
const multiBuyUrl = generateWhatsAppBuyUrl({
  sellerPhone: updatedPhone,
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
});
const decodedMultiText = decodeURIComponent(multiBuyUrl.replace('https://wa.me/919988776655?text=', ''));
assert(decodedMultiText.includes('📸 Photo: https://images.unsplash.com/photo-1610030469983-98e550d6193c'), 'Multi-item must include first drape photo');
assert(decodedMultiText.includes('📸 Photo: https://missmalli.in/uploads/tussar.jpg'), 'Multi-item must include second drape photo');
console.log('✓ generateWhatsAppBuyUrl includes drape image URLs for multi-item list');

// Test 6: Question URL generation
const questionUrl = generateWhatsAppQuestionUrl(updatedPhone, 'Rani Pink Silk Saree', 'KANJI-01');
assert(questionUrl.startsWith('https://wa.me/919988776655?text='), 'Question URL must route to updated normalized phone');
console.log('✓ generateWhatsAppQuestionUrl routes to updated phone');

console.log('All WhatsApp routing and image tests passed successfully!');
