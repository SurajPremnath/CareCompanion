import { redirect } from "next/navigation";

export default function SandboxPage() {
  redirect("/sandbox/simulate/app/dashboard");
}