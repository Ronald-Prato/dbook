import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import css from "rollup-plugin-css-only"
import alias from "@rollup/plugin-alias"
import includeEnv from "svelte-environment-variables"
import replace from "@rollup/plugin-replace"

const production = !process.env.ROLLUP_WATCH
const pubKey = process.env.PUB_KEY
const privKey = process.env.PRIV_KEY
const epubKey = process.env.EPUB_KEY
const eprivKey = process.env.EPRIV_KEY
const relayServerUrl = process.env.RELAY_SERVER_URL
const env = process.env.ENV

const aliases = alias({
  resolve: [".svelte", ".js"], //optional, by default this will just look for .js files or folders
  entries: [
    { find: "components", replacement: "src/components" },
    { find: "layouts", replacement: "src/layoutrs" },
    { find: "utils", replacement: "src/utils" },
    { find: "secure-routes", replacement: "src/secure-routes" },
    { find: "service", replacement: "src/service" },
    { find: "store", replacement: "src/store" },
    { find: "pages", replacement: "src/pages" },
    { find: "theme", replacement: "theme" },
    { find: "gun", replacement: "gun" },
    { find: "entities", replacement: "entities" },
  ],
})

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      )

      process.on("SIGTERM", toExit)
      process.on("exit", toExit)
    },
  }
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    replace({
      "process.env.PUB_KEY": JSON.stringify(pubKey),
      "process.env.PRIV_KEY": JSON.stringify(privKey),
      "process.env.EPUB_KEY": JSON.stringify(epubKey),
      "process.env.EPRIV_KEY": JSON.stringify(eprivKey),
      "process.env.RELAY_SERVER_URL": JSON.stringify(relayServerUrl),
      "process.env.ENV": JSON.stringify(env),
    }),

    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
