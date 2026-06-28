import { redirect } from "next/navigation";

export default function HomePage() {
  // M1 has a single destination: the import screen.
  redirect("/import");
}
