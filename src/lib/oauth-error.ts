"use client";

import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

/** Shared toast styling, matching the rest of the app. */
export const oauthToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
} as const;

/**
 * Friendly copy for the `?error=<code>` codes Better Auth appends to the
 * callback URL when an OAuth flow fails (see `OAUTH_CALLBACK_ERROR_CODES`
 * plus the `account not linked` → `account_not_linked` result from
 * `handleOAuthUserInfo`).
 */
const googleErrorMessages: Record<string, string> = {
  account_not_linked:
    "An account with this email address already exists. Please sign in with your email and password instead.",
  account_already_linked_to_different_user:
    "This Google account is already linked to a different user. Please sign in with your email and password instead.",
  email_does_not_match:
    "The email from your Google account doesn't match an existing account. Please try a different Google account.",
  email_not_verified:
    "Please verify your email address with Google before signing in.",
  email_not_found:
    "Your Google account didn't share an email address, so we can't sign you in.",
  state_mismatch: "Your sign-in session expired. Please try again.",
  state_not_found: "Your sign-in session expired. Please try again.",
  invalid_code: "Google sign-in failed. Please try again.",
  no_code: "Google sign-in failed. Please try again.",
  unable_to_get_user_info: "Google sign-in failed. Please try again.",
  unable_to_link_account:
    "We couldn't link your Google account. Please try again.",
  unable_to_create_user: "Google sign-in failed. Please try again.",
  oauth_provider_not_found:
    "Signing in with Google isn't available right now. Please try again later.",
  provider_not_found:
    "Signing in with Google isn't available right now. Please try again later.",
  internal_server_error:
    "Something went wrong on our side. Please try again.",
};

const fallbackMessage =
  "Something went wrong while signing in with Google. Please try again.";

export function googleAuthErrorMessage(code?: string | null): string {
  if (!code) return fallbackMessage;
  return (
    googleErrorMessages[code] ??
    googleErrorMessages[code.toLowerCase()] ??
    fallbackMessage
  );
}

/**
 * Shows a toast when the user is sent back to the current page with an
 * OAuth failure in the query string (e.g. `/login?error=account_not_linked`),
 * then strips the parameter so a refresh doesn't repeat the toast.
 */
export function useGoogleAuthErrorToast() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error");
    if (!code) return;

    toast.error(googleAuthErrorMessage(code), {
      ...oauthToastOptions,
      toastId: `oauth-error-${code}`,
    });

    params.delete("error");
    params.delete("error_description");
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + (query ? `?${query}` : ""),
    );
  }, []);
}
