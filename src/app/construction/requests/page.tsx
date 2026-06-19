import { AppLayout } from "@/components/layout/app-layout";
import { prisma } from "@/lib/prisma";
import { RequestsClient } from "./RequestsClient";

export default async function ConstructionRequestsPage() {
  const requests = await prisma.constructionRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppLayout>
      <RequestsClient requests={requests} />
    </AppLayout>
  );
}
