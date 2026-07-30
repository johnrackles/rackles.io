import { describe, expect, test } from 'vitest'
import { content } from '~/content/cv-content'

describe('cv-content', () => {
  test('work experience and education entries have the expected shape', () => {
    for (const entry of content.workExperience) {
      expect(entry.company.length).toBeGreaterThan(0)
      expect(entry.position.length).toBeGreaterThan(0)
      expect(entry.timeframe).toHaveLength(2)
      expect(entry.description.length).toBeGreaterThan(0)
    }
    expect(content.education.length).toBeGreaterThan(0)
  })

  test('getTechnologies computes readable duration strings', () => {
    const technologies = content.getTechnologies()

    expect(technologies.length).toBeGreaterThan(0)
    expect(technologies.some((entry) => entry.includes('React'))).toBe(true)
    expect(technologies.some((entry) => entry.includes('TypeScript'))).toBe(
      true,
    )
    // Every duration-based entry should contain a number (e.g. "9 years"),
    // guarding against dayjs formatting regressions.
    for (const entry of technologies) {
      if (entry.includes('(')) {
        expect(entry).toMatch(/\d/)
      }
    }
  })
})
