# Contributing to @ketapay/brand

Brand assets and cdn.ketapay.com. Read the README first; this file is how we work.

## Setup

`npm install`. Email images are drawn by `email-assets/build.mjs` (see the README).

## Before you open a PR

- Never delete or rename a file under `cdn/`: sent emails keep linking to it. Add a new file instead; the PR check fails otherwise.
- Colours, fonts and logos follow the KetaPay brand guidelines.

<!-- The sections below are the same in every KetaPay repo. Change them everywhere or nowhere. -->

## Branches

- Branch from `main` and open the PR into `main`.
- Name the branch after the Linear ticket: `fix/eng-123-short-description` (or `feat/`, `chore/`,
  `ci/`, `docs/`). The ticket number in the name links the PR to the ticket.

## Commits

- Conventional commits: `fix(scope): what changed`, with a body that says why.
- No AI attribution: no `Co-Authored-By` trailers for AI tools, no "generated with" footers.

## Pull requests

- Fill in the template: Summary, Rollout (anything outside the code: Infisical values, stacks,
  migrations), Linear issue (`Closes ENG-123`), Test plan.
- `CI passed` must be green. A PR can still be merged while red, but the deploy refuses any commit
  without it, so a red merge blocks everyone's next deploy.
- One ticket per PR.

## Tickets

Linear moves them; don't move them by hand. PR opened → **In Review**, merged → **Queued for
Release**, the next staging deploy → **Ready for QA**, with the deploy linked.

## Keys and settings

Every key and environment value lives in Infisical (none needed today). Never commit one, never add a
GitHub secret or variable for one. Locally: `infisical run --env=staging -- <command>`.

## Deploying

The README's Deploy section, and [How KetaPay deploys](https://github.com/KetaPay/infra/blob/staging/DEPLOYS.md) for the gates, release owners and rollback.
