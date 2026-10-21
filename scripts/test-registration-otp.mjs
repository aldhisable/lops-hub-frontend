// Jalankan handler komponen asli dengan state hooks, router, dan layanan dimock.
// Tidak memakai browser, .env, database, atau mengirim email. Bukan tes refresh DOM.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const filename = new URL('../src/features/auth/register-page.tsx', import.meta.url);
const componentCode = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const responseError = (status, error = 'Layanan sementara tidak tersedia') => ({ response: { status, data: { error } } });

function setup(options = {}) {
  const state = [];
  let cursor = 0;
  const calls = { checks: [], sends: [], verifies: [], registers: [], redirects: [] };
  const react = {
    useState: initial => {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
    },
    useEffect: () => {}, // cooldown hanya diuji nilai/disabled, tanpa timer sungguhan
  };
  const register = async data => {
    calls.registers.push(data);
    if (options.registerError) throw options.registerError;
    return { redirectTo: '/workspace' };
  };
  const api = { checkRegistrationEmail: async email => {
    calls.checks.push(email);
    if (options.checkWait) await options.checkWait;
    if (options.checkError) throw options.checkError;
    return { data: { available: true } };
  } };
  const supabase = options.missingConfig ? null : { auth: {
    signInWithOtp: async data => {
      calls.sends.push(data);
      if (options.sendWait) await options.sendWait;
      if (options.sendThrow) throw new Error('Simulasi jaringan OTP');
      return { error: options.sendError ?? null };
    },
    verifyOtp: async data => {
      calls.verifies.push(data);
      if (options.verifyThrow) throw new Error('Simulasi jaringan verifikasi');
      return { data: { session: options.noSession ? null : { access_token: 'otp-proof-test-only' } }, error: options.verifyError ?? null };
    },
  } };
  const mocks = {
    react: { __esModule: true, default: react, ...react },
    'react/jsx-runtime': require('react/jsx-runtime'),
    'next/link': { __esModule: true, default: 'a' },
    'next/navigation': { useRouter: () => ({ push: path => calls.redirects.push(path) }) },
    '@/components/layout/auth-layout': { AuthLayout: 'AuthLayout' },
    '@/components/ui/glass-card': { GlassCard: 'GlassCard' },
    '@/components/ui/glow-button': { GlowButton: 'GlowButton' },
    '@/context/auth-context': { useAuth: () => ({ register }) },
    '@/lib/constants': { UMKM_CATEGORIES: ['Craft'] },
    '@/lib/supabase': { supabase },
    '@/lib/api': { authApi: api },
  };
  const module = { exports: {} };
  vm.runInNewContext(componentCode, {
    exports: module.exports,
    require: name => { assert.ok(name in mocks, `Import tak dimock: ${name}`); return mocks[name]; },
  }, { filename: filename.pathname });
  const render = () => { cursor = 0; return module.exports.RegisterPage(); };
  const elements = (node, result = []) => {
    if (Array.isArray(node)) node.forEach(child => elements(child, result));
    else if (node?.props) { result.push(node); elements(node.props.children, result); }
    return result;
  };
  const find = predicate => {
    const result = elements(render()).filter(predicate);
    assert.equal(result.length, 1, 'Elemen harus unik');
    return result[0];
  };
  const textOf = node => Array.isArray(node) ? node.map(textOf).join(' ') : node?.props ? textOf(node.props.children) : typeof node === 'string' ? node : '';
  const text = () => textOf(render());
  const fill = (placeholder, value) => find(node => node.props.placeholder === placeholder).props.onChange({ target: { value } });
  const fillForm = (email = 'baru@example.test') => {
    fill('Nama lengkap Anda', 'Pemilik Uji'); fill('Nama UMK / brand usaha', 'UMK Contoh');
    find(node => node.type === 'select').props.onChange({ target: { value: 'Craft' } });
    fill('email@usaha.id', email); fill('Minimal 6 karakter', 'password-test-only'); fill('Ulangi password', 'password-test-only');
  };
  const submit = () => find(node => node.type === 'form').props.onSubmit({ preventDefault() {} });
  const resend = () => find(node => node.type === 'button' && textOf(node).startsWith('Kirim ulang'));
  const otpVisible = () => elements(render()).some(node => node.props.id === 'registration-otp');
  return { calls, options, fill, fillForm, submit, resend, otpVisible, text, find };
}

let total = 0;
async function check(label, run) {
  await run(); total++; console.log(`  OK ${label}`);
}
await check('email duplikat menampilkan notifikasi, tanpa mengirim OTP/membuat akun', async () => {
  const h = setup({ checkError: responseError(409) }); h.fillForm(); await h.submit();
  assert.equal(h.otpVisible(), false); assert.match(h.text(), /Email sudah terdaftar/);
  assert.equal(h.calls.sends.length, 0); assert.equal(h.calls.registers.length, 0); assert.equal(h.calls.redirects.length, 0);
});
for (const options of [
  { missingConfig: true }, { sendThrow: true }, { sendError: { status: 503 } }, { checkError: responseError(503) },
]) {
  await check('gangguan layanan tetap membuka OTP dan tombol resend, tanpa membuat akun', async () => {
    const h = setup(options); h.fillForm(); await h.submit();
    assert.equal(h.otpVisible(), true); assert.equal(h.resend().props.disabled, false);
    assert.equal(h.calls.registers.length, 0); assert.equal(h.calls.redirects.length, 0);
    assert.match(h.text(), /Kirim ulang kode/); assert.doesNotMatch(h.text(), /telah dikirim/);
  });
}
await check('setelah jaringan pulih, resend memeriksa email dan mengirim ulang kode', async () => {
  const options = { sendThrow: true };
  const h = setup(options); h.fillForm(); await h.submit();
  options.sendThrow = false;
  await h.resend().props.onClick();
  assert.equal(h.calls.checks.length, 2); assert.equal(h.calls.sends.length, 2);
  assert.equal(h.resend().props.disabled, true); assert.match(h.text(), /Kode OTP telah dikirim/);
  assert.equal(h.calls.registers.length, 0);
  assert.match(h.text(), /Kirim ulang \(60s\)/);
});
await check('label loading membedakan pemeriksaan email dan pengiriman; kegagalan membuka resend', async () => {
  let finishCheck, finishSend;
  const options = {
    checkWait: new Promise(resolve => { finishCheck = resolve; }),
    sendWait: new Promise(resolve => { finishSend = resolve; }),
    sendThrow: true,
  };
  const h = setup(options); h.fillForm();
  const pending = h.submit();
  assert.match(h.text(), /Memeriksa email/); assert.equal(h.resend().props.disabled, true);
  finishCheck();
  await new Promise(resolve => setImmediate(resolve));
  assert.match(h.text(), /Mengirim kode/); assert.doesNotMatch(h.text(), /Memverifikasi/);
  assert.equal(h.resend().props.disabled, true);
  finishSend(); await pending;
  assert.equal(h.otpVisible(), true); assert.equal(h.resend().props.disabled, false);
  assert.equal(h.calls.registers.length, 0);
});
await check('resend juga menolak email yang telah terdaftar sejak percobaan pertama', async () => {
  const options = { sendThrow: true }; const h = setup(options); h.fillForm(); await h.submit();
  options.checkError = responseError(409);
  await h.resend().props.onClick();
  assert.equal(h.otpVisible(), false); assert.match(h.text(), /Email sudah terdaftar/); assert.equal(h.calls.sends.length, 1);
});
await check('rate limit tetap di halaman OTP dengan cooldown', async () => {
  const h = setup({ sendError: { status: 429 } }); h.fillForm(); await h.submit();
  assert.equal(h.otpVisible(), true); assert.equal(h.resend().props.disabled, true); assert.match(h.text(), /Terlalu banyak permintaan/);
});
for (const options of [{ verifyError: { status: 401 } }, { verifyThrow: true }, { noSession: true }]) {
  await check('OTP tidak sah/gagal tanpa sesi tidak memanggil register', async () => {
    const h = setup(options); h.fillForm(); await h.submit(); h.fill('Masukkan kode dari email', '12345678'); await h.submit();
    assert.equal(h.otpVisible(), true); assert.equal(h.calls.registers.length, 0); assert.equal(h.calls.redirects.length, 0);
  });
}
await check('hanya OTP sah yang meneruskan bukti dan email normal ke backend', async () => {
  const h = setup(); h.fillForm('  BARU@example.test  '); await h.submit();
  assert.equal(h.calls.registers.length, 0); assert.equal(h.calls.checks[0], 'baru@example.test');
  h.fill('Masukkan kode dari email', '12345678'); await h.submit();
  assert.equal(h.calls.registers.length, 1); assert.equal(h.calls.registers[0].otpToken, 'otp-proof-test-only');
  assert.equal(h.calls.registers[0].email, 'baru@example.test'); assert.deepEqual(h.calls.redirects, ['/workspace']);
});
await check('backend sementara gagal: retry tidak mengonsumsi ulang OTP yang sudah benar', async () => {
  const options = { registerError: responseError(503) };
  const h = setup(options); h.fillForm(); await h.submit(); h.fill('Masukkan kode dari email', '12345678'); await h.submit();
  assert.equal(h.otpVisible(), true); assert.equal(h.calls.redirects.length, 0);
  options.registerError = null; await h.submit();
  assert.equal(h.calls.verifies.length, 1); assert.equal(h.calls.registers.length, 2); assert.deepEqual(h.calls.redirects, ['/workspace']);
});
await check('konflik email setelah OTP kembali ke form dengan pemberitahuan', async () => {
  const h = setup({ registerError: responseError(409, 'Email sudah terdaftar') });
  h.fillForm(); await h.submit(); h.fill('Masukkan kode dari email', '12345678'); await h.submit();
  assert.equal(h.otpVisible(), false); assert.match(h.text(), /Email sudah terdaftar/); assert.equal(h.calls.redirects.length, 0);
});
await check('401 verifikasi register tidak mengalihkan ke login; 401 sesi lain tetap dialihkan', async () => {
  let rejectResponse;
  const redirects = [], removals = [], requests = [];
  const axios = { create: () => ({ interceptors: {
    request: { use() {} }, response: { use: (_resolve, reject) => { rejectResponse = reject; } },
  }, post: (...args) => { requests.push(args); } }) };
  const module = { exports: {} };
  const apiCode = ts.transpileModule(readFileSync(new URL('../src/lib/api.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const location = { set href(value) { redirects.push(value); } };
  vm.runInNewContext(apiCode, {
    exports: module.exports, require: name => { assert.equal(name, 'axios'); return { __esModule: true, default: axios }; },
    process: { env: {} }, window: { location }, localStorage: { removeItem: key => removals.push(key) },
  });
  await assert.rejects(rejectResponse({ response: { status: 401 }, config: { url: '/auth/register' } }));
  assert.deepEqual(redirects, []); assert.deepEqual(removals, []);
  await assert.rejects(rejectResponse({ response: { status: 401 }, config: { url: '/auth/me' } }));
  assert.deepEqual(redirects, ['/login']); assert.equal(removals.length, 2);
  module.exports.authApi.checkRegistrationEmail('baru@example.test');
  module.exports.authApi.register({ email: 'baru@example.test' });
  assert.equal(requests[0][0], '/auth/check-email'); assert.equal(requests[0][2].timeout, 15000);
  assert.equal(requests[1][0], '/auth/register'); assert.equal(requests[1][2].timeout, 30000);
});
await check('fetch OTP dibatasi 15 detik dan tetap menghormati pembatalan pemanggil', async () => {
  const module = { exports: {} }, timeouts = [];
  let clientOptions;
  const supabaseCode = ts.transpileModule(readFileSync(new URL('../src/lib/supabase.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(supabaseCode, {
    exports: module.exports,
    require: name => {
      assert.equal(name, '@supabase/supabase-js');
      return { createClient: (_url, _key, options) => { clientOptions = options; return {}; } };
    },
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.test', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder' } },
    AbortSignal: {
      timeout: ms => { const controller = new AbortController(); timeouts.push({ ms, controller }); return controller.signal; },
      any: signals => AbortSignal.any(signals),
    },
    fetch: (_input, init) => new Promise((_resolve, reject) => {
      if (init.signal.aborted) reject(init.signal.reason);
      else init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true });
    }),
  });
  for (const upstream of [undefined, new AbortController()]) {
    const pending = clientOptions.global.fetch('https://example.test/auth/v1/otp', { signal: upstream?.signal });
    const timeout = timeouts.at(-1); assert.equal(timeout.ms, 15000);
    const rejected = assert.rejects(pending, /timeout-test/);
    timeout.controller.abort(new Error('timeout-test'));
    await rejected;
  }
  const upstream = new AbortController();
  const pending = clientOptions.global.fetch('https://example.test/auth/v1/otp', { signal: upstream.signal });
  const rejected = assert.rejects(pending, /caller-test/);
  upstream.abort(new Error('caller-test')); await rejected;
});
console.log(`\nLULUS ${total} skenario frontend registrasi OTP (handler asli, layanan/state dimock).`);
