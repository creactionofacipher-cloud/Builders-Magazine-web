import { Container } from "@/components/layout/Container";
import { Text } from "@/components/ui/Text";

export default function Loading() {
  return (
    <Container className="py-[var(--spacing-section)]">
      <Text variant="muted">Загрузка…</Text>
    </Container>
  );
}
