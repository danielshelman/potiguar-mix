import { COLORS } from '../theme';

export default function Toast({ message }) {
  if (!message) return null;
  return <span style={{ fontSize: 13, color: COLORS.success, fontWeight: 600 }}>{message}</span>;
}
