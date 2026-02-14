/* PDF via print */
function initPrintButton() {
  const btn = document.getElementById("btnPrint");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.print();
  });
}
