import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MongoDB CSV Export Tool",
  description: "Export MongoDB collections to CSV files with ease",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  try {
    redirect("/dashboard");
  } catch (error) {
    // Log the error but still redirect
    console.error("Error during redirect:", error);
    redirect("/dashboard");
  }
}
