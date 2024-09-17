import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    return "Oh no, something went wrong!";
  },
})