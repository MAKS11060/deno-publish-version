#!/usr/bin/env -S deno run -A --watch --watch-exclude="deno.*"

import {parseArgs} from 'jsr:@std/cli/parse-args'
import {format, parse, type SemVer} from 'jsr:@std/semver'

const arg = parseArgs(Deno.args, {
  alias: {
    c: ['cfg', 'config'],
    v: ['ver', 'version'],
  },
  string: ['ver', 'cfg'],
})

if (!arg.ver) {
  console.error('The publishing version has not been set')
  console.error(`Add the flag: %c'-v 1.2.3'`, 'color: green')
  Deno.exit(1)
}

const defaultConfigFiles = [
  'deno.jsonc',
  'deno.json',
  'jsr.json',
  'package.json',
]

const getConfigFile = () => {
  // check custom cfg path
  if (arg.cfg) {
    try {
      const {isFile} = Deno.lstatSync(arg.cfg)
      if (isFile) return arg.cfg
    } catch (e) {
      console.error(`Config: %c${arg.cfg}`, 'color: red', 'Not Found')
      Deno.exit(1)
    }
  }

  // find predefined config
  for (const defaultConfigFile of defaultConfigFiles) {
    try {
      const {isFile} = Deno.lstatSync(defaultConfigFile)
      if (isFile) return defaultConfigFile
    } catch (e) {}
  }

  console.error('Config file not found')
  console.error(
    `Specify the path to the configuration file using %c'-c ./path/file.json'`,
    'color: green'
  )
  Deno.exit(1)
}

const replaceVersion = (input: string, ver: SemVer): string => {
  const versionRegex = /\"version\":\s*"\d+\.\d+\.\d+"/
  if (!versionRegex.test(input)) {
    console.error(
      `The configuration file must contain the field:\n %c"version": "0.0.0"`,
      'color: green'
    )
    Deno.exit(1)
  }

  return input.replace(versionRegex, `"version": "${format(ver)}"`)
}

if (import.meta.main) {
  const cfgFile = getConfigFile()
  console.log(`Config: %c${cfgFile}`, 'color: green')

  // Read
  const cfg = Deno.readTextFileSync(cfgFile)
  const ver = parse(arg.ver.startsWith('v') ? arg.ver.slice(1) : arg.ver)
  console.log(`Version: %c${format(ver)}`, 'color: green')

  // Update
  const out = replaceVersion(cfg, ver)

  // Write
  Deno.writeTextFileSync(cfgFile, out)
} else {
  console.log('Works only in CLI mode')
  Deno.exit(1)
}
