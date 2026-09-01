import crypto from "crypto";

export interface GitHubAppConfig {
  appId: string;
  privateKey: string;
  clientId?: string;
  clientSecret?: string;
}

/**
 * Creates an RS256 signed JSON Web Token (JWT) for GitHub App authentication.
 * Valid for 10 minutes (GitHub maximum).
 */
export function generateGitHubAppJWT(appId: string, privateKey: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // 1 minute in the past for clock drift
    exp: now + 9 * 60, // 9 minutes expiration
    iss: appId,
  };

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(dataToSign);

  // Normalize private key if escaped newlines were provided in env
  const formattedKey = privateKey.replace(/\\n/g, "\n");
  const signature = signer.sign(formattedKey, "base64url");

  return `${dataToSign}.${signature}`;
}

/**
 * Retrieves the installation ID for a given GitHub username.
 */
export async function getUserInstallationId(
  appId: string,
  privateKey: string,
  username: string
): Promise<number | null> {
  const jwt = generateGitHubAppJWT(appId, privateKey);

  // First try direct user installation endpoint
  const userRes = await fetch(`https://api.github.com/users/${username}/installation`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "100-Days-Of-Code-Platform",
    },
  });

  if (userRes.ok) {
    const data = await userRes.json();
    return data.id;
  }

  // Fallback: search all installations of the app
  try {
    const listRes = await fetch("https://api.github.com/app/installations?per_page=100", {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "100-Days-Of-Code-Platform",
      },
    });

    if (listRes.ok) {
      const installations: any[] = await listRes.json();
      const match = installations.find(
        (inst) => inst.account?.login?.toLowerCase() === username.toLowerCase()
      );
      if (match) {
        return match.id;
      }
    }
  } catch (e) {
    console.warn("Could not list installations:", e);
  }

  return null;
}

/**
 * Exchanges GitHub App JWT for a short-lived Installation Access Token (1 hour).
 */
export async function getInstallationAccessToken(
  appId: string,
  privateKey: string,
  installationId: string | number
): Promise<string> {
  const jwt = generateGitHubAppJWT(appId, privateKey);

  const res = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "100-Days-Of-Code-Platform",
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to get installation access token (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.token;
}

/**
 * Creates or ensures the 100-days-of-code repository exists on the student's GitHub account.
 */
export async function ensureStudentRepository(params: {
  installationToken: string;
  owner: string;
  repoName?: string;
  description?: string;
}): Promise<{ repoUrl: string; fullName: string; exists: boolean }> {
  const repoName = params.repoName || "100-days-of-code";
  const headers = {
    Authorization: `Bearer ${params.installationToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "100-Days-Of-Code-Platform",
  };

  // 1. Check if repository already exists
  const checkRes = await fetch(`https://api.github.com/repos/${params.owner}/${repoName}`, {
    headers,
  });

  if (checkRes.ok) {
    const repoData = await checkRes.json();
    return {
      repoUrl: repoData.html_url,
      fullName: repoData.full_name,
      exists: true,
    };
  }

  // 2. Create the repository
  const createRes = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: repoName,
      description:
        params.description ||
        "🚀 100 Days of Code — Structured Data Structures & Algorithms Solutions & Notes",
      private: false,
      auto_init: true,
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create repository on GitHub (${createRes.status}): ${errText}`);
  }

  const newRepo = await createRes.json();

  // 3. Initialize Root README.md
  try {
    const rootReadme = `# 100 Days of Code — Structured DSA Portfolio 🚀

Welcome to my 100 Days of Code challenge repository! This repo contains daily Data Structures & Algorithms problem solutions, step-by-step logic explanations, dry runs, and time/space complexity analyses.

## 📊 Challenge Progress
Track my daily solutions and streak live on [100 Days of Code Platform](https://100dayscode-gamma.vercel.app).

---
*Auto-synced via [100 Days of Code](https://100dayscode-gamma.vercel.app)*
`;

    await commitFileToRepo({
      installationToken: params.installationToken,
      owner: params.owner,
      repo: repoName,
      path: "README.md",
      content: rootReadme,
      commitMessage: "Initial commit: 100 Days of Code DSA Portfolio setup",
    });
  } catch (e) {
    console.warn("Could not write initial root README:", e);
  }

  return {
    repoUrl: newRepo.html_url,
    fullName: newRepo.full_name,
    exists: false,
  };
}

/**
 * Commits a file (creates or updates) to a GitHub repository.
 */
export async function commitFileToRepo(params: {
  installationToken: string;
  owner: string;
  repo: string;
  path: string;
  content: string;
  commitMessage: string;
}): Promise<{ commitSha: string; commitUrl: string; fileUrl: string }> {
  const headers = {
    Authorization: `Bearer ${params.installationToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "100-Days-Of-Code-Platform",
  };

  const fileApiUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`;

  // 1. Check if file already exists to get its SHA (required for GitHub update)
  let existingSha: string | undefined = undefined;
  try {
    const getRes = await fetch(fileApiUrl, { headers });
    if (getRes.ok) {
      const fileData = await getRes.json();
      existingSha = fileData.sha;
    }
  } catch {
    // New file
  }

  // 2. Put file contents (Base64 encoded)
  const base64Content = Buffer.from(params.content, "utf-8").toString("base64");

  const body: any = {
    message: params.commitMessage,
    content: base64Content,
  };
  if (existingSha) {
    body.sha = existingSha;
  }

  const putRes = await fetch(fileApiUrl, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub Commit Error for ${params.path} (${putRes.status}): ${errText}`);
  }

  const result = await putRes.json();
  const commitSha = result.commit?.sha || "sha-committed";
  const commitUrl = `https://github.com/${params.owner}/${params.repo}/commit/${commitSha}`;
  const fileUrl = result.content?.html_url || `https://github.com/${params.owner}/${params.repo}/blob/main/${params.path}`;

  return {
    commitSha,
    commitUrl,
    fileUrl,
  };
}
