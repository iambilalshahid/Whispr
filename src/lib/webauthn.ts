/**
 * WebAuthn / Passkey & Windows Hello Biometric Helper
 * Works across browsers and WebView2 / Tauri on Windows 10/11
 */

// Helper: Base64URL string to Uint8Array
export function base64UrlToBuffer(base64url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Helper: ArrayBuffer to Base64URL
export function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Check if the current device/platform supports WebAuthn / Windows Hello biometrics
 */
export async function isWebAuthnAvailable(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return false;
  }
  try {
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return Boolean(isAvailable);
  } catch {
    return false;
  }
}
import { LOCAL_STORAGE_CREDENTIAL_KEY } from "@/constant";

interface StoredCredential {
  id: string;
  email: string;
  rawId: string;
}

export function getStoredBiometricCredential(): StoredCredential | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CREDENTIAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Register a Windows Hello / Fingerprint / Passkey credential locally for the given user email
 */
export async function registerBiometricPasskey(email: string): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    throw new Error('Biometric authentication is not supported on this platform.');
  }

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const userId = new TextEncoder().encode(email);

  const creationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Chat Desktop App',
      id: window.location.hostname || 'localhost',
    },
    user: {
      id: userId,
      name: email,
      displayName: email.split('@')[0] || email,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },  // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Windows Hello / Touch ID
      userVerification: 'required',
      residentKey: 'preferred',
    },
    timeout: 60000,
    attestation: 'none',
  };

  const credential = (await navigator.credentials.create({
    publicKey: creationOptions,
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error('Credential creation was cancelled.');
  }

  const storedData: StoredCredential = {
    id: credential.id,
    email,
    rawId: bufferToBase64Url(credential.rawId),
  };

  localStorage.setItem(LOCAL_STORAGE_CREDENTIAL_KEY, JSON.stringify(storedData));
  return true;
}

/**
 * Prompt Windows Hello / Fingerprint sensor via navigator.credentials.get
 */
export async function authenticateWithBiometrics(existingEmail?: string): Promise<{
  success: boolean;
  email: string;
  credentialId: string;
}> {
  if (!window.PublicKeyCredential) {
    throw new Error('Biometric authentication is not supported on this device.');
  }

  const stored = getStoredBiometricCredential();
  const targetEmail = existingEmail || stored?.email;

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    timeout: 60000,
    userVerification: 'required',
    rpId: window.location.hostname || 'localhost',
  };

  if (stored?.rawId) {
    requestOptions.allowCredentials = [
      {
        id: base64UrlToBuffer(stored.rawId) as unknown as ArrayBuffer,
        type: 'public-key',
        transports: ['internal'],
      },
    ];
  }

  const assertion = (await navigator.credentials.get({
    publicKey: requestOptions,
  })) as PublicKeyCredential | null;

  if (!assertion) {
    throw new Error('Biometric verification cancelled.');
  }

  return {
    success: true,
    email: targetEmail || '',
    credentialId: assertion.id,
  };
}
