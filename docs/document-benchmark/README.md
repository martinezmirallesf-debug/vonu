# Vonu Document Benchmark

This folder defines the manual benchmark used to validate document analysis before widening legal claims.

## Goal

For each synthetic test document, compare Vonu's output with a control sheet containing:
- document family
- language
- intended jurisdiction
- governing law / venue stated in the document
- expected review points
- deliberately normal clauses that should NOT be flagged
- expected missing-information / limitation notes

Track:
- true positives: expected issues detected
- false negatives: expected issues missed
- false positives: normal clauses incorrectly flagged
- jurisdiction accuracy
- whether Vonu invented facts or legal conclusions

## Rule for legal assertions

The benchmark may test whether Vonu notices a clause that deserves legal verification.
A country-specific conclusion such as 'unlawful', 'void', 'enforceable' or 'compliant' must not be treated as correct unless the rule is backed by a verified legal source maintained separately for that jurisdiction.

## Recommended first matrix

Create independent synthetic contracts for:
- Spain / Spanish
- Germany / German
- France / French
- United Kingdom / English

For each jurisdiction, include:
1. clean contract
2. one material issue
3. several material issues
4. ambiguous wording
5. mixed case with at least one deliberately normal clause that looks severe

Use `cases.example.json` as the control-sheet format.
