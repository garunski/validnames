export function useDataExport() {
  const exportUserData = async () => {
    try {
      // For file downloads, we need to use regular fetch, not fetchWithAuth
      const response = await fetch("/api/user/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add CSRF token if needed
        },
        credentials: "include", // Include cookies for auth
        body: JSON.stringify({
          includeProfile: true,
          includeApplications: true,
          includeCategories: true,
          includeDomains: true,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Failed to export data:", err);
      // Don't block deletion if export fails
    }
  };

  return {
    exportUserData,
  };
}
