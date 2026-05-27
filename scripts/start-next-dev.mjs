import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nextBin = resolve(root, 'node_modules/next/dist/bin/next')

const child = spawn(process.execPath, [nextBin, 'dev', '-H', '127.0.0.1', '-p', '3000'], {
  cwd: root,
  stdio: ['pipe', 'ignore', 'ignore'],
  windowsHide: true,
})

const stop = () => {
  child.kill()
  process.exit(0)
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

setInterval(() => {
  child.stdin.write('\n')
}, 30000)
