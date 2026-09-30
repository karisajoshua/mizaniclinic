export const TZS_PER_USD = 2500;

export const formatUSD = (usd: number) =>
  `$${(usd || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatTZS = (usd: number) =>
  `TZS ${Math.round((usd || 0) * TZS_PER_USD).toLocaleString("en-US")}`;
