import assert from 'node:assert';
import { createNewRequest, getRequestByTokenOrNumber, updateRequestStatus } from '../app/db/d1.server.ts';

async function testRequests() {
  console.log('Testing Request creation & retrieval...');

  const created = await createNewRequest({
    source: 'buy_now',
    totalAmount: 8499,
    customerPhone: '9876543210',
    items: [
      {
        productId: 1,
        code: 'KANJI-01',
        productName: 'Rani Pink Kanjivaram',
        variantDetails: 'Pink · With blouse',
        price: 8499,
        imageUrl: '/images/products/saree-1.jpg',
      }
    ]
  });

  console.log('Created request:', created);
  assert(created.secretToken, 'secretToken must exist');
  assert(/^[0-9]{4}[A-Z]$/.test(created.requestNumber), `requestNumber must be 4 digits + 1 alphabet, got: ${created.requestNumber}`);
  console.log('✓ Validated random number + alphabet format:', created.requestNumber);

  // Test retrieval by secret token
  const retrievedByToken = await getRequestByTokenOrNumber(created.secretToken);
  assert(retrievedByToken, 'Must find request by secretToken');
  assert.strictEqual(retrievedByToken.id, created.requestId);
  console.log('✓ Found by secretToken:', retrievedByToken.requestNumber);

  // Test retrieval by request number
  const retrievedByNumber = await getRequestByTokenOrNumber(created.requestNumber);
  assert(retrievedByNumber, 'Must find request by requestNumber');
  assert.strictEqual(retrievedByNumber.secretToken, created.secretToken);
  console.log('✓ Found by requestNumber:', retrievedByNumber.requestNumber);

  // Test retrieval by lowercase request number
  const retrievedByLower = await getRequestByTokenOrNumber(created.requestNumber.toLowerCase());
  assert(retrievedByLower, 'Must find request by lowercase requestNumber');
  console.log('✓ Found by lowercase search:', created.requestNumber.toLowerCase());

  // Test retrieval with # prefix
  const retrievedWithHash = await getRequestByTokenOrNumber(`#${created.requestNumber}`);
  assert(retrievedWithHash, 'Must find request with # prefix');
  console.log('✓ Found by # prefixed search');

  // Test retrieval by id
  const retrievedById = await getRequestByTokenOrNumber(String(created.requestId));
  assert(retrievedById, 'Must find request by ID');
  console.log('✓ Found by id');

  // Test updating status
  const updated = await updateRequestStatus(created.requestId, { status: 'confirmed' });
  assert(updated, 'Must update status');
  assert.strictEqual(updated.status, 'confirmed');
  console.log('✓ Updated status to confirmed');

  console.log('All Request persistence tests passed successfully!');
}

testRequests().catch((e) => {
  console.error(e);
  process.exit(1);
});
