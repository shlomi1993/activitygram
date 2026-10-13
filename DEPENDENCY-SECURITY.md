# Dependency security maintenance

Updated on 2026-10-13. This remains a legacy educational application; the dependency update does not clear every advisory.

## Installation

Use npm and the checked-in package-lock.json files. Obsolete Yarn lockfiles were removed so they cannot retain a separate vulnerable dependency graph. Use Node.js 22 for development. Run npm ci in the repository root, Service, Presentation, and Presentation/Activitygram_Client as needed.

The mobile app now uses Expo SDK 48, React 18.2, React Native 0.71.19, and the SDK 48 native-module compatibility versions. It keeps the native project's JSC engine. Its local .npmrc preserves legacy peer resolution because the existing navigation packages mix version 5 and version 6 APIs.

For iOS tooling, use Ruby 3.3 and bundle install in Presentation/Activitygram_Client. The updated CocoaPods lockfile includes patched ActiveSupport, Addressable, concurrent-ruby, and REXML versions.

## Validation

All four npm dependency trees installed successfully with lifecycle scripts disabled. Backend HTTP smoke tests passed for normal responses, malformed JSON, body-size limits, and image uploads. The Android JavaScript bundle exported successfully, and Firebase's compat authentication API passed an offline smoke test. Native Android and iOS builds and authenticated flows on a device were not verified.

The backend audits clean. Across the other three npm trees, the current audit reports 147 vulnerable package entries: 92 high, 54 moderate, and one low, with zero critical entries. These counts include repeated packages across independent dependency trees. The Ruby lockfile has no matching vulnerabilities in the Ruby advisory database checked on this date.

## Remaining work

The remaining npm findings include legacy React Native/Metro/CLI tooling, deprecated UI libraries, and unpatched dependencies such as braces, ip, lodash.pick, and sprintf-js. Resolving them requires supported replacements or a larger mobile-stack migration; blind major-version overrides are not a compatibility-tested fix. Keep these alerts open until their vulnerable dependency paths are actually removed or patched.
