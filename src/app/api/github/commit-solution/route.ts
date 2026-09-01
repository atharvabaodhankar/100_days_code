import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  getUserInstallationId,
  getInstallationAccessToken,
  commitFileToRepo,
} from "@/lib/github/app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      githubUsername,
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
    let commitSha = "";
    let requiresInstallation = false;
    let requiresRepoCreation = false;
    let installUrl = `https://github.com/apps/${env.github.appSlug || "100-days-of-code-dsa"}/installations/new`;
    let createRepoUrl = `https://github.com/new?name=100-days-of-code&description=100+Days+of+Code+DSA+Portfolio&auto_init=true`;

    // 1. Check if GitHub App keys are configured
    if (env.github.appId && env.github.privateKey) {
      // Find the installation ID for this student
      const installationId = await getUserInstallationId(
        env.github.appId,
        env.github.privateKey,
        githubUsername
      );

      if (installationId) {
        console.log(`[GitHub Commit] Found installation ${installationId} for @${githubUsername}`);
        const token = await getInstallationAccessToken(
          env.github.appId,
          env.github.privateKey,
          installationId
        );

        // 2. Check if repository exists on student's account
        const checkRepoRes = await fetch(`https://api.github.com/repos/${githubUsername}/100-days-of-code`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "100-Days-Of-Code-Platform",
          },
        });

        if (!checkRepoRes.ok) {
          // Repository not created yet by student
          console.log(`[GitHub Commit] Repo 100-days-of-code not found for @${githubUsername}`);
          requiresRepoCreation = true;
        } else {
          // 3. Commit the Solution File
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

          // 4. Commit the Problem Pedagogical README.md
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
      } else {
        console.warn(`[GitHub Commit] No GitHub App installation found for @${githubUsername}`);
        requiresInstallation = true;
      }
    }

    return NextResponse.json({
      success: true,
      commitUrl,
      commitSha,
      filePath: codeFilePath,
      requiresInstallation,
      requiresRepoCreation,
      installUrl,
      createRepoUrl,
    });
  } catch (err: any) {
    console.error("[Commit Solution Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to commit solution to GitHub." },
      { status: 500 }
    );
  }
}
