// Handler komponen asli, transport/state dimock; tidak membaca .env,
// menghubungi API produksi, atau mengirim OTP nyata.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const filename = new URL('../src/features/auth/forgot-password-page.tsx', import.meta.url);
const componentCode = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const responseError = status => ({ response: { status, data: { error: 'Simulasi pemulihan belum berhasil. Kirim ulang kode.' } } });

function setup(options = {}) {
  const state = [];
  let cursor = 0;
  const calls = { sends: [], resets: [], redirects: [] };
  const react = {
    useState: initial => {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
    },
    useEffect: () => {},
  };
  const mocks = {
    react: { __esModule: true, default: react, ...react },
    'react/jsx-runtime': require('react/jsx-runtime'),
    'next/link': { __esModule: true, default: 'a' },
    '@/components/layout/auth-layout': { AuthLayout: 'AuthLayout' },
    '@/components/ui/glass-card': { GlassCard: 'GlassCard' },
    '@/components/ui/glow-button': { GlowButton: 'GlowButton' },
    '@/lib/supabase': { supabase: options.missingConfig ? null : { auth: {
      signInWithOtp: async payload => {
        calls.sends.push(payload);
        if (options.sendWait) await options.sendWait;
        if (options.sendThrow) throw new Error('Simulasi jaringan');
        return { error: options.sendError ?? null };
      },
      verifyOtp: () => { throw new Error('OTP reset harus dikonsumsi backend'); },
      updateUser: () => { throw new Error('Password LOPs bukan password Supabase'); },
    } } },
    '@/lib/api': { authApi: { resetPassword: async (...args) => {
      calls.resets.push(args);
      if (options.resetWait) await options.resetWait;
      if (options.resetError) throw options.resetError;
      return { data: { message: 'Password berhasil diperbarui' } };
    } } },
  };
  const module = { exports: {} };
  vm.runInNewContext(componentCode, {
    exports: module.exports,
    require: name => { assert.ok(name in mocks, `Import tidak dimock: ${name}`); return mocks[name]; },
  });
  const render = () => { cursor = 0; return module.exports.ForgotPasswordPage(); };
  const elements = (node, found = []) => {
    if (Array.isArray(node)) node.forEach(child => elements(child, found));
    else if (node?.props) { found.push(node); elements(node.props.children, found); }
    return found;
  };
  const textOf = node => Array.isArray(node) ? node.map(textOf).join(' ') : node?.props ? textOf(node.props.children) : typeof node === 'string' ? node : '';
  const find = predicate => {
    const matches = elements(render()).filter(predicate);
    assert.equal(matches.length, 1, 'Elemen harus unik');
    return matches[0];
  };
  const fill = (id, value) => find(node => node.props.id === id).props.onChange({ target: { value } });
  const submit = () => find(node => node.type === 'form').props.onSubmit({ preventDefault() {} });
  const resend = () => find(node => node.type === 'button' && textOf(node).startsWith('Kirim ulang'));
  const resetVisible = () => elements(render()).some(node => node.props.id === 'recovery-code');
  const fillReset = (code = '123456', password = 'password-test-only', confirmation = password) => {
    fill('recovery-code', code); fill('recovery-password', password); fill('recovery-confirmation', confirmation);
  };
  const start = async (email = 'pemilik@example.test') => { fill('recovery-email', email); await submit(); };
  return { options, calls, render, find, fill, submit, resend, resetVisible, fillReset, start, text: () => textOf(render()) };
}
let total = 0;
async function check(label, run) { await run(); total++; console.log(`  OK ${label}`); }

for (const email of ['', 'bukan-email', '081234567890']) {
  await check('email tidak valid tidak mengirim kode atau mengubah password', async () => {
    const h = setup(); await h.start(email);
    assert.equal(h.calls.sends.length, 0); assert.equal(h.calls.resets.length, 0); assert.equal(h.resetVisible(), false);
  });
}
await check('email dinormalisasi dan pengiriman OTP tidak memanggil reset', async () => {
  const h = setup(); await h.start('  PEMILIK@example.test  ');
  assert.equal(h.calls.sends[0].email, 'pemilik@example.test');
  assert.equal(h.calls.resets.length, 0); assert.equal(h.resetVisible(), true);
  assert.equal(h.resend().props.disabled, true); assert.match(h.text(), /Kirim ulang \(60s\)/);
});
for (const options of [{ missingConfig: true }, { sendThrow: true }, { sendError: { status: 503 } }]) {
  await check('gangguan pengiriman tetap pada form OTP dengan retry tanpa sukses palsu', async () => {
    const h = setup(options); await h.start();
    assert.equal(h.resetVisible(), true); assert.equal(h.resend().props.disabled, false);
    assert.equal(h.calls.resets.length, 0); assert.match(h.text(), /belum/);
    assert.equal(h.find(node => node.props.role === 'alert').props.children.length > 0, true);
  });
}
await check('rate limit pengiriman menerapkan cooldown', async () => {
  const h = setup({ sendError: { status: 429 } }); await h.start();
  assert.equal(h.resend().props.disabled, true); assert.match(h.text(), /Kirim ulang \(60s\)/);
});
await check('resend setelah gangguan dapat mengirim ulang dan mencegah klik selama cooldown', async () => {
  const options = { sendThrow: true }; const h = setup(options); await h.start();
  options.sendThrow = false; await h.resend().props.onClick();
  assert.equal(h.calls.sends.length, 2); assert.equal(h.resend().props.disabled, true);
  await h.resend().props.onClick(); assert.equal(h.calls.sends.length, 2);
});
await check('mengubah email tidak melewati cooldown pengiriman', async () => {
  const h = setup(); await h.start();
  h.find(node => node.type === 'button' && node.props.children === 'Ubah email').props.onClick();
  await h.submit(); assert.equal(h.calls.sends.length, 1);
});
for (const args of [['123', 'password-test-only', 'password-test-only'], ['123456', 'abc', 'abc'], ['123456', 'password-test-only', 'tidak-sama']]) {
  await check('kode/password/konfirmasi tidak valid berhenti sebelum API reset', async () => {
    const h = setup(); await h.start(); h.fillReset(...args); await h.submit();
    assert.equal(h.calls.resets.length, 0); assert.equal(h.resetVisible(), true);
  });
}
for (const status of [400, 401, 409, 429, 503]) {
  await check(`API ${status} tetap menampilkan kegagalan dan tidak memberi sukses palsu`, async () => {
    const h = setup({ resetError: responseError(status) }); await h.start(); h.fillReset(); await h.submit();
    assert.equal(h.resetVisible(), true); assert.match(h.text(), /belum berhasil/);
    assert.equal(h.find(node => node.props.id === 'recovery-password').props.value, 'password-test-only');
  });
}
await check('kode dapat dipaste, hanya sukses backend menampilkan kembali ke login', async () => {
  const h = setup(); await h.start(); h.fillReset('12 34 56'); await h.submit();
  assert.equal(h.calls.resets.length, 1); assert.equal(h.calls.resets[0][1], '123456');
  assert.equal(h.resetVisible(), false); assert.match(h.text(), /Password berhasil diperbarui/);
  assert.equal(h.find(node => node.props.children === 'Login dengan password baru').props.href, '/login');
});
await check('status busy membedakan pengiriman kode dan pembaruan password', async () => {
  let finishSend, finishReset;
  const h = setup({
    sendWait: new Promise(resolve => { finishSend = resolve; }),
    resetWait: new Promise(resolve => { finishReset = resolve; }),
  });
  const sending = h.start();
  assert.match(h.text(), /Mengirim kode/); assert.equal(h.find(node => node.type === 'form').props['aria-busy'], true);
  finishSend(); await sending; h.fillReset();
  const resetting = h.submit(); assert.match(h.text(), /Memperbarui password/);
  finishReset(); await resetting; assert.equal(h.resetVisible(), false);
});
await check('401 endpoint reset tidak menghapus sesi aplikasi atau memaksa navigasi login', async () => {
  const redirects = [], removals = [], requests = [];
  let rejectResponse;
  const axios = { create: () => ({
    interceptors: { request: { use() {} }, response: { use: (_resolve, reject) => { rejectResponse = reject; } } },
    post: (...args) => { requests.push(args); },
  }) };
  const apiCode = ts.transpileModule(readFileSync(new URL('../src/lib/api.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(apiCode, {
    exports: module.exports,
    require: name => { assert.equal(name, 'axios'); return { __esModule: true, default: axios }; },
    process: { env: {} },
    window: { location: { set href(value) { redirects.push(value); } } },
    localStorage: { removeItem: key => removals.push(key) },
  });
  await assert.rejects(rejectResponse({ response: { status: 401 }, config: { url: '/auth/reset-password' } }));
  assert.deepEqual(redirects, []); assert.deepEqual(removals, []);
  module.exports.authApi.resetPassword('pemilik@example.test', '123456', 'password-test-only');
  assert.equal(requests[0][0], '/auth/reset-password'); assert.equal(requests[0][2].timeout, 30000);
  await assert.rejects(rejectResponse({ response: { status: 401 }, config: { url: '/auth/me' } }));
  assert.deepEqual(redirects, ['/login']); assert.equal(removals.length, 2);
});
console.log(`\nLULUS ${total} skenario frontend pemulihan password (mock; tanpa email/API nyata).`);
