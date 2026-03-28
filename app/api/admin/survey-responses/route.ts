import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, buildAdminApiUrl, parseAdminSession } from "@/lib/admin-auth";

// Helper functions to map backend data to SurveyResponseRow
const toStringValue = (value: unknown, fallback = "N/A") => {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const getNestedObjectCandidates = (item: Record<string, unknown>) => {
  return Object.values(item).filter(
    (value): value is Record<string, unknown> =>
      typeof value === "object" && value !== null && !Array.isArray(value),
  );
};

const getStringField = (
  item: Record<string, unknown>,
  field: string,
  fallback = "N/A",
) => {
  const topLevel = toStringValue(item[field], "");
  if (topLevel !== "") {
    return topLevel;
  }
  const nestedCandidates = getNestedObjectCandidates(item);
  for (const candidate of nestedCandidates) {
    const nestedValue = toStringValue(candidate[field], "");
    if (nestedValue !== "") {
      return nestedValue;
    }
  }
  return fallback;
};

const mapResponseRows = (payloadContent: unknown) => {
  if (!Array.isArray(payloadContent)) {
    return [];
  }
  return payloadContent
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      email: getStringField(item, "email", "-"),
      status: getStringField(item, "status"),
      employmentStatus: getStringField(item, "employmentStatus"),
      licensureStatus: getStringField(item, "licensureStatus"),
      details: item,
    }));
};

// Proxy GET requests to the deployed backend, forwarding auth and mapping data
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  const cookieStore = cookies();
  const sessionValue = (await cookieStore).get(ADMIN_SESSION_COOKIE)?.value;
  const session = parseAdminSession(sessionValue);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Use your deployed API base URL
  const API_BASE_URL = process.env.ADMIN_API_BASE_URL!;
  const url = `${API_BASE_URL}/api/v1/admin/survey-responses${search}`;

  const backendResponse = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: session.authHeader,
    },
    cache: "no-store",
  });

  const data = await backendResponse.json();
  // Map the content to SurveyResponseRow[] if present
  if (Array.isArray(data.content)) {
    data.content = mapResponseRows(data.content);
  }
  // If backend returns 404, treat as empty result for frontend
  if (backendResponse.status === 404) {
    return NextResponse.json({ content: [], totalElements: 0 }, { status: 200 });
  }
  return NextResponse.json(data, { status: backendResponse.status });
}
