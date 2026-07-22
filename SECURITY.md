# Security policy

## Supported versions

Security fixes are applied to the latest published release line. Upgrade to the newest release before reporting behavior that may already be fixed.

## Reporting a vulnerability

Do not open a public issue containing exploit details, malicious files, private URLs, or sensitive application data.

Use GitHub private vulnerability reporting for the repository. Include:

- A clear description of the impact
- The affected SumiJS version and runtime
- A minimal reproduction
- The entry point and formatter or decoder involved
- Any relevant Content Security Policy, browser, Node, or Sharp version details

Reports are evaluated based on reproducibility and impact. Avoid testing against systems or data you do not own or have permission to assess.

## Scope

SumiJS validates generated HTML/SVG content, color syntax, font structure, decoded-image shape, and output dimensions. Applications remain responsible for remote URL policy, upload limits, decoder resource limits, credentials, and deployment configuration.
