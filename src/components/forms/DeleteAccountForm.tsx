import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Button } from "@/primitives/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/primitives/dialog";
import { Text } from "@/primitives/text";
import { useState } from "react";
import { useDataExport } from "./hooks/useDataExport";
import { useDeleteAccountState } from "./hooks/useDeleteAccountState";

interface DeleteAccountFormProps {
  onSuccess?: () => void;
}

/**
 * Simplified Delete Account Form Component
 * Single-step deletion with immediate action
 */
export function DeleteAccountForm({ onSuccess }: DeleteAccountFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { formData, setFormData, isLoading, error, setError, setIsLoading } =
    useDeleteAccountState();
  const { exportUserData } = useDataExport();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, offer data export if user wants it
      if (formData.exportData) {
        await exportUserData();
      }

      // Then delete the account immediately
      const response = await fetchWithAuth("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: formData.reason || "",
          confirmDeletion: true,
        }),
      });

      // fetchWithAuth throws on error, so if we reach here, the request was successful
      // response contains the parsed JSON data
      if (response.error) {
        throw new Error(response.error || "Failed to delete account");
      }

      setIsOpen(false);

      // Log out the user and redirect to home page
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Failed to logout:", err);
      }

      // Redirect to home page
      window.location.href = "/";

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button color="red" onClick={() => setIsOpen(true)}>
        Delete Account
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} size="md">
        <DialogTitle>Delete Your Account</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <Text className="font-medium text-red-700 dark:text-red-400">
                ⚠️ This action cannot be undone
              </Text>
              <Text className="mt-1 text-sm text-red-600 dark:text-red-300">
                All your data including applications, categories, domains, and
                check results will be permanently deleted.
              </Text>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <Text className="text-red-700 dark:text-red-400">{error}</Text>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for deletion (optional)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Please let us know why you're leaving..."
                value={
                  typeof formData.reason === "string" ? formData.reason : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="exportData"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={
                  typeof formData.exportData === "boolean"
                    ? formData.exportData
                    : false
                }
                onChange={(e) =>
                  setFormData({ ...formData, exportData: e.target.checked })
                }
              />
              <label
                htmlFor="exportData"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Export my data before deletion (recommended)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirmDeletion"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={
                  typeof formData.confirmDeletion === "boolean"
                    ? formData.confirmDeletion
                    : false
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmDeletion: e.target.checked,
                  })
                }
                required
              />
              <label
                htmlFor="confirmDeletion"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                I understand this action cannot be undone
              </label>
            </div>
          </div>
        </DialogBody>

        <DialogActions>
          <Button outline onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteAccount}
            disabled={isLoading || !formData.confirmDeletion}
          >
            {isLoading ? "Deleting..." : "Delete Account Permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
