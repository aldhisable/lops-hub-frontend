// Execute the actual guard/context with transport, hooks and navigation mocked.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const jsx = require('react/jsx-runtime');
function load(path, mocks, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: name => {
    if (name === 'react/jsx-runtime') return jsx;
    assert.ok(name in mocks, `Unexpected import ${name}`); return mocks[name];
  }, ...globals });
  return module.exports;
}
const access = load('../src/lib/role-access.ts', {});
const account = role => ({ id: role, name: role, email: `${role}@example.test`, role, isActive: true, passwordSetupRequired: false, isSuperAdmin: role === 'ADMIN_PUSAT' });
let total = 0;
async function check(label, run) { await run(); total++; console.log(`  OK ${label}`); }
for (const role of ['ADMIN_PUSAT', 'ADMIN_REGIONAL', 'UMKM']) {
  for (const target of ['ADMIN_PUSAT', 'ADMIN_REGIONAL', 'UMKM']) await check(`guard ${role} -> ${target}`, () => {
    const redirects = [];
    const context = { user: account(role), isLoading: false, sessionError: '', refreshSession: async () => {} };
    const { RoleGuard } = load('../src/components/layout/role-guard.tsx', {
      react: { useEffect: fn => fn() }, 'next/navigation': { useRouter: () => ({ replace: path => redirects.push(path) }) },
      '@/context/auth-context': { useAuth: () => context }, '@/lib/role-access': access,
    });
    const child = { privateChild: true };
    const rendered = RoleGuard({ role: target, children: child });
    assert.equal(rendered === child, role === target);
    assert.deepEqual(redirects, role === target ? [] : [access.homeForRole(role)]);
  });
}
for (const patch of [{ user: null }, { isLoading: true }, { sessionError: 'Network unavailable' }]) await check('guard tidak memasang children sebelum sesi terverifikasi', () => {
  const context = { user: account('ADMIN_PUSAT'), isLoading: false, sessionError: '', refreshSession: async () => {}, ...patch };
  const { RoleGuard } = load('../src/components/layout/role-guard.tsx', {
    react: { useEffect: fn => fn() }, 'next/navigation': { useRouter: () => ({ replace: () => {} }) },
    '@/context/auth-context': { useAuth: () => context }, '@/lib/role-access': access,
  });
  const child = { privateChild: true };
  assert.notEqual(RoleGuard({ role: 'ADMIN_PUSAT', children: child }), child);
});
await check('akun nonaktif atau belum aktivasi ditolak', () => {
  for (const patch of [{ isActive: false }, { passwordSetupRequired: true }]) assert.equal(access.hasRoleAccess({ ...account('ADMIN_PUSAT'), ...patch }, 'ADMIN_PUSAT', true), false);
});
function contextHarness(me) {
  const state = [], refs = [], storage = new Map([['auth_token', 'valid-token'], ['auth_user', '{"role":"ADMIN_PUSAT","isSuperAdmin":true}']]);
  let cursor = 0, refCursor = 0;
  const react = {
    createContext: () => ({ Provider: 'Provider' }), useContext: () => {}, useEffect: () => {}, useCallback: fn => fn,
    useRef: initial => refs[refCursor++] ?? (refs[refCursor - 1] = { current: initial }),
    useState: initial => { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }]; },
  };
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  const { AuthProvider } = load('../src/context/auth-context.tsx', {
    react: { __esModule: true, default: react, ...react }, '@/lib/api': { authApi: { me } }, '@/lib/role-access': access,
  }, { localStorage, window: { location: { href: '' }, addEventListener: () => {}, removeEventListener: () => {} } });
  return { storage, render: () => { cursor = 0; refCursor = 0; return AuthProvider({ children: null }).props.value; } };
}
await check('role di localStorage diabaikan; /auth/me menentukan role sebenarnya', async () => {
  let resolve;
  const h = contextHarness(() => new Promise(done => { resolve = done; }));
  assert.equal(h.render().user, null);
  const pending = h.render().refreshSession();
  await Promise.resolve();
  assert.equal(h.render().user, null); assert.equal(h.render().isLoading, true);
  resolve({ data: account('UMKM') }); await pending;
  assert.equal(h.render().user.role, 'UMKM');
  assert.equal(JSON.parse(h.storage.get('auth_user')).role, 'UMKM');
});
await check('kegagalan /auth/me tidak menggunakan cache admin', async () => {
  const h = contextHarness(async () => { throw new Error('offline'); });
  await h.render().refreshSession();
  assert.equal(h.render().user, null); assert.ok(h.render().sessionError);
});
await check('respons sesi lama tidak menimpa sesi baru atau logout', async () => {
  let resolve;
  const h = contextHarness(() => new Promise(done => { resolve = done; }));
  const pending = h.render().refreshSession(); await Promise.resolve(); h.storage.delete('auth_token');
  resolve({ data: account('ADMIN_PUSAT') }); await pending;
  assert.equal(h.render().user, null);
});
console.log(`\nLULUS ${total} skenario pembatasan halaman dan hidrasi sesi.`);
