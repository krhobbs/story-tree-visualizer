export const downloadFile = (contents: string) => {
  const blob = new Blob([contents], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = "story-graph.json";

  setTimeout(() => {
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 1);
};
