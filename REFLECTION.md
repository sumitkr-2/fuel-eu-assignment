Reflection on Using AI Agents in Development

Developing the FuelEU Maritime Compliance Platform was a technically challenging and rewarding experience.
This project tested my ability to combine domain reasoning, clean architecture, and multi-agent AI collaboration effectively.

🧠 What I Learned
1. AI as a Real Engineering Assistant

Working with multiple AI tools showed me how powerful they can be when used strategically:

Gemini was great for setup — scaffolding, Prisma schema, and environment configuration.

ChatGPT (GPT-5) handled the heavy lifting — designing backend logic, debugging Prisma issues, and generating frontend logic.

Cursor Agent helped clean up TypeScript paths and refactor imports.

GitHub Copilot accelerated frontend styling and JSX generation.

Instead of treating AI as an autocomplete tool, I treated it as a pair-programmer — verifying logic, asking for alternatives, and improving readability.

2. AI Can Design Architecture, but Humans Must Validate It

AI agents can now create advanced patterns like Hexagonal Architecture and Ports & Adapters nearly flawlessly.
However, I learned that correctness ≠ understanding:

AI-generated imports often broke due to alias mismatches.

Prisma schema references and seed data sometimes lacked constraints.

Logical consistency (like percentDiff vs differencePercent) needed human review.

I realized that AI handles syntax and structure, but humans handle context and correctness.

3. Collaboration Between Agents Boosts Productivity

Each agent brought a specific strength:

Agent	Strength
Gemini	Setup, database bootstrapping
GPT-5	Reasoning, refactoring, error diagnosis
Cursor	Path alias & refactor tooling
Copilot	Inline Tailwind/UI assistance

Using them together made development 3× faster.
For example, GPT-5 handled core logic, while Copilot finished repetitive JSX and Tailwind markup instantly.

4. Efficiency Gains and Trade-Offs

With AI assistance, project setup and base architecture that might take a full day was completed in under 2 hours.
Debugging was faster because AI could explain Prisma errors and suggest the right migrations.

However, it also required constant verification — blindly copying code led to subtle bugs or schema mismatches.
The key was collaborative iteration, not automation.

5. How This Changed My Engineering Mindset

Before this project, I used AI tools mostly for syntax help.
After working through backend logic, Prisma issues, and frontend API integration with GPT-5, I realized that:

AI isn’t replacing developers — it’s amplifying them.

I now use AI to reason about architecture, not just code.
It’s like having a senior developer constantly reviewing, explaining, and proposing alternatives — if you guide it properly.

🚀 Next Steps & Improvements

Add automated tests (Jest + Supertest) for compliance, banking, and pooling use cases.

Generate OpenAPI documentation automatically from TypeScript types.

Containerize the backend with Docker for reproducible environments.

Explore AI-generated test scaffolding and automated code review prompts for future work.

🎯 Conclusion

This project proved that AI-assisted engineering can accelerate complex system design while maintaining architectural discipline.
Gemini, GPT-5, Cursor, and Copilot each acted like specialized team members — speeding up setup, improving design, and reducing errors.

AI didn’t write my project — it co-engineered it.
I provided intent, validation, and structure; the agents provided speed and precision.

Together, we built a production-ready compliance system faster and cleaner than traditional development could allow.

✅ Author: Sumit Kumar

Full-Stack Developer | AI-Driven Software Engineering