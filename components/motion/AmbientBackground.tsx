// Fixed behind the whole page: three soft light fields (electric blue, violet, a pale cyan) drift slowly over
// the off-white, with a fine grid on top. Pure CSS (globals.css keyframes, transform only), so it costs no
// JavaScript and stops entirely for reduced motion.
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-a absolute -right-[20vw] -top-[25vh] h-[80vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(45,91,255,0.16),transparent)]" />
      <div className="ambient-b absolute -left-[25vw] top-[30vh] h-[80vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(122,77,255,0.13),transparent)]" />
      <div className="ambient-c absolute bottom-[-30vh] right-[10vw] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.10),transparent)]" />
    </div>
  )
}
