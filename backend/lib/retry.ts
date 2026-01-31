export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await delay(500);
    return withRetry(fn, retries - 1);
  }
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
