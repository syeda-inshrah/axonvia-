// lib/chat/diagnose.test.ts
import Anthropic from '@anthropic-ai/sdk'
import { describe, expect, it } from 'vitest'
import { describeApiKey, diagnoseChatError } from './diagnose'

// Real SDK error objects, built the same way the SDK builds them from an HTTP error response.
function apiError(status: number, type: string, message: string) {
  return Anthropic.APIError.generate(
    status,
    { type: 'error', error: { type, message }, request_id: 'req_test123' },
    undefined,
    new Headers({ 'request-id': 'req_test123' })
  )
}

describe('diagnoseChatError', () => {
  it.each([
    [401, 'authentication_error', 'invalid x-api-key', 'authentication'],
    [403, 'permission_error', 'Your API key does not have permission to use the specified resource.', 'permission'],
    [400, 'invalid_request_error', 'Your credit balance is too low to access the Anthropic API.', 'billing'],
    [404, 'not_found_error', 'model: claude-opus-5-5', 'model'],
    [429, 'rate_limit_error', 'Number of request tokens has exceeded your per-minute rate limit', 'rate_limit'],
    [529, 'overloaded_error', 'Overloaded', 'overloaded'],
    [400, 'invalid_request_error', 'fallbacks: unexpected value', 'bad_request'],
    [500, 'api_error', 'Internal server error', 'server'],
  ])('classifies HTTP %i %s as %s', (status, type, message, kind) => {
    const failure = diagnoseChatError(apiError(status, type, message))
    expect(failure).toMatchObject({ kind, status, type, requestId: 'req_test123' })
    expect(failure.message).toContain(message)
    expect(failure.hint.length).toBeGreaterThan(10)
  })

  it('classifies network failures and timeouts separately from API errors', () => {
    expect(diagnoseChatError(new Anthropic.APIConnectionTimeoutError()).kind).toBe('timeout')
    expect(diagnoseChatError(new Anthropic.APIConnectionError({ message: 'fetch failed' })).kind).toBe('connection')
  })

  it('classifies anything else as a runtime failure in our own code', () => {
    expect(diagnoseChatError(new TypeError('x is undefined'))).toMatchObject({
      kind: 'runtime',
      message: 'TypeError: x is undefined',
    })
  })

  it('never lets an API key reach the logs, even if one appears in an error message', () => {
    const leaked = 'sk-ant-api03-' + 'A'.repeat(40)
    const failure = diagnoseChatError(new Error(`bad header ${leaked}`))
    expect(JSON.stringify(failure)).not.toContain(leaked)
    expect(failure.message).toContain('[redacted]')
  })
})

describe('describeApiKey', () => {
  it('reports the shape of the key without revealing it', () => {
    expect(describeApiKey(undefined)).toBe('missing')
    expect(describeApiKey('sk-ant-api03-abc')).toBe('ok')
    expect(describeApiKey(' sk-ant-api03-abc')).toBe('has-whitespace-or-quotes')
    expect(describeApiKey('"sk-ant-api03-abc"')).toBe('has-whitespace-or-quotes')
    expect(describeApiKey('sk-proj-abc')).toBe('unexpected-prefix')
  })
})
