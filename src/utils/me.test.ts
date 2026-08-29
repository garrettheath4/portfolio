import { describe, expect, it } from 'vitest';
import * as me from './me';

// These tests deliberately assert only on the *shape* of the decoded
// contact info (format/length/pattern), never on the actual decoded
// values themselves. The whole point of Base64-encoding email/address
// in me.ts is to keep that PII out of the repo's plaintext source —
// a test that hardcodes the real values would defeat that.

describe('decoded contact info', () => {
  it('decodes an email address in a plausible email shape', () => {
    expect(me.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('decodes non-empty address lines', () => {
    expect(me.address_line_1.length).toBeGreaterThan(0);
    expect(me.address_line_2.length).toBeGreaterThan(0);
  });

  it('does not leave any field as its raw Base64 (decoding actually happened)', () => {
    // A quick sanity check that atob() ran rather than the field being
    // passed through unchanged: none of these should look like Base64
    // (which is disjoint enough from an email/address in practice).
    const base64Like = /^[A-Za-z0-9+/]+=*$/;
    expect(me.email).not.toMatch(base64Like);
  });
});

describe('derived URLs and public identifiers', () => {
  it('builds linkedin_url and linkedin_short from linkedin_username', () => {
    expect(me.linkedin_url).toBe(`https://www.linkedin.com/in/${me.linkedin_username}`);
    expect(me.linkedin_short).toBe(`linkedin.com/in/${me.linkedin_username}`);
  });

  it('builds github_url from github_username', () => {
    expect(me.github_url).toBe(`https://github.com/${me.github_username}`);
  });

  it('exposes a non-empty display name and homepage URL', () => {
    expect(me.name.length).toBeGreaterThan(0);
    expect(me.homepage_url).toMatch(/^https?:\/\//);
  });
});
