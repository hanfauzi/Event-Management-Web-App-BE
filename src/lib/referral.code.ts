export const generateReferralCode = (username: string) => {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${username.toUpperCase().slice(0, 3)}${suffix}`;
};
