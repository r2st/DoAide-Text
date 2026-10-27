import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { routes, metaForPath, jsonLdFor } from '../src/routeMeta.js'

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf-8')

test('paths, titles and descriptions are unique', () => {
  for (const key of ['path', 'title', 'description', 'h1']) {
    const values = routes.map((r) => r[key])
    assert.equal(new Set(values).size, values.length, `duplicate ${key}`)
  }
})

test('titles and descriptions fit search snippets', () => {
  for (const r of routes) assert.ok(r.title.length <= 70 && r.description.length <= 160, r.path)
})

test('routes match the tool list and the router exactly', () => {
  const toolPaths = [...read('../src/utils/tools.ts').matchAll(/path: '([^']+)'/g)].map((m) => m[1])
  const appPaths = [...read('../src/App.tsx').matchAll(/<Route path="([^"]+)"/g)].map((m) => `/${m[1]}`)
  const metaPaths = routes.map((r) => r.path).filter((p) => p !== '/')
  assert.deepEqual([...metaPaths].sort(), [...toolPaths].sort())
  assert.deepEqual([...metaPaths].sort(), [...appPaths].sort())
})

test('metaForPath and jsonLdFor', () => {
  assert.equal(metaForPath('/word-counter').h1, 'Word Counter')
  assert.equal(metaForPath('/nope'), undefined)
  assert.equal(jsonLdFor(routes[0]).name, 'DoAide Text')
  assert.equal(jsonLdFor(metaForPath('/text-diff')).url, 'https://text.doaide.com/text-diff')
})
