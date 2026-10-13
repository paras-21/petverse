# intent/

Stage 1 of the AI-native SDLC playbook: capture intent before requirements. Copied from `C:\m0\pengu\intent\`
(same playbook, same rules); `_TEMPLATE.md` is pengu's template unchanged.

An `intent.md` is a **proto-spec**: a problem, a proposed outcome, who it affects, what constrains it, and what is
still unknown. Short, and deliberately not a design.

## The loop

1. Describe the problem in plain language.
2. Brainstorm until it is concrete.
3. Write `intent/NNN-short-name.md` from `_TEMPLATE.md`.
4. **Fill in "The premise, and what would kill it", and actually go and try to kill it.** Blocking.
5. Correct anything misread.
6. Commit it, so author and timestamp are recorded.
7. The product owner accepts or rejects it. Only then does Stage 2 (spec) begin.

## The blocking step

An intent does not become a spec while its premise is unchecked. If a single number or quote could end the work, get
it before writing anything else. If checking is genuinely expensive, that becomes phase one of the work, not a reason
to skip it.

## Status lifecycle

`draft` → `review` → `accepted` | `rejected` → `shipped`. Rejected intents stay in the folder.

## Numbering

`NNN-short-name.md`, sequential, never reused. The number is an identity, not a priority.

## Inputs

- `web3-pet-research/` (gitignored, local): the Fren Pet teardown (135 flows, 139 screenshots) and the economy
  research report. Claims from it are cited as `observed` / `inferred`, the same way pengu cites its teardown.
- `docs/DECISIONS.md`: decisions already made.
