# Gherkin Generator by domtree.com

## AI-powered Gherkin scenario generator — transforming requirements and acceptance criteria into structured, test-ready BDD scenarios.

💡 Core Idea

Gherkin Generator reads requirement documents (.docx, .pdf, .txt, or .md) and automatically creates Gherkin-formatted BDD scenarios (Given–When–Then) that reflect the user stories, acceptance criteria, and product intent described inside.

This directly bridges product documentation → automated testing, removing ambiguity between PMs, developers, and QAs.

### Installation

```bash
# Using npm
npm install -D domtree-scenario-forge

# Or using yarn
yarn add -D domtree-scenario-forge
```

🔑 API Key Setup

You’ll need an OpenAI key for AI-powered generation:

1️⃣ Create a .env file in your project root
```bash
OPENAI_API_KEY=sk-...
```

2️⃣ The CLI automatically loads this when --ai is used.

### How to use 

You can run Gherking Generator directly from your terminal using npx or locally from your project.

🪜 Step-by-Step Example
1️⃣ Add a sample requirements document

Save your requirements or acceptance criteria as data/login-requirements.docx or data/login-requirements.pdf.

2️⃣ Run the Forge

```bash
npx domtree-scenario-forge forge \
  --input data/login-requirements.pdf \
  --output features/login.feature \
  --summary features/login.summary.md \
  --feature "Login" \
  --style detailed
```

3️⃣ Output

```bash
features/
 ├─ login.feature
 └─ login.summary.md
```

✅ login.feature → Ready for Cucumber / Playwright / SpecFlow
✅ login.summary.md → Optional AI summary of features and scenarios


⚙️ Example
Input (PDF or DOCX)

```bash
Feature: Login

As a registered user,
I want to log into the system
so that I can access my dashboard.

Acceptance Criteria:
- Users must enter valid credentials.
- Invalid passwords show an error message.
- Successful login redirects to dashboard.
```

Output (auto-generated)

```bash
Feature: Login

  Scenario: Successful login with valid credentials
    Given a registered user with valid credentials
    When they enter their username and password
    Then they should be redirected to their dashboard

  Scenario: Login fails with invalid credentials
    Given a registered user
    When they enter an incorrect password
    Then an error message should be displayed
```

### Key Features
| Feature                            | Description                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| 🧾 **Multi-format input**          | Reads `.docx`, `.pdf`, `.txt`, `.md`                                               |
| 🧠 **AI-powered understanding**    | Uses GPT-4o-mini to extract user stories, acceptance criteria, and test conditions |
| ⚙️ **Structured Gherkin output**    | Outputs `.feature` files                                                           |
| 🧩 **Custom prompt templates**     | Extend or modify prompt for your team’s language/style                             |
| 🔒 **Context-aware summarization** | Handles multi-page requirement docs and merges related criteria                    |
| 🧱 **CLI-based tool**              | Run in CI, or locally via `npx domtree-scenario-forge`                             |

🛠️ Technical Architecture
| Layer                         | Responsibility                                          | Tools                  |
| ----------------------------- | ------------------------------------------------------- | ---------------------- |
| **Adapters**                  | Extract text from PDF/DOCX (reuse from Fixture Foundry) | `pdf-parse`, `mammoth` |
| **AI Core (`aiScenario.ts`)** | Prompt construction, LLM call, validation               | `openai`, `zod`        |
| **CLI (`src/cli.ts`)**        | Accepts input/output args, `--ai` flag                  | `yargs`, `chalk`       |
| **Output Writers**            | Write `.feature` and `.json` files                      | `fs/promises`          |

🧩 CLI Example
```bash
npx domtree-scenario-forge extract \
  --input docs/login-requirements.docx \
  --output features/login.feature \
  --ai
```

Optional flags:
```bash
--input    path to requirements doc
--output   .feature or .json output path
--summary  also produce a summary.md
--ai       enable AI scenario generation
```

🧠 How AI Is Used
Extracts requirements text via the adapter layer

Builds a system prompt:
```bash
You are a QA and product expert.
Read the following requirements and produce complete, human-readable Gherkin scenarios.
Group them by feature or user story.
Return only valid Gherkin syntax (Feature, Scenario, Given, When, Then).
```

- Calls gpt-4o-mini to generate output
- Validates Gherkin syntax (basic structure)
- Saves .feature file ready for Cucumber / Playwright / SpecFlow

🧱 Output Example (with summary)
features/login.feature

```bash
Feature: Login

  Scenario: Successful login
    Given a registered user
    When they enter correct credentials
    Then they are redirected to their dashboard
```

features/login.summary.md

```bash
- 2 scenarios generated
- Detected features: Login
- AI model: gpt-4o-mini
```