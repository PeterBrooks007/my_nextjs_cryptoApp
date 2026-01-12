import { z } from "zod";
import DOMPurify from "dompurify";

// Decode HTML entities
export function decodeEntities(input: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = input;
  return txt.value;
}

export function sanitizedString(message = "Invalid input detected!") {
  return z.string().refine(
    (value) => {
      const decoded = decodeEntities(value);
      const sanitized = DOMPurify.sanitize(value);
      return sanitized === decoded;
    },
    { message }
  );
}
