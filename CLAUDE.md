## Always Do First

- **Invoke `frontend-design` skill** before writing any frontend code. Never skip.
- **Invoke `ui-ux-pro-max` skill** before writing any frontend code. Run both together, not one instead of the other.

---

@AGENTS.md

---

## Model Routing and Delegation

Keep usage low without losing quality. (Also defined in the workspace base CLAUDE.md, repeated here for visibility.)

### Roles
- **Main session (executor):** Sonnet by default. Plans, routes, synthesizes. Does not do bulk mechanical work itself.
- **Advisor (verifier):** Fable 5, set with `/advisor`. Consulted before committing to an approach and before declaring a task complete. It reads the full transcript and returns guidance only. It cannot touch files or run commands. This is the quality gate, so do not add separate "remember to test" reminders.
- **Workers (subagents):** do the actual work on the cheapest model that fits the subtask.

### When to delegate
Spawn a worker for mechanical or bulk edits, scoped research, codebase search, and anything parallelizable. Each worker gets its own clean context. Do not spawn when the parent needs to hold the reasoning, when synthesis must stay in one head, or when spawn overhead dominates.

### Model per worker (cheapest that does the job well)
- `worker-haiku`: bulk mechanical work with no judgment (renames, find-and-replace, formatting, boilerplate).
- `worker-sonnet`: scoped research, code exploration, bounded edits, focused debugging.
- `heavy-context`: jobs too large for a normal worker (whole-repo reads, large-document analysis, long migrations). Runs on Opus, which is auto-upgraded to 1M context on Max, Team, and Enterprise plans. There is no automatic handoff when a smaller worker fills its context, so route here deliberately by size.

These three are defined in `.claude/agents/`. If they are missing, ask me to create them.

### Context hygiene
`/compact` after each completed task. `/clear` between unrelated tasks. Never carry a finished task's files and diffs into the next one. Sessions above 150k context are the main cost driver.

### Do not
- Do not set `CLAUDE_CODE_SUBAGENT_MODEL`. It overrides every worker's model and cancels the routing above.
- Do not skip the advisor consult on non-trivial tasks.
