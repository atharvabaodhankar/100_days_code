import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getInstallationAccessToken, commitFileToRepo } from "@/lib/github/app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      githubUsername,
      installationId,
      dayNumber,
      problemOrder,
      problemTitle,
      topic,
      difficulty,
      statement,
      observation,
      logic,
      complexity,
      language,
      code,
    } = body;

    if (!githubUsername || !dayNumber || !code) {
      return NextResponse.json(
        { error: "githubUsername, dayNumber, and code are required." },
        { status: 400 }
      );
    }

    const dayPadded = dayNumber < 10 ? `Day-0${dayNumber}` : `Day-${dayNumber}`;
    const slug = (problemTitle || `Problem-${problemOrder}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const folderPath = `${dayPadded}/Problem-${problemOrder}-${slug}`;

    const ext = language === "python" ? "py" : language === "java" ? "java" : "cpp";
    const codeFilePath = `${folderPath}/solution.${ext}`;
    const readmeFilePath = `${folderPath}/README.md`;

    let commitUrl = `https://github.com/${githubUsername}/100-days-of-code/tree/main/${folderPath}`;
    let commitSha = "local-commit-sha";

    // If GitHub App credentials & installation are available
    if (env.github.appId && env.github.privateKey && installationId) {
      const token = await getInstallationAccessToken(
        env.github.appId,
        env.github.privateKey,
        installationId
      );

      // 1. Commit the Solution File
      const codeCommit = await commitFileToRepo({
        installationToken: token,
        owner: githubUsername,
        repo: "100-days-of-code",
        path: codeFilePath,
        content: code,
        commitMessage: `Solve Day ${dayNumber} Problem ${problemOrder}: ${problemTitle || "Challenge"} (${language.toUpperCase()})`,
      });

      commitUrl = codeCommit.commitUrl;
      commitSha = codeCommit.commitSha;

      // 2. Commit the Problem Pedagogical README.md
      const problemReadme = `# ${problemTitle || "DSA Challenge"} — Day ${dayNumber}

- **Topic:** ${topic || "Data Structures & Algorithms"}
- **Difficulty:** ${difficulty || "Medium"}
- **Language:** ${language.toUpperCase()}
- **Live Challenge:** [View on 100 Days of Code Platform](${env.NEXT_PUBLIC_APP_URL}/day/${dayNumber})

---

## 📌 Problem Statement
${statement || "Solve the daily curated DSA problem with time and space optimal logic."}

---

## 💡 Pedagogical Intuition & Approach
${observation || logic || "Understand the core invariants and state transitions."}

### Step-by-Step Logic
${logic || "Optimal traversal / two-pointer / divide-and-conquer strategy."}

---

## ⏱️ Complexity Analysis
- **Time Complexity:** \`${complexity?.time || "O(N)"}\`
- **Space Complexity:** \`${complexity?.space || "O(1)"}\`

---
*Auto-synced via [100 Days of Code Platform](${env.NEXT_PUBLIC_APP_URL})*
`;

      await commitFileToRepo({
        installationToken: token,
        owner: githubUsername,
        repo: "100-days-of-code",
        path: readmeFilePath,
        content: problemReadme,
        commitMessage: `Add problem notes & README for Day ${dayNumber} Problem ${problemOrder}`,
      });
    }

    return NextResponse.json({
      success: true,
      commitUrl,
      commitSha,
      filePath: codeFilePath,
    });
  } catch (err: any) {
    console.error("[Commit Solution Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to commit solution to GitHub." },
      { status: 500 }
    );
  }
}
