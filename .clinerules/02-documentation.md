# Documentation & Testing

Purpose: Keep docs in sync and verify behavior with concrete steps.

Docs expectations
- Update `docs/PRD.md` and `docs/FR.md` if behavior, interfaces, or assumptions change
- Keep `README.md` prompts and guardrails aligned to the latest PRD/FR
- Add/adjust examples and routes in README when endpoints change

Testing expectations
- Provide curl examples for each action/function and expected shapes
- Include negative tests for validation and not-found cases
- Document UI manual test steps (navigation, dialogs, toasts)

Change management
- Summarize user-visible changes at the end of PRs
- Note new environment variables or config keys in README and `.env.example`

