export function Footer() {
  return (
    <footer className="w-full border-t   bg-linear-to-r from-primary  to-secondary px-6 py-10 text-center text-sm text-white font-bold font-display backdrop-blur-md">
      © {new Date().getFullYear()} DrillRecord. All rights reserved.
    </footer>
  );
}
