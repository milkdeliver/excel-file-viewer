# Vibe Coding Standard Rules

## 1. 核心哲学 (Core Philosophy)
- **意图重于细节**：专注于实现我的高层意图，而不是纠结于微小的重构，除非它影响功能。
- **保持节奏**：快速给出可运行的代码。如果遇到复杂方案和简单方案，优先选择能快速验证想法的简单方案。
- **原生优先**：优先使用框架原生 API，减少不必要的第三方库依赖。

## 2. 代码风格与质量 (Code Style & Quality)
- **简洁性**：严禁冗长的注释。代码应该自解释。删除所有 "Here is the updated code" 之类的废话。
- **现代语法**：默认使用 TypeScript, ESNext 语法, Tailwind CSS。
- **无占位符**：禁止在输出中写 // ... rest of code ...。必须输出完整的、可直接运行的代码块，除非我明确要求只显示差异。
- **错误处理**：不要为了简洁而忽略错误处理，确保有基本的 try/catch 或错误边界。

## 3. 交互规范 (Interaction Rules)
- **拒绝说教**：不要向我解释基础知识（如什么是 React Hook），直接展示实现。
- **主动式思考**：如果你发现我的逻辑中有潜在的 Bug 或更优的 Vibe（比如更酷的动画、更简洁的 UI），请在修改时直接应用并简要说明。
- **静默修改**：对于拼写错误、格式调整，直接修复，无需询问。

## 4. 技术栈偏好 (Tech Stack Preferences)
- **UI**: React (Next.js App Router), Tailwind CSS, Lucide React Icons.
- **State**: React Server Components > Context API > Zustand.
- **Backend**: Supabase / Prisma / Server Actions.