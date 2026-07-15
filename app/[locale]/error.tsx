"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col gap-4 py-[var(--spacing-section)]">
      <Heading level={2}>Что-то пошло не так</Heading>
      <Text variant="muted">Не удалось загрузить страницу. Попробуйте ещё раз.</Text>
      <Button variant="secondary" onClick={reset} className="self-start">
        Повторить
      </Button>
    </Container>
  );
}
