import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getInstallationAccessToken, ensureStudentRepository } from "@/lib/github/app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUsername, installationId } = body;

    if (!githubUsername) {
      return NextResponse.json(
        { error: "githubUsername is required." },
        { status: 400 }
      );
    }

    // If GitHub App keys are configured
    if (env.github.appId && env.github.privateKey && installationId) {
      const token = await getInstallationAccessToken(
        env.github.appId,
        env.github.privateKey,
        installationId
      );

      const repoInfo = await ensureStudentRepository({
        installationToken: token,
        owner: githubUsername,
        repoName: "100-days-of-code",
      });

      return NextResponse.json({
        success: true,
        repoUrl: repoInfo.repoUrl,
        fullName: repoInfo.fullName,
      });
    }

    // Fallback URL structure
    return NextResponse.json({
      success: true,
      repoUrl: `https://github.com/${githubUsername}/100-days-of-code`,
      fullName: `${githubUsername}/100-days-of-code`,
    });
  } catch (err: any) {
    console.error("[Setup Repo Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to setup repository." },
      { status: 500 }
    );
  }
}
