export function validateAddress(address: string) {
  return (
    typeof address === 'string' &&
    address.length === 42 &&
    address.startsWith('0x')
  );
}

export function toNumberConsideringEmptyNaN(value: string) {
  return value === '' ? NaN : Number(value);
}
