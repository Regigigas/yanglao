export const metadata = {
  title: "Yanglao Terminal",
  description: "Online H5 build for the Yanglao care terminal",
};

export default function Home() {
  return (
    <main className="terminal-shell" aria-label="Yanglao Terminal">
      <iframe
        className="terminal-frame"
        src="/terminal/index.html#/pages/index/index"
        title="Yanglao Terminal"
      />
    </main>
  );
}
