import { getConstructionProjects } from "@/lib/actions/construction-actions";
import PortfolioClient from "./PortfolioClient";

export default async function PortfolioPage() {
  const result = await getConstructionProjects();
  const projects = result.success ? result.projects : [];

  return <PortfolioClient initialProjects={projects || []} />;
}
