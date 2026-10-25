---
name: pricing-engine
description: Implement and review product costing, suggested selling prices, profit margins, and discount calculations for Valorarte.
---

# Pricing Engine

Before making changes:

1. Read docs/BUSINESS-RULES.md.
2. Identify the exact business formula involved.
3. Check unit compatibility and missing input data.
4. Separate calculations from UI components.

Requirements:

- Use TypeScript with explicit input and output types.
- Keep calculations deterministic and independently testable.
- Avoid floating-point rounding errors in currency calculations.
- Distinguish markup from margin.
- Handle zero, negative, missing, and unusually large values.
- Never silently substitute missing costs with zero.
- Add tests for normal cases, edge cases, and rounding.
- Document any unresolved business rule instead of inventing one.
