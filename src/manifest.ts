import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest(): Promise<Manifest.WebExtensionManifest & { host_permissions: string[]}> {
  const pkg: typeof PkgType = await fs.readJSON(r('package.json'))

  return {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon-48.png',
      default_popup: './dist/popup/index.html',
    },
    content_scripts: [
      {
        matches: ['http://meet.google.com/*', 'https://meet.google.com/*'],
        js: ['./dist/contentScripts/index.global.js'],
        css: ['./dist/contentScripts/index.global.css'],
        all_frames: true,
      },
    ],
    icons: {
      19: './assets/icon-19.png',
      48: './assets/icon-48.png',
      128: './assets/icon.png',
    },
    permissions: [],
    host_permissions: ['http://meet.google.com/*', 'https://meet.google.com/*'],
    // this is required on dev for Vite script to load
    content_security_policy: isDev
      ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
      : undefined,
  }
}
