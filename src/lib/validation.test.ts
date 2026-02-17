import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createTodoSchema } from './validation.js';

describe('Validation', () => {
  it('should validate a correct title', () => {
    const input = { title: 'Klára verkefni 2' };
    const result = createTodoSchema.safeParse(input);
    
    assert.strictEqual(result.success, true);
  });

  it('should fail if title is empty', () => {
    const input = { title: '' };
    const result = createTodoSchema.safeParse(input);

    assert.strictEqual(result.success, false);
  });

  it('should fail if title is too long', () => {
    const longTitle = 'a'.repeat(256); 
    const input = { title: longTitle };
    const result = createTodoSchema.safeParse(input);

    assert.strictEqual(result.success, false);
  });
});