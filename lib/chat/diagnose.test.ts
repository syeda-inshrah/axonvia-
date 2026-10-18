// lib/chat/diagnose.test.ts
import { ApiError } from '@google/genai'
import { describe, expect, it } from 'vitest'
import { describeApiKey, diagnoseChatError } from './diagnose'

// Real SDK errors, shaped like the Gemini API's JSON error bodies.
function apiError(status: number, code: string, message: string) {
  return new ApiError({ status, message: JSON.stringify({ error: { code: status, message, status: code } }) })
}

describe('diagnoseChatError (Gemini)', () => {
  it.each([
    [400, 'INVALID_ARGUMENT', 'API key not valid. Please pass a valid API key.', 'authentication'],
    [403, 'PERMISSION_DENIED', 'Method doesn’t allow unregistered callers.', 'permission'],
    [400, 'FAILED_PRECONDITION', 'Gemini API free tier is not available in your country. Please enable billing on your project.', 'billing'],
    [404, 'NOT_FOUND', 'models/gemini-x is not found for API version v1beta', 'model'],
    [429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota.', 'rate_limit'],
    [503, 'UNAVAILABLE', 'The model is overloaded. Please try again later.', 'overloaded'],
    [400, 'INVALID_ARGUMENT', 'Invalid value at generation_config.max_output_tokens', 'bad_request'],
    [500, 'INTERNAL', 'An internal error has occurred.', 'server'],
    [504, 'DEADLINE_EXCEEDED', 'Deadline expired before operation could complete.', 'timeout'],
  ])('classifies HTTP %i %s as %s', (status, code, message, kind) => {
    const failure = diagnoseChatError(apiError(status, code, message))
    expect(failure).toMatchObject({ kind, status, type: code })
    expect(failure.message).toContain(message)
    expect(failure.hint.length).toBeGreaterThan(10)
  })

  it('classifies network failures separately from API errors', () => {
    expect(diagnoseChatError(new TypeError('fetch failed')).kind).toBe('connection')
  })

  it('classifies anything else as a runtime failure in our own code', () => {
    expect(diagnoseChatError(new RangeError('bad index'))).toMatchObject({ kind: 'runtime', message: 'RangeError: bad index' })
  })

  it('never lets an API key reach the logs, even if one appears in an error message', () => {
    const leaked = 'AIza' + 'B'.repeat(35)
    const failure = diagnoseChatError(new ApiError({ status: 400, message: `key=${leaked} rejected` }))
    expect(JSON.stringify(failure)).not.toContain(leaked)
    expect(failure.message).toContain('[redacted]')
  })
})

describe('describeApiKey', () => {
  it('reports the shape of a Gemini key without revealing it', () => {
    expect(describeApiKey(undefined)).toBe('missing')
    expect(describeApiKey('AIzaSyExample123')).toBe('ok')
    expect(describeApiKey(' AIzaSyExample123')).toBe('has-whitespace-or-quotes')
    expect(describeApiKey('"AIzaSyExample123"')).toBe('has-whitespace-or-quotes')
    expect(describeApiKey('sk-ant-api03-abc')).toBe('unexpected-prefix')
  })
})
