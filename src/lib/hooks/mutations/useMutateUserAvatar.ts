import { useMutation } from "@tanstack/react-query";

export const useMutateUserAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // Create Request
      const fd = new FormData();
      fd.append("image", file);

      // Send request
      const response = await fetch("/api/users/avatar", {
        method: "PATCH",
        body: fd,
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
};
