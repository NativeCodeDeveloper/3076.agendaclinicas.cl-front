function isLocalClerkBypassEnabled() {
  return process.env.NEXT_PUBLIC_DISABLE_CLERK_LOCAL === "true" && process.env.NODE_ENV !== "production";
}

export { isLocalClerkBypassEnabled };
